self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.open("vlog").then(c=>
      c.match(e.request).then(r=>r||fetch(e.request))
    )
  );
});
