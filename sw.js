const CACHE='hospice-field-guide-v9-team';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('hospice-field-guide-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 const known=ASSETS.some(asset=>new URL(asset,self.registration.scope).pathname===url.pathname);
 if(!known)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{const response=await fetch(event.request);if(response.ok){await cache.put(event.request,response.clone());return response;}const saved=await cache.match(event.request,{ignoreSearch:true});return saved||response;}
  catch(error){const saved=await cache.match(event.request,{ignoreSearch:true});if(saved)return saved;if(event.request.mode==='navigate')return cache.match('./index.html');throw error;}
 })());
});
