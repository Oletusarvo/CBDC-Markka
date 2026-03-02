const CACHE_NAME = 'cbdc-markka-cache-v1';
const URLS_TO_CACHE = ['/', '/login', '/register'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)));
  console.log('Service worker installed...');
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        }),
      );
    }),
  );
  console.log('Service Worker activated.');
});

self.addEventListener('fetch', event => {
  console.log('Service worker: Intercepting a fetch...');
  return event.respondWith(fetch(event.request));
});
