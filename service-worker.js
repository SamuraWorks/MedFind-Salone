const CACHE_NAME = 'medfind-salone-v8';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './app.html',
    './admin.html',
    './spa.html',
    './app-styles.css',
    './admin-styles.css',
    './data.js',
    './app-script.js',
    './admin-script.js',
    './spa-script.js',
    './data/hospitals_complete.json',
    './assets/logo.svg',
    './assets/vendor/leaflet/leaflet.css',
    './assets/vendor/leaflet/leaflet.js',
    './assets/vendor/leaflet/images/marker-icon.png',
    './assets/vendor/leaflet/images/marker-shadow.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Assets
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Runtime Caching for OSM Tiles
                if (event.request.url.includes('tile.openstreetmap.org')) {
                    return fetch(event.request).then(response => {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                        return response;
                    }).catch(() => {
                        // Optional: Return a fallback tile image if offline and tile not found
                        // return caches.match('./assets/offline-tile-placeholder.png');
                    });
                }

                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
                        // Allow caching of 'opaque' responses (like CDN assets/tiles) if needed, 
                        // but here we check for basic. For tiles we handled above.
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
