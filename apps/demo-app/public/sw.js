const CACHE_NAME = 'tailwindspark-v1.3.1';
const STATIC_CACHE = 'static-v1.3.1';
const RUNTIME_CACHE = 'runtime-v1.3.1';
const IMAGES_CACHE = 'images-v1.3.1';

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
  '/about',
  '/apps',
  '/apps/projects',
  '/apps/articles',
  '/apps/joke',
  '/apps/weather',
  '/apps/ai-chat',
];

const buildPrecacheUrls = () => {
  const scope = self.registration?.scope || self.location.origin + '/';
  return [...coreFiles, ...appRoutes].map(path => new URL(path, scope).toString());
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
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old caches
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== RUNTIME_CACHE &&
              cacheName !== IMAGES_CACHE
            ) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
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
