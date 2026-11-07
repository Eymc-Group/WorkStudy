(function () {
    "use strict";

    const DEFAULT_API_URL =
        "https://workstudy-saves.354271744.workers.dev";

    const BACKUP_PREFIX =
        "__workstudy_backup_";

    const CHUNK_SIZE =
        90000;

    const BLOCKED_KEYS =
        new Set([
            "workstudy-user",
            "workstudy-account",
            "workstudy-token",
            "user",
            "password",
            "token",
            "auth-token"
        ]);

    // Auto-save interval: every 5 minutes while logged in
    const AUTO_SAVE_INTERVAL_MS = 5 * 60 * 1000;
    const LAST_SAVED_KEY = "workstudy-last-cloud-save";

    class CloudSaveManager {
        constructor(apiUrl) {
            this.apiUrl =
                apiUrl ||
                DEFAULT_API_URL;

            this.saveStatus =
                document.getElementById(
                    "saveStatus"
                );
        }

        getCurrentUser() {
            try {
                if (
                    window.WorkStudyAuth &&
                    typeof window.WorkStudyAuth
                        .getCurrentUser ===
                        "function"
                ) {
                    return window.WorkStudyAuth
                        .getCurrentUser();
                }

                const storedUser =
                    localStorage.getItem(
                        "workstudy-user"
                    );

                if (!storedUser) {
                    return null;
                }

                try {
                    return JSON.parse(
                        storedUser
                    );
                } catch {
                    return {
                        username:
                            storedUser,

                        email:
                            null
                    };
                }

            } catch (error) {
                console.error(
                    "Could not read current user:",
                    error
                );

                return null;
            }
        }

        getAuthToken() {
            try {
                return localStorage.getItem(
                    "workstudy-token"
                );
            } catch (error) {
                console.error(
                    "Could not read login token:",
                    error
                );

                return null;
            }
        }

        getAuthenticatedSession() {
            const user =
                this.getCurrentUser();

            const token =
                this.getAuthToken();

            if (
                !user ||
                !user.username ||
                !token
            ) {
                this.updateStatus(
                    "❌ Log out and log in again to use cloud saves.",
                    "error"
                );

                return null;
            }

            return {
                user,
                token
            };
        }

        getRequestHeaders(
            token,
            includeJson = false
        ) {
            const headers = {
                "Authorization":
                    `Bearer ${token}`
            };

            if (includeJson) {
                headers[
                    "Content-Type"
                ] = "application/json";
            }

            return headers;
        }

        async readResponse(response) {
            const responseText =
                await response.text();

            if (!responseText) {
                return {};
            }

            try {
                return JSON.parse(
                    responseText
                );
            } catch {
                throw new Error(
                    "The cloud-save server returned invalid data."
                );
            }
        }

        captureSessionData() {
            return {
                user:
                    this.getCurrentUser(),

                account:
                    localStorage.getItem(
                        "workstudy-account"
                    ),

                token:
                    localStorage.getItem(
                        "workstudy-token"
                    )
            };
        }

        restoreSessionData(session) {
            if (!session) {
                return;
            }

            if (
                session.user &&
                window.WorkStudyAuth &&
                typeof window.WorkStudyAuth
                    .setCurrentUser ===
                    "function"
            ) {
                window.WorkStudyAuth
                    .setCurrentUser(
                        session.user
                    );

            } else if (session.user) {
                localStorage.setItem(
                    "workstudy-user",
                    JSON.stringify(
                        session.user
                    )
                );
            }

            if (session.account) {
                localStorage.setItem(
                    "workstudy-account",
                    session.account
                );
            }

            if (session.token) {
                localStorage.setItem(
                    "workstudy-token",
                    session.token
                );
            }
        }

        requestToPromise(request) {
            return new Promise(
                function (
                    resolve,
                    reject
                ) {
                    request.onsuccess =
                        function () {
                            resolve(
                                request.result
                            );
                        };

                    request.onerror =
                        function () {
                            reject(
                                request.error ||
                                new Error(
                                    "IndexedDB request failed."
                                )
                            );
                        };
                }
            );
        }

        transactionToPromise(
            transaction
        ) {
            return new Promise(
                function (
                    resolve,
                    reject
                ) {
                    transaction.oncomplete =
                        function () {
                            resolve();
                        };

                    transaction.onerror =
                        function () {
                            reject(
                                transaction.error ||
                                new Error(
                                    "IndexedDB transaction failed."
                                )
                            );
                        };

                    transaction.onabort =
                        function () {
                            reject(
                                transaction.error ||
                                new Error(
                                    "IndexedDB transaction was aborted."
                                )
                            );
                        };
                }
            );
        }

        openDatabase(
            name,
            version
        ) {
            return new Promise(
                function (
                    resolve,
                    reject
                ) {
                    const request =
                        indexedDB.open(
                            name,
                            version
                        );

                    request.onsuccess =
                        function () {
                            resolve(
                                request.result
                            );
                        };

                    request.onerror =
                        function () {
                            reject(
                                request.error ||
                                new Error(
                                    `Could not open IndexedDB database: ${name}`
                                )
                            );
                        };
                }
            );
        }

        deleteDatabase(name) {
            return new Promise(
                function (resolve) {
                    const request =
                        indexedDB.deleteDatabase(
                            name
                        );

                    request.onsuccess =
                        resolve;

                    request.onerror =
                        resolve;

                    request.onblocked =
                        resolve;
                }
            );
        }

        bytesToBase64(bytes) {
            let binary = "";

            const blockSize =
                8192;

            for (
                let index = 0;
                index < bytes.length;
                index += blockSize
            ) {
                const block =
                    bytes.subarray(
                        index,
                        index +
                            blockSize
                    );

                binary +=
                    String.fromCharCode(
                        ...block
                    );
            }

            return btoa(binary);
        }

        base64ToBytes(value) {
            const binary =
                atob(value);

            const bytes =
                new Uint8Array(
                    binary.length
                );

            for (
                let index = 0;
                index < binary.length;
                index += 1
            ) {
                bytes[index] =
                    binary.charCodeAt(
                        index
                    );
            }

            return bytes;
        }

        async serializeValue(value) {
            if (
                value === null ||
                typeof value ===
                    "string" ||
                typeof value ===
                    "number" ||
                typeof value ===
                    "boolean"
            ) {
                return {
                    type: "primitive",
                    value
                };
            }

            if (
                typeof value ===
                "undefined"
            ) {
                return {
                    type: "undefined"
                };
            }

            if (value instanceof Date) {
                return {
                    type: "date",
                    value:
                        value.toISOString()
                };
            }

            if (value instanceof Blob) {
                const bytes =
                    new Uint8Array(
                        await value.arrayBuffer()
                    );

                return {
                    type: "blob",
                    mime:
                        value.type || "",
                    value:
                        this.bytesToBase64(
                            bytes
                        )
                };
            }

            if (
                value instanceof
                ArrayBuffer
            ) {
                return {
                    type:
                        "array-buffer",

                    value:
                        this.bytesToBase64(
                            new Uint8Array(
                                value
                            )
                        )
                };
            }

            if (
                ArrayBuffer.isView(
                    value
                )
            ) {
                const bytes =
                    new Uint8Array(
                        value.buffer,
                        value.byteOffset,
                        value.byteLength
                    );

                return {
                    type:
                        "typed-array",

                    constructor:
                        value.constructor
                            .name,

                    value:
                        this.bytesToBase64(
                            bytes
                        )
                };
            }

            if (value instanceof Map) {
                const entries = [];

                for (
                    const [
                        mapKey,
                        mapValue
                    ] of value.entries()
                ) {
                    entries.push([
                        await this
                            .serializeValue(
                                mapKey
                            ),

                        await this
                            .serializeValue(
                                mapValue
                            )
                    ]);
                }

                return {
                    type: "map",
                    value: entries
                };
            }

            if (value instanceof Set) {
                const entries = [];

                for (
                    const item of
                    value.values()
                ) {
                    entries.push(
                        await this
                            .serializeValue(
                                item
                            )
                    );
                }

                return {
                    type: "set",
                    value: entries
                };
            }

            if (Array.isArray(value)) {
                const entries = [];

                for (
                    const item of value
                ) {
                    entries.push(
                        await this
                            .serializeValue(
                                item
                            )
                    );
                }

                return {
                    type: "array",
                    value: entries
                };
            }

            if (
                typeof value ===
                "object"
            ) {
                const objectValue = {};

                for (
                    const [
                        key,
                        item
                    ] of Object.entries(
                        value
                    )
                ) {
                    objectValue[key] =
                        await this
                            .serializeValue(
                                item
                            );
                }

                return {
                    type: "object",
                    value: objectValue
                };
            }

            return {
                type: "string",
                value: String(value)
            };
        }

        async deserializeValue(
            record
        ) {
            if (
                !record ||
                typeof record !==
                    "object"
            ) {
                return record;
            }

            if (
                record.type ===
                "primitive"
            ) {
                return record.value;
            }

            if (
                record.type ===
                "undefined"
            ) {
                return undefined;
            }

            if (
                record.type ===
                "date"
            ) {
                return new Date(
                    record.value
                );
            }

            if (
                record.type ===
                "blob"
            ) {
                return new Blob(
                    [
                        this.base64ToBytes(
                            record.value
                        )
                    ],
                    {
                        type:
                            record.mime ||
                            ""
                    }
                );
            }

            if (
                record.type ===
                "array-buffer"
            ) {
                return this
                    .base64ToBytes(
                        record.value
                    )
                    .buffer;
            }

            if (
                record.type ===
                "typed-array"
            ) {
                const bytes =
                    this.base64ToBytes(
                        record.value
                    );

                const constructors = {
                    Uint8Array,
                    Uint8ClampedArray,
                    Uint16Array,
                    Uint32Array,
                    Int8Array,
                    Int16Array,
                    Int32Array,
                    Float32Array,
                    Float64Array
                };

                const Constructor =
                    constructors[
                        record.constructor
                    ] || Uint8Array;

                return new Constructor(
                    bytes.buffer
                );
            }

            if (
                record.type ===
                "array"
            ) {
                const array = [];

                for (
                    const item of
                    record.value || []
                ) {
                    array.push(
                        await this
                            .deserializeValue(
                                item
                            )
                    );
                }

                return array;
            }

            if (
                record.type ===
                "map"
            ) {
                const map =
                    new Map();

                for (
                    const entry of
                    record.value || []
                ) {
                    map.set(
                        await this
                            .deserializeValue(
                                entry[0]
                            ),

                        await this
                            .deserializeValue(
                                entry[1]
                            )
                    );
                }

                return map;
            }

            if (
                record.type ===
                "set"
            ) {
                const set =
                    new Set();

                for (
                    const item of
                    record.value || []
                ) {
                    set.add(
                        await this
                            .deserializeValue(
                                item
                            )
                    );
                }

                return set;
            }

            if (
                record.type ===
                "object"
            ) {
                const objectValue = {};

                for (
                    const [
                        key,
                        item
                    ] of Object.entries(
                        record.value || {}
                    )
                ) {
                    objectValue[key] =
                        await this
                            .deserializeValue(
                                item
                            );
                }

                return objectValue;
            }

            return record.value;
        }

        collectStorage(storage) {
            const result = {};

            for (
                let index = 0;
                index < storage.length;
                index += 1
            ) {
                const key =
                    storage.key(index);

                if (
                    !key ||
                    BLOCKED_KEYS.has(key)
                ) {
                    continue;
                }

                const value =
                    storage.getItem(key);

                if (
                    typeof value ===
                    "string"
                ) {
                    result[key] =
                        value;
                }
            }

            return result;
        }

        collectCookies() {
            // Grab all readable cookies as key/value pairs
            const result = {};
            try {
                document.cookie.split(";").forEach(function (pair) {
                    const eqIdx = pair.indexOf("=");
                    if (eqIdx === -1) return;
                    const key = pair.slice(0, eqIdx).trim();
                    const value = pair.slice(eqIdx + 1).trim();
                    if (key && !BLOCKED_KEYS.has(key)) result[key] = value;
                });
            } catch {}
            return result;
        }

        restoreCookies(cookies) {
            if (!cookies || typeof cookies !== "object") return;
            try {
                for (const [key, value] of Object.entries(cookies)) {
                    if (!key || BLOCKED_KEYS.has(key)) continue;
                    // Restore with a generous expiry (30 days)
                    document.cookie = key + "=" + value + "; path=/; max-age=" + (30 * 24 * 3600);
                }
            } catch {}
        }

        formatBytes(bytes) {
            if (bytes < 1024) return bytes + " B";
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
            return (bytes / (1024 * 1024)).toFixed(2) + " MB";
        }

        formatTimestamp(iso) {
            try {
                const d = new Date(iso);
                return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            } catch { return iso; }
        }

        updateLastSavedLabel() {
            try {
                const ts = localStorage.getItem(LAST_SAVED_KEY);
                const el = document.getElementById("lastSavedLabel");
                if (el) el.textContent = ts ? "☁️ Last saved: " + this.formatTimestamp(ts) : "";
            } catch {}
        }

        // Export save data as a downloadable .json file
        async exportToFile() {
            const session = this.getAuthenticatedSession();
            if (!session) return;
            this.updateStatus("📦 Preparing local backup file...", "loading");
            try {
                const result = await this.collectSaveData();
                const blob = new Blob(
                    [JSON.stringify({ saveData: result.saveData, exportedAt: new Date().toISOString() }, null, 2)],
                    { type: "application/json" }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "workstudy-backup-" + new Date().toISOString().slice(0, 10) + ".json";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                this.updateStatus("✅ Backup file downloaded!", "success");
            } catch (err) {
                this.updateStatus("❌ " + (err.message || "Export failed."), "error");
            }
        }

        // Import a .json file exported by exportToFile
        async importFromFile(file) {
            if (!file) return;
            this.updateStatus("📂 Reading backup file...", "loading");
            try {
                const text = await file.text();
                const parsed = JSON.parse(text);
                const saveData = parsed.saveData || parsed;
                const backup = this.getBackupFromSaveData(saveData);
                if (!backup) throw new Error("File does not contain a valid WorkStudy backup.");

                const confirmed = window.confirm(
                    "⚠️ This will replace ALL local data with the file backup. Continue?"
                );
                if (!confirmed) { this.updateStatus("Import cancelled.", "loading"); return; }

                this.updateStatus("📂 Restoring from file...", "loading");
                await this.restoreBackup(backup);
                this.updateStatus("✅ Restored from file! Reloading...", "success");
                setTimeout(function () { window.location.reload(); }, 1500);
            } catch (err) {
                this.updateStatus("❌ " + (err.message || "Import failed."), "error");
            }
        }

        async exportIndexedDB() {
            if (
                !window.indexedDB ||
                typeof indexedDB
                    .databases !==
                    "function"
            ) {
                console.warn(
                    "This browser cannot list IndexedDB databases."
                );

                return [];
            }

            const databaseList =
                await indexedDB
                    .databases();

            const databases = [];

            for (
                const databaseInfo of
                databaseList
            ) {
                if (
                    !databaseInfo.name
                ) {
                    continue;
                }

                let database = null;

                try {
                    database =
                        await this
                            .openDatabase(
                                databaseInfo
                                    .name,

                                databaseInfo
                                    .version
                            );

                    const databaseRecord = {
                        name:
                            database.name,

                        version:
                            database.version,

                        stores: []
                    };

                    const storeNames =
                        Array.from(
                            database
                                .objectStoreNames
                        );

                    for (
                        const storeName of
                        storeNames
                    ) {
                        const transaction =
                            database.transaction(
                                storeName,
                                "readonly"
                            );

                        const store =
                            transaction
                                .objectStore(
                                    storeName
                                );

                        const keys =
                            await this
                                .requestToPromise(
                                    store
                                        .getAllKeys()
                                );

                        const values =
                            await this
                                .requestToPromise(
                                    store
                                        .getAll()
                                );

                        const indexes = [];

                        for (
                            const indexName of
                            Array.from(
                                store
                                    .indexNames
                            )
                        ) {
                            const index =
                                store.index(
                                    indexName
                                );

                            indexes.push({
                                name:
                                    index.name,

                                keyPath:
                                    index.keyPath,

                                unique:
                                    index.unique,

                                multiEntry:
                                    index.multiEntry
                            });
                        }

                        await this
                            .transactionToPromise(
                                transaction
                            );

                        const records = [];

                        for (
                            let recordIndex = 0;
                            recordIndex <
                                values.length;
                            recordIndex += 1
                        ) {
                            records.push({
                                key:
                                    await this
                                        .serializeValue(
                                            keys[
                                                recordIndex
                                            ]
                                        ),

                                value:
                                    await this
                                        .serializeValue(
                                            values[
                                                recordIndex
                                            ]
                                        )
                            });
                        }

                        databaseRecord
                            .stores
                            .push({
                                name:
                                    store.name,

                                keyPath:
                                    store.keyPath,

                                autoIncrement:
                                    store
                                        .autoIncrement,

                                indexes,
                                records
                            });
                    }

                    databases.push(
                        databaseRecord
                    );

                } catch (error) {
                    console.warn(
                        `Could not export IndexedDB database "${databaseInfo.name}":`,
                        error
                    );

                } finally {
                    if (database) {
                        database.close();
                    }
                }
            }

            return databases;
        }

        splitIntoChunks(text) {
            const chunks = [];

            for (
                let index = 0;
                index < text.length;
                index += CHUNK_SIZE
            ) {
                chunks.push(
                    text.slice(
                        index,
                        index +
                            CHUNK_SIZE
                    )
                );
            }

            return chunks;
        }

        async collectSaveData() {
            const backup = {
                version: 2,

                createdAt:
                    new Date()
                        .toISOString(),

                localStorage:
                    this.collectStorage(
                        localStorage
                    ),

                sessionStorage:
                    this.collectStorage(
                        sessionStorage
                    ),

                cookies:
                    this.collectCookies(),

                indexedDB:
                    await this
                        .exportIndexedDB()
            };

            const serializedBackup =
                JSON.stringify(backup);

            const chunks =
                this.splitIntoChunks(
                    serializedBackup
                );

            const saveData = {
                [`${BACKUP_PREFIX}count`]:
                    String(
                        chunks.length
                    )
            };

            chunks.forEach(
                function (
                    chunk,
                    index
                ) {
                    saveData[
                        `${BACKUP_PREFIX}${index}`
                    ] = chunk;
                }
            );

            return {
                saveData,
                backup
            };
        }

        getBackupFromSaveData(
            saveData
        ) {
            const count =
                Number.parseInt(
                    saveData[
                        `${BACKUP_PREFIX}count`
                    ],
                    10
                );

            if (
                !Number.isInteger(
                    count
                ) ||
                count < 1
            ) {
                return null;
            }

            let serializedBackup =
                "";

            for (
                let index = 0;
                index < count;
                index += 1
            ) {
                const chunk =
                    saveData[
                        `${BACKUP_PREFIX}${index}`
                    ];

                if (
                    typeof chunk !==
                    "string"
                ) {
                    throw new Error(
                        "The cloud backup is incomplete."
                    );
                }

                serializedBackup +=
                    chunk;
            }

            return JSON.parse(
                serializedBackup
            );
        }

        async restoreIndexedDB(
            databases
        ) {
            if (
                !Array.isArray(
                    databases
                )
            ) {
                return;
            }

            for (
                const databaseData of
                databases
            ) {
                if (
                    !databaseData ||
                    typeof databaseData
                        .name !==
                        "string" ||
                    !Array.isArray(
                        databaseData
                            .stores
                    )
                ) {
                    continue;
                }

                await this.deleteDatabase(
                    databaseData.name
                );

                await this
                    .restoreDatabase(
                        databaseData
                    );
            }
        }

        restoreDatabase(
            databaseData
        ) {
            return new Promise(
                (
                    resolve,
                    reject
                ) => {
                    const request =
                        indexedDB.open(
                            databaseData.name,
                            databaseData.version
                        );

                    request.onupgradeneeded =
                        function () {
                            const database =
                                request.result;

                            for (
                                const storeData of
                                databaseData
                                    .stores
                            ) {
                                if (
                                    database
                                        .objectStoreNames
                                        .contains(
                                            storeData
                                                .name
                                        )
                                ) {
                                    continue;
                                }

                                const options = {
                                    autoIncrement:
                                        Boolean(
                                            storeData
                                                .autoIncrement
                                        )
                                };

                                if (
                                    storeData
                                        .keyPath !==
                                        null &&
                                    storeData
                                        .keyPath !==
                                        undefined
                                ) {
                                    options.keyPath =
                                        storeData
                                            .keyPath;
                                }

                                const store =
                                    database
                                        .createObjectStore(
                                            storeData
                                                .name,
                                            options
                                        );

                                for (
                                    const indexData of
                                    storeData
                                        .indexes ||
                                    []
                                ) {
                                    store.createIndex(
                                        indexData
                                            .name,

                                        indexData
                                            .keyPath,

                                        {
                                            unique:
                                                Boolean(
                                                    indexData
                                                        .unique
                                                ),

                                            multiEntry:
                                                Boolean(
                                                    indexData
                                                        .multiEntry
                                                )
                                        }
                                    );
                                }
                            }
                        };

                    request.onerror =
                        function () {
                            reject(
                                request.error ||
                                new Error(
                                    `Could not restore database: ${databaseData.name}`
                                )
                            );
                        };

                    request.onsuccess =
                        async () => {
                            const database =
                                request.result;

                            try {
                                for (
                                    const storeData of
                                    databaseData
                                        .stores
                                ) {
                                    if (
                                        !database
                                            .objectStoreNames
                                            .contains(
                                                storeData
                                                    .name
                                            )
                                    ) {
                                        continue;
                                    }

                                    const transaction =
                                        database
                                            .transaction(
                                                storeData
                                                    .name,
                                                "readwrite"
                                            );

                                    const store =
                                        transaction
                                            .objectStore(
                                                storeData
                                                    .name
                                            );

                                    store.clear();

                                    for (
                                        const record of
                                        storeData
                                            .records ||
                                        []
                                    ) {
                                        const key =
                                            await this
                                                .deserializeValue(
                                                    record
                                                        .key
                                                );

                                        const value =
                                            await this
                                                .deserializeValue(
                                                    record
                                                        .value
                                                );

                                        if (
                                            store
                                                .keyPath ===
                                                null &&
                                            key !==
                                                undefined
                                        ) {
                                            store.put(
                                                value,
                                                key
                                            );
                                        } else {
                                            store.put(
                                                value
                                            );
                                        }
                                    }

                                    await this
                                        .transactionToPromise(
                                            transaction
                                        );
                                }

                                database.close();
                                resolve();

                            } catch (error) {
                                database.close();
                                reject(error);
                            }
                        };
                }
            );
        }

        async restoreBackup(
            backup
        ) {
            if (
                !backup ||
                typeof backup !==
                    "object"
            ) {
                throw new Error(
                    "The cloud backup is invalid."
                );
            }

            const savedSession =
                this.captureSessionData();

            localStorage.clear();
            sessionStorage.clear();

            for (
                const [
                    key,
                    value
                ] of Object.entries(
                    backup.localStorage ||
                    {}
                )
            ) {
                if (
                    BLOCKED_KEYS.has(key) ||
                    typeof value !==
                        "string"
                ) {
                    continue;
                }

                localStorage.setItem(
                    key,
                    value
                );
            }

            for (
                const [
                    key,
                    value
                ] of Object.entries(
                    backup.sessionStorage ||
                    {}
                )
            ) {
                if (
                    BLOCKED_KEYS.has(key) ||
                    typeof value !==
                        "string"
                ) {
                    continue;
                }

                sessionStorage.setItem(
                    key,
                    value
                );
            }

            this.restoreSessionData(
                savedSession
            );

            await this.restoreIndexedDB(
                backup.indexedDB
            );

            // Restore cookies if present (v2+)
            if (backup.cookies) {
                this.restoreCookies(backup.cookies);
            }
        }

        async saveProgress() {
            const session =
                this.getAuthenticatedSession();

            if (!session) {
                return;
            }

            this.updateStatus(
                "💾 Collecting all accessible progress...",
                "loading"
            );

            try {
                const result =
                    await this
                        .collectSaveData();

                const response =
                    await fetch(
                        `${this.apiUrl}/api/save-progress`,
                        {
                            method:
                                "POST",

                            headers:
                                this.getRequestHeaders(
                                    session.token,
                                    true
                                ),

                            body:
                                JSON.stringify({
                                    saveData:
                                        result
                                            .saveData
                                })
                        }
                    );

                const data =
                    await this
                        .readResponse(
                            response
                        );

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.error ||
                        data.message ||
                        "Failed to save progress."
                    );
                }

                const databaseCount =
                    result.backup
                        .indexedDB
                        .length;

                const sizeBytes = JSON.stringify(result.saveData).length;
                const now = new Date().toISOString();
                try { localStorage.setItem(LAST_SAVED_KEY, now); } catch {}
                this.updateLastSavedLabel();

                this.updateStatus(
                    `✅ Saved! localStorage, sessionStorage, cookies & ${databaseCount} IndexedDB DB(s) · ${this.formatBytes(sizeBytes)}`,
                    "success"
                );

            } catch (error) {
                console.error(
                    "Cloud save failed:",
                    error
                );

                this.updateStatus(
                    `❌ ${
                        error.message ||
                        "Failed to save progress."
                    }`,
                    "error"
                );
            }
        }

        async loadProgress() {
            const session =
                this.getAuthenticatedSession();

            if (!session) {
                return;
            }

            this.updateStatus(
                "📥 Downloading complete backup...",
                "loading"
            );

            try {
                const response =
                    await fetch(
                        `${this.apiUrl}/api/load-progress`,
                        {
                            method:
                                "GET",

                            headers:
                                this.getRequestHeaders(
                                    session.token
                                )
                        }
                    );

                const data =
                    await this
                        .readResponse(
                            response
                        );

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.error ||
                        data.message ||
                        "Failed to load progress."
                    );
                }

                const confirmed =
                    window.confirm(
                        "Loading will replace current local storage, session storage, and accessible IndexedDB progress. Continue?"
                    );

                if (!confirmed) {
                    this.updateStatus(
                        "Load cancelled.",
                        "loading"
                    );

                    return;
                }

                const backup =
                    this.getBackupFromSaveData(
                        data.saveData ||
                        {}
                    );

                if (!backup) {
                    throw new Error(
                        "This cloud save does not contain a complete backup."
                    );
                }

                this.updateStatus(
                    "📥 Restoring all accessible progress...",
                    "loading"
                );

                await this.restoreBackup(
                    backup
                );

                this.updateStatus(
                    "✅ Complete progress restored! Reloading...",
                    "success"
                );

                window.setTimeout(
                    function () {
                        window.location
                            .reload();
                    },
                    1500
                );

            } catch (error) {
                console.error(
                    "Cloud load failed:",
                    error
                );

                this.updateStatus(
                    `❌ ${
                        error.message ||
                        "Failed to load progress."
                    }`,
                    "error"
                );
            }
        }

        async deleteSave() {
            const session =
                this.getAuthenticatedSession();

            if (!session) {
                return;
            }

            const confirmed =
                window.confirm(
                    "🗑️ Delete your complete cloud backup permanently? This cannot be undone."
                );

            if (!confirmed) {
                return;
            }

            this.updateStatus(
                "🗑️ Deleting...",
                "loading"
            );

            try {
                const response =
                    await fetch(
                        `${this.apiUrl}/api/delete-save`,
                        {
                            method:
                                "DELETE",

                            headers:
                                this.getRequestHeaders(
                                    session.token
                                )
                        }
                    );

                const data =
                    await this
                        .readResponse(
                            response
                        );

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.error ||
                        data.message ||
                        "Failed to delete the cloud save."
                    );
                }

                this.updateStatus(
                    "✅ Cloud backup deleted!",
                    "success"
                );

            } catch (error) {
                console.error(
                    "Cloud-save deletion failed:",
                    error
                );

                this.updateStatus(
                    `❌ ${
                        error.message ||
                        "Failed to delete the cloud save."
                    }`,
                    "error"
                );
            }
        }

        updateStatus(
            message,
            type = "loading"
        ) {
            if (!this.saveStatus) {
                this.saveStatus =
                    document.getElementById(
                        "saveStatus"
                    );
            }

            if (!this.saveStatus) {
                return;
            }

            this.saveStatus.textContent =
                message;

            if (type === "error") {
                this.saveStatus
                    .style.color =
                    "#ef4444";

            } else if (
                type === "success"
            ) {
                this.saveStatus
                    .style.color =
                    "#22c55e";

            } else {
                this.saveStatus
                    .style.color =
                    "var(--text)";
            }
        }
    }

    function initializeCloudSaves() {
        const cloudSave =
            new CloudSaveManager();

        const saveButton =
            document.getElementById("saveProgressBtn");
        const loadButton =
            document.getElementById("loadProgressBtn");
        const deleteButton =
            document.getElementById("deleteProgressBtn");
        const exportBtn =
            document.getElementById("exportSaveBtn");
        const importBtn =
            document.getElementById("importSaveBtn");
        const importInput =
            document.getElementById("importSaveInput");

        if (saveButton) {
            saveButton.addEventListener("click", function () {
                cloudSave.saveProgress();
            });
        }

        if (loadButton) {
            loadButton.addEventListener("click", function () {
                cloudSave.loadProgress();
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener("click", function () {
                cloudSave.deleteSave();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener("click", function () {
                cloudSave.exportToFile();
            });
        }

        if (importBtn && importInput) {
            importBtn.addEventListener("click", function () {
                importInput.click();
            });
            importInput.addEventListener("change", function () {
                if (importInput.files && importInput.files[0]) {
                    cloudSave.importFromFile(importInput.files[0]);
                    importInput.value = "";
                }
            });
        }

        // Show last saved timestamp on load
        cloudSave.updateLastSavedLabel();

        // Auto-save every 5 minutes if logged in
        setInterval(function () {
            const token = cloudSave.getAuthToken();
            if (token) cloudSave.saveProgress();
        }, AUTO_SAVE_INTERVAL_MS);

        // Best-effort save on page unload
        window.addEventListener("beforeunload", function () {
            const token = cloudSave.getAuthToken();
            if (!token) return;
            // Use sendBeacon for reliability on unload
            try {
                const data = { saveData: {} }; // lightweight ping; full save already happened via interval
                navigator.sendBeacon && navigator.sendBeacon(
                    cloudSave.apiUrl + "/api/ping",
                    JSON.stringify({ ts: Date.now() })
                );
            } catch {}
        });

        window.WorkStudyCloudSave = cloudSave;
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCloudSaves
        );
    } else {
        initializeCloudSaves();
    }
})();
