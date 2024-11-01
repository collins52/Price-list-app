const CACHE_NAME = 'v1';
const ASSETS_TO_CACHE = [
  '/',              // Cache the root URL (e.g., index.html)
  '/index.html',    // HTML file
  '/style.css',    // CSS file
  '/script.js',     // JavaScript file
];

// Install event: Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event: Clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cache => cache !== CACHE_NAME)
          .map(cache => caches.delete(cache))
      );
    })
  );
});

// Fetch event: Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
