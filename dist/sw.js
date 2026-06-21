const CACHE = 'glucoflow-v1';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      return caches.open(CACHE).then(cache => {
        if (e.request.method === 'GET') cache.put(e.request, res.clone());
        return res;
      });
    }))
  );
});
