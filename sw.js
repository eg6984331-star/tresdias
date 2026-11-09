const CACHE = 'tresdias-v2';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // No cachear audio: siempre red
  if (req.destination === 'audio' || /\.(mp3|m4a|wav|ogg)$/i.test(url.pathname)) return;

  e.respondWith(
    caches.match(req).then(hit =>
      hit ||
      fetch(req).then(res => {
        if (req.method === 'GET' && res.ok) {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put(req, copia));
        }
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
