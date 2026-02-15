'use client';

import { useEffect } from 'react';

/**Loads the service worker. */
export function ServiceWorkerLoader() {
  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Register the service worker when the component mounts
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js') // Register the service worker located in public/
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);
  return null;
}
