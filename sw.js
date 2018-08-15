/**
 * ! Cache version 3
 *
 */
const cache_version = 4;
const cache_name = `restaurant-v${cache_version}`;
const urlsToCache = [
  "./",
  "./index.html",
  "./restaurant.html",
  "./dist/css/",
  "./dist/css/styles.css",
  "./img/",
  "./img/1.jpg",
  "./img/2.jpg",
  "./img/3.jpg",
  "./img/4.jpg",
  "./img/5.jpg",
  "./img/6.jpg",
  "./img/7.jpg",
  "./img/8.jpg",
  "./img/9.jpg",
  "./img/10.jpg",
  "./sw.js",
  "./js/dbhelper.js",
  "./js/main.js",
  "./js/idb.js",
  "./js/serviceWorkerReg.js",
  "./js/restaurant_info.js",
  "./dist/js/",
  "./dist/js/index.min.js",
  "./dist/js/restaurant.min.js",
  "http://localhost:1337/restaurants/"
];

/**
 * !Install Cache
 *
 * * pass cache_name, and use urlsToCache
 */
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(cache_name)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(specCa => {
      return Promise.all(
        specCa
          .filter(cachesName => {
            return (
              cachesName.startsWith("restaurants-") && cachesName != urlsToCache
            );
          })
          .map(cachesName => {
            // remove outdated caches
            return caches.delete(cachesName);
          })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open(cache_name).then(cache => {
      return cache.match(event.request).then(response => {
        if (response) return response;
        return fetch(event.request);
      });
    })
  );
});
