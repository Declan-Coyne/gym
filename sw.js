// In-app updates: open instantly from the last downloaded version, and in the background fetch the newest
// version from GitHub Pages so it's used next time the app opens. With no internet, the cached version just runs.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  const sameOrigin = new URL(req.url).origin === location.origin;
  e.respondWith(caches.open('gym').then(async cache => {
    const cached = await cache.match(req, { ignoreSearch: true });
    // no-cache: always ask GitHub whether the file changed, instead of trusting the browser's 10-minute cache
    const fresh = fetch(sameOrigin ? new Request(req.url, { cache: 'no-cache' }) : req).then(res => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    });
    if (cached) { e.waitUntil(fresh.catch(() => {})); return cached; }
    return fresh.catch(() => Response.error());
  }));
});
