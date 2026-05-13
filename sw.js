const CACHE_NAME = 'morgen-v7';

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
    const request = event.request;
    const url = request.url;

    if (url.includes('.mp4')) {
        event.respondWith(handleVideo(request));
        return;
    }

    event.respondWith(
        caches.match(request).then((response) => response || fetch(request))
    );
});

// Обработка Range-запросов для видео (нужно для iOS Safari)
async function handleVideo(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request.url); // матчим по URL без Range заголовка

    if (!cachedResponse) {
        // Нет в кеше — качаем с сервера как есть
        return fetch(request);
    }

    const rangeHeader = request.headers.get('range');

    if (!rangeHeader) {
        // Нет Range-заголовка — отдаём как есть
        return cachedResponse;
    }

    // Есть Range-заголовок — нарезаем из кеша
    const blob = await cachedResponse.blob();
    const totalSize = blob.size;

    // Парсим "bytes=start-end"
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (!match) return cachedResponse;

    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;
    const chunkSize = end - start + 1;

    const slicedBlob = blob.slice(start, end + 1);

    return new Response(slicedBlob, {
        status: 206,
        statusText: 'Partial Content',
        headers: {
            'Content-Type': 'video/mp4',
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Content-Length': String(chunkSize),
            'Accept-Ranges': 'bytes',
        }
    });
}