const CACHE_NAME = 'gdwasm-offline-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all([
        cache.add('./').catch(() => {}),
        cache.add('./index.html').catch(() => {})
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only cache same-origin resources.
  if (url.origin !== location.origin) return;

  // Do not cache game account/login requests or proxy/debug endpoints.
  if (/(GJ[A-Za-z]+|database\/|__debug_log|__proxy)/i.test(url.pathname)) {
    return;
  }

  // Cache static assets and page navigation.
  const isNavigation = request.mode === 'navigate';
  const isStaticAsset =
    /(?:gd_assets\.json|gd_web\.(?:js|wasm|data)|\.wasm(?:\.gz)?|\.data(?:\.gz)?|\.js(?:\.gz)?|\.json|\/ref\/|\\.(?:png|jpe?g|gif|webp|svg|ico|css|woff2?|ttf|otf))/i
      .test(url.pathname);

  if (!isNavigation && !isStaticAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    const cached = await cache.match(request).catch(() => null);

    if (cached) {
      // Refresh in background when online.
      if (navigator.onLine) {
        event.waitUntil(
          fetch(request).then((response) => {
            if (response && response.ok) {
              return cache.put(request, response.clone());
            }
          }).catch(() => {})
        );
      }
      return cached;
    }

    try {
      const response = await fetch(request);
      if (response && response.ok) {
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (isNavigation) {
        return (await cache.match('./index.html')) ||
          new Response('This page is not cached yet. Open it online once, then retry offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
      throw error;
    }
  })());
});
