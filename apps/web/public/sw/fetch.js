import { fetchWithCacheFallback } from './util/fetch-with-cache-fallback.js';

self.addEventListener('fetch', event => {
  return event.respondWith(handleFetch(event.request));
});

async function handleFetch(req) {
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/auth/session') || url.pathname.startsWith('/api/accounts')) {
    return fetchWithCacheFallback(req, 5000);
  }

  return fetch(req);
}
