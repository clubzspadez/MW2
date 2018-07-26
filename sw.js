// /**
//  * ! Cache version 1
//  *
//  */
// const cache_version = 1;
// const cache_name = `restaurant-v${cache_version}`;
// const urlsToCache = ["/", "/css/", "/data/", "/img/", "/js/"];

// /**
//  * !Install Cache
//  *
//  * * pass cache_name, and use urlsToCache
//  */

// self.addEventListener("install", event => {
//   event.waitUntil(
//     caches.open(cache_name).then(cache => {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });
