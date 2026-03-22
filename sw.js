// IntelliTC Service Worker — Cache-first for static assets, network-first for HTML
const CACHE_NAME = 'intellitc-v1';
const STATIC_ASSETS = [
  '/shared/base.css',
  '/shared/style.css',
  '/shared/learn-mode.css',
  '/shared/learn-mode.js',
  '/shared/export.js',
  '/assets/logo.jpg',
  '/assets/logo-192.png',
  '/assets/favicon.ico',
  '/assets/og-image.jpg',
  '/manifest.json'
];

// Install — pre-cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — stale-while-revalidate for CSS/JS/images, network-first for HTML
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // HTML — network first, fall back to cache
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return res;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets — cache first, revalidate in background
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(res => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
        return res;
      });
      return cached || fetchPromise;
    })
  );
});
