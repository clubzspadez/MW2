/**
 * ! Cache version 1
 *
 */
const cache_version = 2;
const cache_name = `restaurant-v${cache_version}`;
const urlsToCache = [
  "/",
  "/index.html",
  "/restaurant.html",
  "/dist/css/",
  "/dist/css/styles.css",
  "/img/",
  "/dist/js/",
  "/dist/js/index.min.js",
  "/dist/js/restaurant.min.js"
];

/**
 * !Install Cache
 *
 * * pass cache_name, and use urlsToCache
 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cache_name).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  console.log(event.request.url);
});
