const CACHE = 'morgenshtern-v1';
const FILES = [
  '/',
  '/index.html',
  '/img/morgen.jpg',
  '/img/morgen.png',
  '/img/ice.jpg',
  '/img/cadillac.jpg',
  '/img/dulo.jpg'
];

const VIDEOS = [
  '/video/output.mp4',
  '/video/Cadillac.mp4',
];

// ─── IndexedDB helpers ───────────────────────────────────────────────────────

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('videoDB', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('videos');
    req.onsuccess    = e => res(e.target.result);
    req.onerror      = e => rej(e.target.error);
  });
}

async function getVideo(url) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const req = db.transaction('videos', 'readonly')
        .objectStore('videos').get(url);
    req.onsuccess = e => res(e.target.result); // Blob или undefined
    req.onerror   = e => rej(e.target.error);
  });
}

async function saveVideo(url) {
  const resp = await fetch(url);
  const blob = await resp.blob();
  const db   = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('videos', 'readwrite');
    tx.objectStore('videos').put(blob, url);
    tx.oncomplete = res;
    tx.onerror    = e => rej(e.target.error);
  });
}

// ─── Install: кешируем статику ───────────────────────────────────────────────

self.addEventListener('install', e => {
  e.waitUntil(
      caches.open(CACHE)
          .then(cache => cache.addAll(FILES))
          .then(() => self.skipWaiting())
  );
});

// ─── Activate: удаляем старые кеши ──────────────────────────────────────────

self.addEventListener('activate', e => {
  e.waitUntil(
      caches.keys().then(keys =>
          Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      ).then(() => self.clients.claim())
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Видео: IndexedDB → сеть
  if (url.pathname.startsWith('/video/')) {
    e.respondWith(
        getVideo(url.pathname).then(blob => {
          if (blob) {
            return new Response(blob, {
              status: 200,
              headers: { 'Content-Type': 'video/mp4' }
            });
          }
          // Нет в IndexedDB — отдаём из сети напрямую (без кеширования)
          return fetch(e.request);
        }).catch(() => fetch(e.request))
    );
    return;
  }

  // Всё остальное: кеш → сеть → fallback
  e.respondWith(
      caches.match(e.request).then(cached =>
          cached || fetch(e.request).catch(() => caches.match('/index.html'))
      )
  );
});

// ─── Message: скачать видео по команде со страницы ───────────────────────────

self.addEventListener('message', e => {
  if (e.data === 'DOWNLOAD_VIDEOS') {
    Promise.all(
        VIDEOS.map(async url => {
          const existing = await getVideo(url).catch(() => undefined);
          if (!existing) await saveVideo(url);
        })
    ).then(() => {
      // Уведомляем страницу что всё готово
      self.clients.matchAll().then(clients =>
          clients.forEach(c => c.postMessage('VIDEOS_READY'))
      );
    });
  }
});