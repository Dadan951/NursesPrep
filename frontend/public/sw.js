/* ─── NursesPrep Service Worker ─────────────────────────────────────────────
   1) Cache offline de l'app (app shell + assets) → utilisable sans réseau
   2) Notifications push (même app fermée)
   ─────────────────────────────────────────────────────────────────────────── */

const CACHE = 'nursesprep-v1';
const CORE_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.ico', '/logo192.png', '/logo512.png'];

/* ── Installation : pré-cache de l'app shell + tous les bundles du build ──
   Lit asset-manifest.json (généré par CRA) pour cacher chaque chunk JS/CSS,
   afin que TOUTES les pages (chargées en lazy) fonctionnent hors-ligne, pas
   seulement celles déjà visitées. Se fait en arrière-plan, sans ralentir le
   premier rendu. */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await cache.addAll(CORE_ASSETS).catch(() => {});
      try {
        const res = await fetch('/asset-manifest.json', { cache: 'no-cache' });
        if (res.ok) {
          const manifest = await res.json();
          const bundles = Object.values(manifest.files || {})
            .filter((f) => typeof f === 'string' && (f.endsWith('.js') || f.endsWith('.css')));
          await cache.addAll(bundles).catch(() => {});
        }
      } catch (_) { /* offline au 1er chargement : on cachera à la volée */ }
    })
  );
});

/* ── Activation : suppression des anciens caches (bump CACHE pour purger) ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch : stratégie de cache offline ─────────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // On ne gère que les GET — jamais les mutations (POST/PUT/DELETE)
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Les appels API (autre origine = backend) ne sont jamais mis en cache :
  // données dynamiques et authentifiées → toujours réseau
  if (url.origin !== self.location.origin) return;

  // Navigation SPA → réseau d'abord (toujours la dernière version quand online),
  // repli sur l'app en cache quand hors-ligne
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Assets statiques (JS/CSS/images) → cache d'abord, mise à jour en arrière-plan
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

/* ── Réception d'une notification push ──────────────────────────────────── */
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title   = data.title  || 'NursePrep';
  const options = {
    body:    data.body   || '',
    icon:    data.icon   || '/logo192.png',
    badge:   data.badge  || '/logo192.png',
    data:  { url: data.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ── Clic sur la notification → ouvre / focus l'app ─────────────────────── */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si l'app est déjà ouverte, focus
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Sinon ouvre un nouvel onglet
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
