/**
 * ! Cache version 3
 *
 */
const cache_version = 3;
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

// remove outdated caches
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(cache => {
      return Promise.all(
        cache
          .filter(spec => {
            return spec.startsWith("restaurant-") && spec != urlsToCache;
          })
          .map(cache => {
            return caches.delete(cache);
          })
      );
    })
  );
});
self.addEventListener("fetch", function(event) {
  // console.log(event.request.url);
  // const pathName = url.pathname("/restaurants");
  if (event.request.method != "GET") return;

  // with the current fetch event respond with
  // response
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
