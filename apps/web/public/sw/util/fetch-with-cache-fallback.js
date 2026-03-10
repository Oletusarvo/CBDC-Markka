import { CACHE_NAME } from '../cache.js';

/**Fetches from he network first, falling back to cache if the network request fails or takes too long.
 * @param req The request to fetch.
 * @param timeout The time in milliseconds until cache is attempted instead.
 */
export async function fetchWithCacheFallback(req, timeout = 5000) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(req);

  const networkPromise = fetch(req).then(res => {
    cache.put(req, res.clone());
    return res;
  });

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Network timeout')), timeout);
  });

  try {
    if (!cachedResponse) {
      return await networkPromise;
    }

    return await Promise.race([networkPromise, timeoutPromise]);
  } catch (err) {
    return cachedResponse || new Response('Service unavailable', { status: 503 });
  }
}
