// WorkStudy Service Worker — v3.2.9.51
// Offline-first: cache-then-network for all local assets, network-first for pages

const CACHE_NAME   = "workstudy-v3.2.9.51";
const OFFLINE_PAGE = "/WorkStudy/offline.html";
const SCOPE        = "https://eymc-group.github.io/WorkStudy/";

// Everything that must be cached at install time
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
    "/WorkStudy/js/gamebuttons.js",
    "/WorkStudy/js/cloudSave.js",
    "/WorkStudy/js/github-oauth.js",
    "/WorkStudy/js/version-check.js",
    "/WorkStudy/js/customTab.js",
    "/WorkStudy/js/searchbar.js",
    "/WorkStudy/js/status.js",
    "/WorkStudy/img/favicon.png",
    "/WorkStudy/img/icon-72.png",
    "/WorkStudy/img/icon-96.png",
    "/WorkStudy/img/icon-192.png",
    "/WorkStudy/img/icon-512.png",
    "/WorkStudy/manifest.json",
    "/WorkStudy/version.json",
    "/WorkStudy/games/index.html",
    "/WorkStudy/pages/leaderboard.html",
    "/WorkStudy/pages/support.html",
    "/WorkStudy/pages/updates.html",
    "/WorkStudy/pages/mirrors.html",
    "/WorkStudy/pages/website.html",
    "/WorkStudy/pages/devtools.html",
    "/WorkStudy/pages/movies.html",
    "/WorkStudy/pages/music.html",
    "/WorkStudy/pages/notepad.html",
    "/WorkStudy/pages/emulator.html",
    "/WorkStudy/pages/file-runner.html",
    "/WorkStudy/pages/yt-emulator.html",
    "/WorkStudy/pages/coloringboard.html",
    "/WorkStudy/pages/shorts.html",
    "/WorkStudy/pages/game.html",
    "/WorkStudy/pages/leaderboard.html",
    "/WorkStudy/pages/apps.html",
    "/WorkStudy/pages/iframe.html",
    "/WorkStudy/pages/soundboard.html",
    "/WorkStudy/pages/proxy.html",
    "/WorkStudy/pages/deviceinfo.html",
    "/WorkStudy/pages/chat/index.html",
    "/WorkStudy/widgets/data.json",
];

// ── Install: precache everything ──────────────────────────────────────────
self.addEventListener("install", function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return Promise.allSettled(
                PRECACHE_URLS.map(function (url) {
                    return fetch(url, { cache: "reload" }).then(function (res) {
                        if (res.ok) return cache.put(url, res);
                    }).catch(function () {});
                })
            );
        })
    );
});

// ── Activate: delete old caches ───────────────────────────────────────────
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

// ── Fetch: smart strategy per request type ────────────────────────────────
self.addEventListener("fetch", function (event) {
    var req = event.request;
    var url = req.url;

    if (req.method !== "GET") return;

    // Skip API calls, gfiles game assets (too large to cache en-masse), external CDNs
    if (url.includes("workstudy-api.354271744.workers.dev")) return;
    if (url.includes("eymc-group.github.io/gfiles/")) return;
    if (url.includes("api.rawg.io")) return;
    if (url.includes("en.wikipedia.org/api")) return;

    // Only intercept same-origin WorkStudy assets
    if (!url.startsWith(SCOPE) && !url.startsWith("https://eymc-group.github.io/WorkStudy")) return;

    var isHTML = req.headers.get("accept") && req.headers.get("accept").includes("text/html");

    if (isHTML) {
        // HTML pages: network-first, fall back to cache, then offline page
        event.respondWith(
            fetch(req).then(function (res) {
                if (res.ok) {
                    var clone = res.clone();
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

    // JS/CSS/images/fonts: cache-first (fast), revalidate in background
    event.respondWith(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(req).then(function (cached) {
                var fetchPromise = fetch(req).then(function (res) {
                    if (res.ok) cache.put(req, res.clone());
                    return res;
                }).catch(function () { return cached || new Response("", { status: 503 }); });
                // Return cached immediately, update in background
                return cached || fetchPromise;
            });
        })
    );
});

// ── Background Sync ───────────────────────────────────────────────────────
self.addEventListener("sync", function (event) {
    if (event.tag === "sync-scores") {
        event.waitUntil(syncPendingScores());
    }
});

// ── Periodic Background Sync ──────────────────────────────────────────────
self.addEventListener("periodicsync", function (event) {
    if (event.tag === "refresh-leaderboard") event.waitUntil(refreshLeaderboardCache());
    if (event.tag === "check-updates")       event.waitUntil(checkForUpdates());
});

async function refreshLeaderboardCache() {
    try {
        const res = await fetch("https://workstudy-api.354271744.workers.dev/leaderboard", { cache: "no-store" });
        if (res.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put("/WorkStudy/pages/leaderboard.html",
                await fetch("/WorkStudy/pages/leaderboard.html"));
        }
    } catch (e) {}
}

async function checkForUpdates() {
    try {
        const res  = await fetch("/WorkStudy/version.json?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const cache  = await caches.open(CACHE_NAME);
        const cached = await cache.match("/WorkStudy/version.json");
        if (cached) {
            const old = await cached.json();
            if (old.version !== data.version) await notifyClients({ type: "UPDATE_AVAILABLE", version: data.version });
        }
        await cache.put("/WorkStudy/version.json",
            new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } }));
    } catch (e) {}
}

// ── Push Notifications ────────────────────────────────────────────────────
self.addEventListener("push", function (event) {
    let payload = { title: "WorkStudy", body: "Something new is waiting!", icon: "/WorkStudy/img/icon-192.png", badge: "/WorkStudy/img/icon-96.png", url: "/WorkStudy/" };
    if (event.data) {
        try { Object.assign(payload, event.data.json()); } catch (e) { payload.body = event.data.text(); }
    }
    event.waitUntil(self.registration.showNotification(payload.title, {
        body: payload.body, icon: payload.icon, badge: payload.badge,
        tag: "workstudy-push", renotify: true,
        data: { url: payload.url },
        actions: [{ action: "open", title: "Open WorkStudy" }, { action: "dismiss", title: "Dismiss" }]
    }));
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    if (event.action === "dismiss") return;
    const target = (event.notification.data && event.notification.data.url) || "/WorkStudy/";
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clients) {
            for (const client of clients) {
                if (client.url.includes("/WorkStudy/") && "focus" in client) {
                    client.navigate(target); return client.focus();
                }
            }
            return self.clients.openWindow(target);
        })
    );
});

// ── Widget Support ────────────────────────────────────────────────────────
self.addEventListener("widgetinstall", function (e) { e.waitUntil(updateWidget(e.widget)); });
self.addEventListener("widgetresume",  function (e) { e.waitUntil(updateWidget(e.widget)); });

async function updateWidget(widget) {
    try {
        const res  = await fetch("/WorkStudy/widgets/data.json", { cache: "no-store" });
        const data = await res.json();
        await self.widgets.updateByTag(widget.definition.tag, { data: JSON.stringify(data) });
    } catch (e) {}
}

// ── Helpers ───────────────────────────────────────────────────────────────
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
    } catch (e) {}
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
        req.onsuccess = resolve; req.onerror = reject;
    });
}
