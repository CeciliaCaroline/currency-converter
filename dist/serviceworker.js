const cacheName = "v1";
const cacheFiles = [
  "../converter.js",
  "../static/img/cb.jpeg",
  "../static/styles.css",
  "../converter.html"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener("activate", e => {
  console.log("activate service worker");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(currentCache => {
            if (currentCache != cacheName) {
              console.log("removing cached files from", cacheName);
              return true;
            }
          })
          .map(currentCache => {
            return caches.delete(currentCache);
          })
      );
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.open(cacheName).then(cache => {
      caches.match(e.request).then(response => {
        if (response) {
          console.log("[Service worker] Found in Cache", e.request.url);
          return response;
        }

        return fetch(e.request).then(response => {
          if (response) {
            let reponsetClone = response.clone();
            cache.put(e.request, responseClone);
            return response;
          }
        });
      });
    })
  );
});
