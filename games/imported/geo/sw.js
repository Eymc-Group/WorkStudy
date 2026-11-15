'use strict';

const CACHE_NAME = 'gdwasm-offline-v2';

function isGameAsset(url) {
  return /(?:gd_assets\.json|gd_web\.(?:js|wasm|data)|\.(?:gz|wasm|data|js|json|png|jpe?g|gif|webp|svg|ico|css|woff2?|ttf|otf))$/i
    .test(url.pathname);
}

function isApiRequest(url) {
  return /(?:GJ[A-Za-z]+|database\/|__debug_log|__proxy)/i.test(url.pathname);
}

async function matchCached(cache, request, url) {
  return await cache.match(request) ||
    await cache.match(url.href, { ignoreSearch: true });
}

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    // Remove only old versions of this worker's cache. Preserve game asset
    // caches and caches belonging to other parts of the site.
    await Promise.all(
      keys
        .filter(key => key.startsWith('gdwasm-offline-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (isApiRequest(url)) return;

  const isNavigation = request.mode === 'navigate';
  if (!isNavigation && !isGameAsset(url)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await matchCached(cache, request, url);

    if (isNavigation) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
        }
        return response;
      } catch {
        return cached ||
          await cache.match(new URL('index.html', self.registration.scope).href) ||
          new Response('This page has not been cached yet. Open it online once, then try offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    }

    if (cached) {
      // Return the cached asset immediately; update it in the background.
      event.waitUntil(
        fetch(request)
          .then(response => response.ok ? cache.put(request, response.clone()) : undefined)
          .catch(() => {})
      );
      return cached;
    }

    const response = await fetch(request);
    if (response.ok || response.type === 'opaque') {
      event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
    }
    return response;
  })());
});
