const cacheName = "cachev1";
const cacheFiles = [
  "../converter.js",
  "../static/img/cb.jpeg",
  "../static/styles.css",
  "../converter.html",
  "../dist/index.html",
  "../dist/bundle.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
