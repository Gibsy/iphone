const CACHE = 'morgenshtern-v3';

const FILES = [
  '/',
  '/index.html',

  '/img/morgen.jpg',
  '/img/morgen.png',

  '/img/ice.jpg',
  '/img/cadillac.jpg',
  '/img/dulo.jpg',

  '/audio/ice.mp3',
  '/audio/cadillac.mp3',
  '/audio/dulo.mp3'
];

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
          Promise.all(
              keys
                  .filter(key => key !== CACHE)
                  .map(key => caches.delete(key))
          )
      ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;

        return fetch(e.request)
            .then(res => {
              const clone = res.clone();

              if (e.request.url.startsWith(self.location.origin)) {
                caches.open(CACHE).then(cache => {
                  cache.put(e.request, clone);
                });
              }

              return res;
            })
            .catch(() => {
              if (e.request.destination === 'document') {
                return caches.match('/index.html');
              }
            });
      })
  );
});