/*
 * Service worker — makes the app installable and usable offline on the tablet
 * (decisions.md D3). Cache-first for the shell, which is all static.
 *
 * Note: audio/ is deliberately NOT precached. Once real phoneme recordings land
 * (D7) they will need a considered caching strategy — the bundle could be large
 * and vision-review.md §2.3 flags it as an open architectural question.
 */

const CACHE = 'yagui-reads-v1';

const SHELL = [
  '.',
  'index.html',
  'css/app.css',
  'js/app.js',
  'js/audio.js',
  'js/recorder.js',
  'js/data/words.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request)
        .then((response) => {
          // Cache same-origin successes so later navigations work offline.
          if (response.ok && new URL(request.url).origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match('index.html'));
    })
  );
});
