const CACHE='njang-wolof-learning-20261007';
const ASSETS=['./','./index.html','./styles.css?v=34','./data.js?v=34','./app.js?v=34','./learning.js?v=34','./lexicon-packs.js?v=34','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png','./update.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r&&r.ok){const q=r.clone();caches.open(CACHE).then(c=>c.put(e.request,q))}return r}).catch(()=>caches.match(e.request).then(h=>h||caches.match('./index.html'))))});
