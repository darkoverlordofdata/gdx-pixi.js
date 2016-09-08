// cache version
var cacheName = 'v2:shmupwarz';


// cache static assets
self.addEventListener('install', function(e) {
    // fetch the resources to make this work offline
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                "assets/orig/pack.atlas",
                "assets/orig/pack.png",
                "assets/project.dt",
                "assets/scenes/MainScene.dt",
                "assets/scenes/LeaderboardScene.dt",
                "assets/scenes/MenuScene.dt",
                "assets/scenes/OptionsScene.dt",
                "fonts/hud.fnt",
                "fonts/hud_0.png",
                "fonts/normal.fnt",
                "fonts/normal_0.png",
                "images/BackdropBlackLittleSparkBlack.png",
                "images/bang.png",
                "images/explosion.png",
                "images/enemy1.png",
                "images/enemy2.png",
                "images/enemy3.png",
                "images/bullet.png",
                "images/spaceshipspr.png"
                
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
    // either respond with the cached object or go ahead and fetch the actual url
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});