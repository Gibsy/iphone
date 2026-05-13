const CACHE_NAME = 'morgen-v1';
const ASSETS = [
    '/',
    'index.html',
    'css/app.css',
    'js/app.js',
    'img/morgen.jpg',
    'img/morgen.png',
    'img/ice.jpg',
    'img/cadillac.jpg',
    'img/dulo.jpg',
    'video/ice.mp4',
    'video/cadillac.mp4',
    'video/dulo.mp4'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});