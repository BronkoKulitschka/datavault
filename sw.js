// Datavault — Service Worker
//
// Caches only the app's own shell: the HTML hull, the JavaScript modules,
// the manifest and the icons. Wiki content is NEVER cached — every article
// is fetched live from the source wiki on each view. This app is a reader,
// not an archive.
//
// When a module is added or removed under js/, add it here too and raise
// the cache name below.

const CACHE = "datavault-shell-v2";

const SHELL = [
  "./",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./js/main.js",
  "./js/app.js",
  "./js/version.js",
  "./js/sigil.js",
  "./js/wiki.js",
  "./js/data/factions.js",
  "./js/data/search.js",
  "./js/data/categories.js",
  "./js/data/important.js",
  "./js/data/minor-factions.js",
  "./js/data/timeline.js",
  "./js/data/misc.js",
  "./js/styles/base.js",
  "./js/styles/panels.js",
  "./js/styles/timeline.js",
  "./js/styles/header.js",
  "./js/styles/article.js",
  "./js/styles/content.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Cache each file individually; a single missing file must NOT abort
      // the whole install (that would break the app).
      Promise.all(
        SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("Skip caching", url, err);
          })
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    // Removes every older cache, including those from previous app names.
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never intercept wiki API / external requests — always go to network.
  const isExternal = url.origin !== self.location.origin;
  if (isExternal || event.request.method !== "GET") {
    return; // let the browser handle it normally
  }

  // App shell: network-first so updates always come through, cache as fallback.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
