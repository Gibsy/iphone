const CACHE = 'morgenshtern-v2';
const FILES = [
  '/',
  '/index.html',
  '/img/morgen.jpg',
  '/img/morgen.png',
  '/img/ice.jpg',
  '/img/cadillac.jpg',
  '/img/dulo.jpg'
];

// Устанавливаем и кешируем интерфейс
self.addEventListener('install', e => {
  e.waitUntil(
      caches.open(CACHE)
          .then(cache => cache.addAll(FILES))
          .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
      caches.keys().then(keys =>
          Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      ).then(() => self.clients.claim())
  );
});

// Работаем с кешем для статики, видео пропускаем в IndexedDB через основной скрипт
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Если это не видео, ищем в кеше
  if (!url.pathname.includes('/video/')) {
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});