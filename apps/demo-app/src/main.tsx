import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { clearAllCaches } from './services/cache.service';
import { initializeThemeBoot } from './utils/themeBoot';
import { getTailwindSparkCacheNames } from './utils/themeRuntimeCache';

const FORCE_CACHE_CLEAR_KEY = 'tailwindspark:force-cache-clear';
const THEME_RUNTIME_VERSION = 'theme-platform-v2';

async function clearBrowserCaches(): Promise<void> {
  clearAllCaches();

  try {
    sessionStorage.removeItem(FORCE_CACHE_CLEAR_KEY);
  } catch {
    // ignore session storage failures
  }

  if ('caches' in window) {
    const cacheNames = await caches.keys();
    const ownedCacheNames = getTailwindSparkCacheNames(cacheNames, THEME_RUNTIME_VERSION);
    await Promise.all(ownedCacheNames.map(cacheName => caches.delete(cacheName)));
  }
}

function setupHardRefreshCacheClearing(): void {
  if (sessionStorage.getItem(FORCE_CACHE_CLEAR_KEY) === '1') {
    void clearBrowserCaches();
  }

  window.addEventListener('keydown', event => {
    const isHardRefresh = event.key === 'F5' && (event.ctrlKey || event.metaKey || event.shiftKey);
    if (!isHardRefresh) {
      return;
    }

    try {
      sessionStorage.setItem(FORCE_CACHE_CLEAR_KEY, '1');
    } catch {
      // ignore session storage failures
    }

    void clearBrowserCaches();
  });
}

setupHardRefreshCacheClearing();
initializeThemeBoot();

function setupServiceWorkerVersionSync(): void {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type !== 'TAILWINDSPARK_SW_VERSION') {
      return;
    }

    if (event.data.version !== THEME_RUNTIME_VERSION) {
      void clearBrowserCaches();
    }
  });
}

setupServiceWorkerVersionSync();

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(registration => {
        registration.active?.postMessage({
          type: 'GET_THEME_RUNTIME_VERSION',
        });

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) {
            return;
          }

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              installingWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(() => {
        // Service worker registration failed silently
      });
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
