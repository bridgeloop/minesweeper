function doCache() {
	if (new Date - doCache.timestamp < 10000) {
		return;
	}
	return caches.open("minesweeper_cache").then(cache => cache.addAll([
		"./",
		"./pt-sans-caption.woff2",
	]));
	doCache.timestamp = new Date;
}

addEventListener("install", e => {
	e.waitUntil(doCache());
});

addEventListener("fetch", e => {
	e.respondWith(
		caches.match(e.request).then(response => {
			if (response) {
				return response;
			}
			return fetch(e.request);
		})
	);
});

addEventListener("message", e => {
	e.waitUntil((async _ => {
		if (e.data.message == "update") {
			await caches.delete("minesweeper_cache");
			await doCache();
			return e.source.postMessage({ message: "updated", id: e.data.id });
		}
	})());
});
