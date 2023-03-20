const VERSION = "6";
const ORIGIN = location.protocol + '//' + location.hostname;

const STATIC_CACHE_KEY = 'static-' + VERSION;
const STATIC_FILES = [
    /*
    ORIGIN + '/',
    ORIGIN + '/index.html',
    ORIGIN + '/images/marker-icon-2x.png',
    ORIGIN + '/images/marker-icon.png',
    ORIGIN + '/images/marker-shadow.png',
    ORIGIN + '/logo192.png',
    ORIGIN + '/logo512.png',
    ORIGIN + '/bootstrap.css',
    ORIGIN + '/bootstrap.min.css.map',
    ORIGIN + '/bootstrap.js',
    ORIGIN + '/bootstrap.min.js.map',
    ORIGIN + '/jquery.js',
    ORIGIN + '/leaflet.css',
    ORIGIN + '/leaflet.js',
    */
    ORIGIN + '/serviceworker_sample/',
    ORIGIN + '/serviceworker_sample/index.html',
    ORIGIN + '/serviceworker_sample/images/marker-icon-2x.png',
    ORIGIN + '/serviceworker_sample/images/marker-icon.png',
    ORIGIN + '/serviceworker_sample/images/marker-shadow.png',
    ORIGIN + '/serviceworker_sample/logo192.png',
    ORIGIN + '/serviceworker_sample/logo512.png',
    ORIGIN + '/serviceworker_sample/bootstrap.css',
    ORIGIN + '/serviceworker_sample/bootstrap.min.css.map',
    ORIGIN + '/serviceworker_sample/bootstrap.js',
    ORIGIN + '/serviceworker_sample/bootstrap.min.js.map',
    ORIGIN + '/serviceworker_sample/jquery.js',
    ORIGIN + '/serviceworker_sample/leaflet.css',
    ORIGIN + '/serviceworker_sample/leaflet.js',

    //. 以下は Developer Console でみるとキャッシュできていない。が、オフラインにしても見れている？？
    'https://manholemap.juge.me/get?id=157009',
    'https://manholemap.juge.me/get?id=1125001',
    'https://manholemap.juge.me/get?id=1520004',
    'https://manholemap.juge.me/get?id=107005',
    'https://manholemap.juge.me/get?id=1659010',
];
const CACHE_KEYS = [
    STATIC_CACHE_KEY
];

//. ここで（インストール時に）キャッシュする
//. 外部 URL も可、っぽい
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_KEY).then(cache => {
            return Promise.all(
                STATIC_FILES.map(url => {
                    return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
                        return cache.put(url, response);
                    });
                })
            );
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return cacheNames.filter((cacheName) => {
                // STATIC_CACHE_KEYではないキャッシュを探す
                return cacheName !== STATIC_CACHE_KEY;
            });
        }).then((cachesToDelete) => {
            return Promise.all(cachesToDelete.map((cacheName) => {
                // いらないキャッシュを削除する
                return caches.delete(cacheName);
            }));
        })
    );
});

self.addEventListener('fetch', event => {
    // POSTの場合はキャッシュを使用しない
    if ('POST' === event.request.method) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // キャッシュ内に該当レスポンスがあれば、それを返す
            if (response) {
                return response;
            }

          // 重要：リクエストを clone する。リクエストは Stream なので
          // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
          // 必要なので、リクエストは clone しないといけない
            let fetchRequest = event.request.clone();

            return fetch(fetchRequest)
            .then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    // キャッシュする必要のないタイプのレスポンスならそのまま返す
                    return response;
                }

                // 重要：レスポンスを clone する。レスポンスは Stream で
                // ブラウザ用とキャッシュ用の2回必要。なので clone して
                // 2つの Stream があるようにする
                let responseToCache = response.clone();

                caches.open(STATIC_CACHE_KEY).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
