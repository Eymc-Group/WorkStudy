(function () {
    "use strict";

    class CloudSaveManager {
        constructor(apiUrl) {
            this.apiUrl =
                apiUrl ||
                "https://workstudy-saves.354271744.workers.dev";

            this.saveStatus =
                document.getElementById(
                    "saveStatus"
                );
        }

        getCurrentUser() {
            try {
                if (
                    window.WorkStudyAuth &&
                    typeof window.WorkStudyAuth.getCurrentUser ===
                        "function"
                ) {
                    return window.WorkStudyAuth.getCurrentUser();
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
                        username: storedUser,
                        email: null
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
                headers["Content-Type"] =
                    "application/json";
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

        collectSaveData() {
            const blockedKeys =
                new Set([
                    "workstudy-user",
                    "workstudy-account",
                    "workstudy-token",
                    "user",
                    "password",
                    "token",
                    "auth-token"
                ]);

            const saveData = {};

            for (
                let index = 0;
                index < localStorage.length;
                index += 1
            ) {
                const key =
                    localStorage.key(index);

                if (
                    !key ||
                    blockedKeys.has(key)
                ) {
                    continue;
                }

                const value =
                    localStorage.getItem(key);

                if (
                    typeof value === "string"
                ) {
                    saveData[key] = value;
                }
            }

            return saveData;
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
                typeof window.WorkStudyAuth.setCurrentUser ===
                    "function"
            ) {
                window.WorkStudyAuth.setCurrentUser(
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

        async saveProgress() {
            const session =
                this.getAuthenticatedSession();

            if (!session) {
                return;
            }

            this.updateStatus(
                "💾 Saving...",
                "loading"
            );

            try {
                const saveData =
                    this.collectSaveData();

                const response =
                    await fetch(
                        `${this.apiUrl}/api/save-progress`,
                        {
                            method: "POST",

                            headers:
                                this.getRequestHeaders(
                                    session.token,
                                    true
                                ),

                            body: JSON.stringify({
                                saveData
                            })
                        }
                    );

                const data =
                    await this.readResponse(
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

                this.updateStatus(
                    "✅ Progress saved!",
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
                "📥 Loading...",
                "loading"
            );

            try {
                const response =
                    await fetch(
                        `${this.apiUrl}/api/load-progress`,
                        {
                            method: "GET",

                            headers:
                                this.getRequestHeaders(
                                    session.token
                                )
                        }
                    );

                const data =
                    await this.readResponse(
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
                        "⚠️ Loading will overwrite your current local progress. Continue?"
                    );

                if (!confirmed) {
                    this.updateStatus(
                        "Load cancelled.",
                        "loading"
                    );

                    return;
                }

                const savedSession =
                    this.captureSessionData();

                localStorage.clear();

                const blockedKeys =
                    new Set([
                        "workstudy-user",
                        "workstudy-account",
                        "workstudy-token",
                        "user",
                        "password",
                        "token",
                        "auth-token"
                    ]);

                const saveData =
                    data.saveData &&
                    typeof data.saveData ===
                        "object"
                        ? data.saveData
                        : {};

                for (
                    const [key, value] of
                    Object.entries(saveData)
                ) {
                    if (
                        blockedKeys.has(key) ||
                        typeof value !== "string"
                    ) {
                        continue;
                    }

                    localStorage.setItem(
                        key,
                        value
                    );
                }

                this.restoreSessionData(
                    savedSession
                );

                this.updateStatus(
                    "✅ Progress loaded! Reloading...",
                    "success"
                );

                window.setTimeout(
                    function () {
                        window.location.reload();
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
                    "🗑️ Delete your cloud save permanently? This cannot be undone."
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
                            method: "DELETE",

                            headers:
                                this.getRequestHeaders(
                                    session.token
                                )
                        }
                    );

                const data =
                    await this.readResponse(
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
                    "✅ Cloud save deleted!",
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
                this.saveStatus.style.color =
                    "#ef4444";
            } else if (
                type === "success"
            ) {
                this.saveStatus.style.color =
                    "#22c55e";
            } else {
                this.saveStatus.style.color =
                    "var(--text)";
            }
        }
    }

    function initializeCloudSaves() {
        const cloudSave =
            new CloudSaveManager();

        const saveButton =
            document.getElementById(
                "saveProgressBtn"
            );

        const loadButton =
            document.getElementById(
                "loadProgressBtn"
            );

        const deleteButton =
            document.getElementById(
                "deleteProgressBtn"
            );

        if (saveButton) {
            saveButton.addEventListener(
                "click",
                function () {
                    cloudSave.saveProgress();
                }
            );
        }

        if (loadButton) {
            loadButton.addEventListener(
                "click",
                function () {
                    cloudSave.loadProgress();
                }
            );
        }

        if (deleteButton) {
            deleteButton.addEventListener(
                "click",
                function () {
                    cloudSave.deleteSave();
                }
            );
        }

        window.WorkStudyCloudSave =
            cloudSave;
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCloudSaves
        );
    } else {
        initializeCloudSaves();
    }
})();
