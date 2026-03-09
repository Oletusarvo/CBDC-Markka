import { CACHE_NAME, URLS_TO_CACHE } from './cache.js';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)));
  console.log('Service worker installed...');
});
