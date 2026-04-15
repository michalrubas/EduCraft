const CACHE_NAME = 'educraft-cache-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/app-icon.svg', '/icons/app-icon-maskable.svg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
    ]),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_URLS' || !Array.isArray(event.data.payload)) {
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        event.data.payload.map((url) =>
          cache.add(url).catch(() => {
            return undefined;
          }),
        ),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(async () => {
          const cachedHome = await caches.match('/');
          return cachedHome ?? caches.match('/index.html');
        }),
    );
    return;
  }

  if (!sameOrigin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse ?? networkPromise;
    }),
  );
});
