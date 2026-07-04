const CACHE = 'taskmanager-v3';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.json'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return; // فایربیس را کش نکن
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const cl = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, cl));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => cs.length ? cs[0].focus() : clients.openWindow('./')));
});
