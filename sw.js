const CACHE_NAME = 'morgen-v2';

// ВАЖНО: Убедись, что эти пути ТОЧНО совпадают с твоей структурой папок
const ASSETS = [
    './',
    './index.html',
    './css/app.css',
    './js/app.js',
    './img/morgen.jpg',
    './img/ice.jpg',
    './img/cadillac.jpg',
    './img/dulo.jpg',
    './video/ice.mp4',
    './video/cadillac.mp4',
    './video/dulo.mp4',
    './manifest.json'
];

// Установка: Кешируем всё подряд
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Кешируем ресурсы...');
            // Используем addAll, но если один файл упадет, упадет всё.
            // Для надежности можно кешировать по одному:
            return Promise.all(
                ASSETS.map(url => {
                    return cache.add(url).catch(err => console.error('SW: Не удалось загрузить:', url, err));
                })
            );
        })
    );
    self.skipWaiting();
});

// Активация
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// Перехват запросов (Стратегия: Сначала Кеш, потом Сеть)
self.addEventListener('fetch', (event) => {
    // Особая обработка для видео из-за Range запросов в Safari
    if (event.request.url.includes('.mp4')) {
        event.respondWith(
            caches.match(event.request).then((matchedResponse) => {
                if (matchedResponse) return matchedResponse;

                return fetch(event.request).then((networkResponse) => {
                    return networkResponse;
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});