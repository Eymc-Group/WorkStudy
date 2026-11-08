// WorkStudy Service Worker — v1.4.1
// Stale-while-revalidate for assets, network-first for pages,
// offline fallback page, and background sync for API calls.

const CACHE_NAME    = "workstudy-v1.4.1";
const OFFLINE_PAGE  = "/WorkStudy/offline.html";

const PRECACHE_URLS = [
    "/WorkStudy/",
    "/WorkStudy/index.html",
    "/WorkStudy/offline.html",
    "/WorkStudy/css/style.css",
    "/WorkStudy/js/color.js",
    "/WorkStudy/js/script.js",
    "/WorkStudy/js/auth.js",
    "/WorkStudy/js/online.js",
    "/WorkStudy/js/gamelist.js",
    "/WorkStudy/js/cloudSave.js",
    "/WorkStudy/js/github-oauth.js",
    "/WorkStudy/js/version-check.js",
    "/WorkStudy/js/customTab.js",
    "/WorkStudy/img/favicon.png",
    "/WorkStudy/img/icon-192.png",
    "/WorkStudy/img/icon-512.png",
    "/WorkStudy/manifest.json",
    "/WorkStudy/version.json",
    "/WorkStudy/games/index.html",
    "/WorkStudy/pages/leaderboard.html",
    "/WorkStudy/pages/support.html",
    "/WorkStudy/pages/updates.html",
    "/WorkStudy/pages/mirrors.html",
    "/WorkStudy/pages/iframe.html",
    "/WorkStudy/pages/devtools.html",
];

// ── Install: precache core assets ─────────────────────────────────────────────
self.addEventListener("install", function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // addAll fails atomically — use individual puts so one 404 doesn't
            // break the whole precache
            return Promise.allSettled(
                PRECACHE_URLS.map(function (url) {
                    return fetch(url).then(function (res) {
                        if (res.ok) return cache.put(url, res);
                    }).catch(function () {});
                })
            );
        })
    );
});

// ── Activate: delete old caches ──────────────────────────────────────────────
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys
                    .filter(function (k) { return k !== CACHE_NAME; })
                    .map(function (k) { return caches.delete(k); })
            );
        }).then(function () { return self.clients.claim(); })
    );
});

// ── Fetch: routing logic ──────────────────────────────────────────────────────
self.addEventListener("fetch", function (event) {
    const req = event.request;
    const url = req.url;

    // Only handle GET requests within our scope
    if (req.method !== "GET") return;

    // Don't intercept: Cloudflare Worker API, game files, external origins
    if (url.includes("workstudy-api.354271744.workers.dev")) return;
    if (url.includes("eymc-group.github.io/gfiles/games/")) return;
    if (!url.startsWith("https://eymc-group.github.io/WorkStudy/")) return;

    // HTML navigation — network first, fall back to cache, then offline page
    if (req.headers.get("accept") && req.headers.get("accept").includes("text/html")) {
        event.respondWith(
            fetch(req).then(function (res) {
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(function (c) { c.put(req, clone); });
                }
                return res;
            }).catch(function () {
                return caches.match(req).then(function (cached) {
                    return cached || caches.match(OFFLINE_PAGE);
                });
            })
        );
        return;
    }

    // Assets (JS, CSS, images) — stale-while-revalidate
    event.respondWith(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(req).then(function (cached) {
                const fetched = fetch(req).then(function (res) {
                    if (res.ok) cache.put(req, res.clone());
                    return res;
                }).catch(function () { return cached; });

                return cached || fetched;
            });
        })
    );
});

// ── Background Sync: retry failed API calls ───────────────────────────────────
self.addEventListener("sync", function (event) {
    if (event.tag === "sync-scores") {
        event.waitUntil(syncPendingScores());
    }
});

async function syncPendingScores() {
    try {
        const db    = await openSyncDB();
        const items = await getAllPending(db);
        await Promise.allSettled(items.map(function (item) {
            return fetch(item.url, {
                method:  item.method,
                headers: item.headers,
                body:    item.body
            }).then(function (res) {
                if (res.ok) return removePending(db, item.id);
            });
        }));
    } catch (e) { /* non-critical */ }
}

// Minimal IndexedDB helpers for background sync queue
function openSyncDB() {
    return new Promise(function (resolve, reject) {
        const req = indexedDB.open("workstudy-sync", 1);
        req.onupgradeneeded = function (e) {
            e.target.result.createObjectStore("pending", { keyPath: "id", autoIncrement: true });
        };
        req.onsuccess = function (e) { resolve(e.target.result); };
        req.onerror   = reject;
    });
}

function getAllPending(db) {
    return new Promise(function (resolve, reject) {
        const tx  = db.transaction("pending", "readonly");
        const req = tx.objectStore("pending").getAll();
        req.onsuccess = function (e) { resolve(e.target.result); };
        req.onerror   = reject;
    });
}

function removePending(db, id) {
    return new Promise(function (resolve, reject) {
        const tx  = db.transaction("pending", "readwrite");
        const req = tx.objectStore("pending").delete(id);
        req.onsuccess = resolve;
        req.onerror   = reject;
    });
}
