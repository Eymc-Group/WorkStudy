// WorkStudy Service Worker — v1.4.0
// Caches core assets for offline use and faster loads

const CACHE_NAME = "workstudy-v1.4.0";

const PRECACHE_URLS = [
    "/WorkStudy/",
    "/WorkStudy/index.html",
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
    "/WorkStudy/manifest.json",
    "/WorkStudy/version.json",
    "/WorkStudy/games/index.html",
    "/WorkStudy/pages/leaderboard.html",
    "/WorkStudy/pages/support.html",
    "/WorkStudy/pages/updates.html",
    "/WorkStudy/pages/mirrors.html",
    "/WorkStudy/pages/iframe.html",
];

// Install — cache core assets
self.addEventListener("install", function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE_URLS).catch(function () {
                // If some fail, continue anyway (e.g. 404s during development)
            });
        })
    );
});

// Activate — delete old caches
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

// Fetch — network first for API calls, cache first for assets
self.addEventListener("fetch", function (event) {
    const url = event.request.url;

    // Don't intercept cross-origin API, game iframes, or non-GET
    if (event.request.method !== "GET") return;
    if (url.includes("workstudy-api.354271744.workers.dev")) return;
    if (url.includes("eymc-group.github.io/gfiles/games/")) return;
    if (!url.startsWith("https://eymc-group.github.io/WorkStudy/")) return;

    event.respondWith(
        caches.match(event.request).then(function (cached) {
            const fetched = fetch(event.request).then(function (response) {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function () {
                return cached;
            });
            // Return cached version immediately if available, fetch in background
            return cached || fetched;
        })
    );
});
