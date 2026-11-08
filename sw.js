// WorkStudy Service Worker — v2.7.41
// Stale-while-revalidate for assets, network-first for pages,
// offline fallback, background sync, periodic sync, push notifications,
// and widget support.

const CACHE_NAME    = "workstudy-v2.7.41";
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
    "/WorkStudy/widgets/data.json",
    "/WorkStudy/games/index.html",
    "/WorkStudy/pages/leaderboard.html",
    "/WorkStudy/pages/support.html",
    "/WorkStudy/pages/updates.html",
    "/WorkStudy/pages/mirrors.html",
    "/WorkStudy/pages/iframe.html",
    "/WorkStudy/pages/devtools.html",
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener("install", function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
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

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE_NAME; })
                    .map(function (k) { return caches.delete(k); })
            );
        }).then(function () { return self.clients.claim(); })
    );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", function (event) {
    const req = event.request;
    const url = req.url;

    if (req.method !== "GET") return;
    if (url.includes("workstudy-api.354271744.workers.dev")) return;
    if (url.includes("eymc-group.github.io/gfiles/games/")) return;
    if (!url.startsWith("https://eymc-group.github.io/WorkStudy/")) return;

    // HTML — network first → cache → offline page
    if (req.headers.get("accept") && req.headers.get("accept").includes("text/html")) {
        event.respondWith(
            fetch(req).then(function (res) {
                if (res.ok) {
                    caches.open(CACHE_NAME).then(function (c) { c.put(req, res.clone()); });
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

    // Assets — stale-while-revalidate
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

// ── Background Sync ───────────────────────────────────────────────────────────
self.addEventListener("sync", function (event) {
    if (event.tag === "sync-scores") {
        event.waitUntil(syncPendingScores());
    }
});

// ── Periodic Background Sync ──────────────────────────────────────────────────
self.addEventListener("periodicsync", function (event) {
    if (event.tag === "refresh-leaderboard") {
        event.waitUntil(refreshLeaderboardCache());
    }
    if (event.tag === "check-updates") {
        event.waitUntil(checkForUpdates());
    }
});

async function refreshLeaderboardCache() {
    try {
        const res = await fetch("https://workstudy-api.354271744.workers.dev/leaderboard", { cache: "no-store" });
        if (res.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put("/WorkStudy/pages/leaderboard.html",
                await fetch("/WorkStudy/pages/leaderboard.html"));
        }
    } catch (e) { /* non-critical */ }
}

async function checkForUpdates() {
    try {
        const res  = await fetch("/WorkStudy/version.json?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match("/WorkStudy/version.json");
        if (cached) {
            const old = await cached.json();
            if (old.version !== data.version) {
                await notifyClients({ type: "UPDATE_AVAILABLE", version: data.version });
            }
        }
        await cache.put("/WorkStudy/version.json", res.clone ? res.clone() :
            new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } }));
    } catch (e) { /* non-critical */ }
}

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener("push", function (event) {
    let payload = { title: "WorkStudy", body: "Something new is waiting for you!", icon: "/WorkStudy/img/icon-192.png", badge: "/WorkStudy/img/icon-96.png", url: "/WorkStudy/" };

    if (event.data) {
        try { Object.assign(payload, event.data.json()); } catch (e) {
            payload.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body:    payload.body,
            icon:    payload.icon,
            badge:   payload.badge,
            tag:     "workstudy-push",
            renotify: true,
            data:    { url: payload.url },
            actions: [
                { action: "open",    title: "Open WorkStudy" },
                { action: "dismiss", title: "Dismiss" }
            ]
        })
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    if (event.action === "dismiss") return;

    const target = (event.notification.data && event.notification.data.url) || "/WorkStudy/";
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clients) {
            for (const client of clients) {
                if (client.url.includes("/WorkStudy/") && "focus" in client) {
                    client.navigate(target);
                    return client.focus();
                }
            }
            return self.clients.openWindow(target);
        })
    );
});

// ── Widget Support ────────────────────────────────────────────────────────────
self.addEventListener("widgetinstall", function (event) {
    event.waitUntil(updateWidget(event.widget));
});

self.addEventListener("widgetresume", function (event) {
    event.waitUntil(updateWidget(event.widget));
});

async function updateWidget(widget) {
    try {
        const res  = await fetch("/WorkStudy/widgets/data.json", { cache: "no-store" });
        const data = await res.json();
        await self.widgets.updateByTag(widget.definition.tag, { data: JSON.stringify(data) });
    } catch (e) { /* non-critical */ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function notifyClients(msg) {
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach(function (c) { c.postMessage(msg); });
}

async function syncPendingScores() {
    try {
        const db    = await openSyncDB();
        const items = await getAllPending(db);
        await Promise.allSettled(items.map(function (item) {
            return fetch(item.url, { method: item.method, headers: item.headers, body: item.body })
                .then(function (res) { if (res.ok) return removePending(db, item.id); });
        }));
    } catch (e) { /* non-critical */ }
}

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
        const req = db.transaction("pending", "readonly").objectStore("pending").getAll();
        req.onsuccess = function (e) { resolve(e.target.result); };
        req.onerror   = reject;
    });
}

function removePending(db, id) {
    return new Promise(function (resolve, reject) {
        const req = db.transaction("pending", "readwrite").objectStore("pending").delete(id);
        req.onsuccess = resolve;
        req.onerror   = reject;
    });
}
