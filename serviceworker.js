let cacheName = 'v2';
let cacheFiles = [
    './',
    './converter.html',
    './static/img',
    './static/styles.css',
    './converter.js',
    
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(cacheFiles);
        })
    )
})

self.addEventListener('activate', e => {
    console.log("activate service worker");
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(currentCache => {
                if (currentCache  != cacheName){
                    console.log('removing cached files from', cacheName);
                    caches.delete(currentCache );
                }
            }))
        })
    )
})


self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response){
                console.log("[Service worker] Found in Cache", e.request.url);
                return response;
            }

            let requestClone = e.request.clone();

            fetch(requestClone).then(response => {
                if (response){
                    responseClone = response.clone();
                    caches.open(cacheName).then(cache => {
                        cache.put(e.request, responseClone);
                        return response;
                    })

                }
                console.log('no response from fetch');
            })
            .catch(error => {
                console.log("error caching response");
            })

        })
    )
})