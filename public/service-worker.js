const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const cacheURLs = [
  "/",
  "/index.html",
  "/manifest.json",
  "/styles.css",
  "/db.js",
  "/index.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// INSTALL Service Worker
self.addEventListener("install", function (evt) {
    // pre cache all URLs (static elements)
    evt.waitUntil(
      caches.open(DATA_CACHE_NAME)
      .then((cache) => cache.addAll(cacheURLs))
    );
    // tells the browser to activate this service worker after installing
    self.skipWaiting();
  });
  
  // ACTIVATE Service Worker - cleaning up old caches
  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log("Remove old cache data", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });

  