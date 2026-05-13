const CACHE_NAME = 'morgen-v6';

const ASSETS = [
    './',
    './index.html',
    './css/app.css',
    './js/app.js',
    './img/morgen.jpg',
    './img/ice.jpg',
    './img/cadillac.jpg',
    './img/dulo.jpg',
    './manifest.json'
    // ⚠️ mp4 файлы НЕ кешируем — iOS 12 не умеет отдавать Range-запросы из кеша
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
    const url = event.request.url;

    // ⚠️ mp4 — пропускаем мимо кеша напрямую к серверу
    // iOS 12 требует правильные Range-ответы (206 Partial Content), которые SW не умеет эмулировать
    if (url.includes('.mp4')) {
        return; // браузер сам обратится к серверу
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});