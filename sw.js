const CACHE_NAME = 'steves-garage-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/favicon.png',
  '/dodge-coyote.html',
  '/cutlass.html',
  '/mustang.html',
  '/olds.html',
  '/img/442closeup.webp',
  '/img/cutlass-1.webp',
  '/img/cutlass-2.webp',
  '/img/cutlass-3.webp',
  '/img/cutlass-4.webp',
  '/img/dodge-coyote-1.webp',
  '/img/dodge-coyote-2.webp',
  '/img/dodge-coyote-3.webp',
  '/img/dodge-coyote-4.webp',
  '/img/dodge-coyote-5.webp',
  '/img/firenza.webp',
  '/img/mustang-1.webp',
  '/img/mustang.webp',
  '/img/olds-1.webp',
  '/img/olds-2.webp',
  '/img/olds-3.webp',
  '/img/olds-4.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request)
          .then(cached => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
