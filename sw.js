/**
 * ! Cache version 1
 *
 */
const cache_version = 2;
const cache_name = `restaurant-v${cache_version}`;
const urlsToCache = [
  "./",
  "./index.html",
  "./restaurant.html",
  "./dist/css/",
  "./dist/css/styles.css",
  "./img/",
  "./dist/js/",
  "./dist/js/index.min.js",
  "./dist/js/restaurant.min.js"
];

/**
 * !Install Cache
 *
 * * pass cache_name, and use urlsToCache
 */
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(cache_name).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  // responde to fetch event
  const url = new URL(event.request.url).host;
  // console.log(event.request.url);
  // const pathName = url.pathname("/restaurants");
  if (url === "localhost:1337") console.log("This is the servers host");

  // with the current fetch event respond with
  // response
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log(response);
        return response;
      }

      return fetch(event.request);
    })
  );
});
