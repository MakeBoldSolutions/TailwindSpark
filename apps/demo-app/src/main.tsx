import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { clearAllCaches } from './services/cache.service';

const FORCE_CACHE_CLEAR_KEY = 'tailwindspark:force-cache-clear';

async function clearBrowserCaches(): Promise<void> {
  clearAllCaches();

  try {
    sessionStorage.removeItem(FORCE_CACHE_CLEAR_KEY);
    sessionStorage.clear();
  } catch {
    // ignore session storage failures
  }

  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
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

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
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
