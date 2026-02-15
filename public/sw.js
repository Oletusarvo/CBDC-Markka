// Service Worker (sw.js)
const CACHE_NAME = 'cbdc-mark-pwa-cache-v1';
const URLS_TO_CACHE = ['/'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE); // Cache all files in URLS_TO_CACHE
    }),
  );
  console.log('Service Worker installed.');
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
  console.log('Service Worker: Intercepting a network request...');
  return fetch(event.request);
  /*
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('Service Worker: Returning a cached response...');
        return cachedResponse;
      }

      return fetch(event.request).then(response => {
        if (!event.request.url.includes('/api')) {
          //Cache successful non-api responses.
          if (response && response.status === 200) {
            console.log('Service Worker: Caching a response...');
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
            });
          }
        }

        return response;
      });
    })
  );
  */
});
