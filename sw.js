const CACHE_NAME = 'morgen-v8';

const ASSETS = [
    './',
    './index.html',
    './css/app.css',
    './js/app.js',
    './img/morgen.jpg',
    './img/ice.jpg',
    './img/iceBIG.jpg',
    './img/cadillac.jpg',
    './img/cadillacBIG.jpg',
    './img/dulo.jpg',
    './img/duloBIG.jpg',
    './img/screamer.jpg',
    './audio/ice.mp3',
    './audio/cadillac.mp3',
    './audio/dulo.mp3',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                ASSETS.map(url =>
                    cache.add(url).catch(err => console.error('SW: не загружено:', url, err))
                )
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});