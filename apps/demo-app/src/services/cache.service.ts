const APP_VERSION = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : '1.0.0';
const IS_PROD = typeof import.meta !== 'undefined' && import.meta.env?.PROD;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

function getCacheTTL(devTTL: number, prodTTL: number): number {
  return IS_PROD ? prodTTL : devTTL;
}

function getCacheKey(key: string): string {
  return `${key}_${APP_VERSION}`;
}

/**
 * Returns cached data when the entry exists and has not expired.
 *
 * @param key - Logical cache key
 * @param devTTL - Development cache lifetime in milliseconds
 * @param prodTTL - Production cache lifetime in milliseconds
 * @returns Cached value when present and valid
 */
export function getFromCache<T>(key: string, devTTL: number, prodTTL: number): T | null {
  try {
    const raw = localStorage.getItem(getCacheKey(key));
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    if (entry.version !== APP_VERSION) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }

    const ttl = getCacheTTL(devTTL, prodTTL);
    if (Date.now() - entry.timestamp > ttl) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Stores data in localStorage with the active build version.
 *
 * @param key - Logical cache key
 * @param data - Serializable data to cache
 * @returns Nothing
 */
export function setInCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: APP_VERSION,
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}

/**
 * Clears a single versioned cache entry.
 *
 * @param key - Logical cache key to remove
 * @returns Nothing
 */
export function clearCache(key: string): void {
  try {
    localStorage.removeItem(getCacheKey(key));
  } catch {
    // ignore
  }
}

/**
 * Clears all versioned cache entries created by the app.
 *
 * @returns Nothing
 */
export function clearAllCaches(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.includes('_v')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
