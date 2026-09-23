const CACHE_NAME = 'portal-cte-v1';
const ASSETS = [
  '.',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Solo interceptar peticiones GET (POST, PUT, etc. pasan directo)
  if (req.method !== 'GET') {
    return;
  }

  // Solo cachear del mismo origen (evita chrome-extension, supabase.co, etc.)
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  e.respondWith(
    fetch(req)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
