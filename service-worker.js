// Minimal service worker — required for PWA install
const CACHE = 'sl-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './page-edu.html',
  './page-schedule.html',
  './page-syllabus.html',
  './page-papers.html',
  './page-eligibility.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});