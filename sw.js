const CACHE = 'tresdias-offline-v1';
const APP_SHELL = [
  './', 
  './index.html', 
  './manifest.json', 
  './icon.svg',
  './portada.jpg', // Asegúrate que tu foto se llame así
  './unavida.mp3',
  './ojitosdemiel.mp3',
  './viajaconmigo.mp3',
  './colorrose.mp3',
  './unsecreto.mp3',
  './enlasmadrugadas.mp3',
  './rhbtrack.mp3',
  './comoleexplico.mp3',
  './annad.mp3',
  './seloplatiquealuna.mp3',
  './bella.mp3',
  './bonustrack.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      // Esto descarga todos los archivos y audios en segundo plano
      return c.addAll(APP_SHELL);
    })
  );
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
  e.respondWith(
    caches.match(e.request).then(hit => {
      return hit || fetch(e.request);
    })
  );
});
