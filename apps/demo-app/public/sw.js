// Bump this version when theme runtime assets or boot behavior change so clients
// can recover coherently from stale caches without a manual cache clear.
const THEME_RUNTIME_VERSION = 'theme-platform-v1';
const CACHE_NAME = `tailwindspark-${THEME_RUNTIME_VERSION}`;
const STATIC_CACHE = `static-${THEME_RUNTIME_VERSION}`;
const RUNTIME_CACHE = `runtime-${THEME_RUNTIME_VERSION}`;
const IMAGES_CACHE = `images-${THEME_RUNTIME_VERSION}`;

// Cache duration in milliseconds
const CACHE_DURATION = {
  STATIC: 30 * 24 * 60 * 60 * 1000, // 30 days
  RUNTIME: 7 * 24 * 60 * 60 * 1000, // 7 days
  IMAGES: 14 * 24 * 60 * 60 * 1000, // 14 days
};

// Core files that should always be cached
const coreFiles = [
  './',
  './index.html',
  './og-image.svg',
  './TailwindSpark.png',
  './TailwindSpark.svg',
  './site.webmanifest',
];

// Application routes that should be available from the cache for SPA navigation
const appRoutes = [
  'about',
  'apps',
  'apps/projects',
  'apps/articles',
  'apps/joke',
  'apps/weather',
  'apps/ai-chat',
  'apps/repos',
];

const buildPrecacheUrls = () => {
  const scope = self.registration?.scope || self.location.origin + '/';
  return [...coreFiles, ...appRoutes].map(path => new URL(path, scope).toString());
};

const getThemeRuntimeNamespace = runtimeVersion => runtimeVersion.replace(/-v[^-]+$/, '');

const isTailwindSparkCacheName = cacheName => {
  const namespace = getThemeRuntimeNamespace(THEME_RUNTIME_VERSION);
  const ownedPrefixes = [
    `tailwindspark-${namespace}-`,
    `static-${namespace}-`,
    `runtime-${namespace}-`,
    `images-${namespace}-`,
  ];

  return ownedPrefixes.some(prefix => cacheName.startsWith(prefix));
};

// Runtime caching patterns
const cachePatterns = {
  // Static assets (CSS, JS, fonts)
  static: /\.(css|js|woff2?|ttf|eot)$/,
  // Images
  images: /\.(png|jpg|jpeg|gif|webp|svg|ico)$/,
  // API calls (if any)
  api: /\/api\//,
  // Google Fonts
  fonts: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
  // Google Analytics
  analytics: /^https:\/\/www\.(google-analytics|googletagmanager)\.com\//,
  // JokeAPI - should NOT be cached (needs fresh jokes each time)
  jokeAPI: /^https:\/\/v2\.jokeapi\.dev\//,
};

// Utility functions
const isExpired = (timestamp, duration) => {
  return Date.now() - timestamp > duration;
};

const getCacheStrategy = url => {
  const { pathname } = new URL(url);

  if (cachePatterns.static.test(pathname))
    return { cache: STATIC_CACHE, duration: CACHE_DURATION.STATIC };
  if (cachePatterns.images.test(pathname))
    return { cache: IMAGES_CACHE, duration: CACHE_DURATION.IMAGES };
  if (cachePatterns.fonts.test(url))
    return { cache: STATIC_CACHE, duration: CACHE_DURATION.STATIC };
  if (cachePatterns.analytics.test(url)) return null; // Don't cache analytics
  if (cachePatterns.jokeAPI.test(url)) return null; // Don't cache jokes (need fresh content)

  return { cache: RUNTIME_CACHE, duration: CACHE_DURATION.RUNTIME };
};

// Install event - cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => Promise.all(
        buildPrecacheUrls().map(async url => {
          try {
            const response = await fetch(url, { cache: 'no-store' });
            if (response.ok) {
              await cache.put(url, response.clone());
            }
          } catch {
            return null;
          }
          return null;
        })
      ))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(isTailwindSparkCacheName)
          .filter(
            cacheName =>
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== RUNTIME_CACHE &&
              cacheName !== IMAGES_CACHE
          )
          .map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ includeUncontrolled: true }))
      .then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'TAILWINDSPARK_SW_VERSION',
            version: THEME_RUNTIME_VERSION,
          });
        });
      })
  );
});

self.addEventListener('message', event => {
  // Reject messages from any origin other than the page this SW controls.
  if (event.origin !== self.location.origin) {
    return;
  }

  // Supports both immediate activation and runtime version checks during rollout verification.
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data?.type === 'GET_THEME_RUNTIME_VERSION' && event.source) {
    event.source.postMessage({
      type: 'TAILWINDSPARK_SW_VERSION',
      version: THEME_RUNTIME_VERSION,
    });
  }
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = request.url;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.startsWith('http')) return;

  // Get cache strategy for this URL
  const strategy = getCacheStrategy(url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const responseToCache = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, responseToCache));
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(RUNTIME_CACHE);
          const cachedResponse = await cache.match(request);
          return cachedResponse || caches.match(new URL('./index.html', self.registration.scope).toString());
        })
    );
    return;
  }

  if (!strategy) {
    // Don't cache (e.g., analytics)
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.open(strategy.cache).then(cache => {
      return cache.match(request).then(cachedResponse => {
        // Check if cached response exists and is not expired
        if (cachedResponse) {
          const cachedDate = cachedResponse.headers.get('cached-date');
          if (cachedDate && !isExpired(parseInt(cachedDate), strategy.duration)) {
            return cachedResponse;
          }
        }

        // Fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Only cache successful responses
            if (networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              // Add timestamp to track cache age
              const headers = new Headers(responseToCache.headers);
              headers.set('cached-date', Date.now().toString());

              const cachedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers,
              });

              cache.put(request, cachedResponse);
            }
            return networkResponse;
          })
          .catch(() => {
            // Return cached version as fallback, even if expired
            return cachedResponse || new Response('Offline', { status: 503 });
          });
      });
    })
  );
});
