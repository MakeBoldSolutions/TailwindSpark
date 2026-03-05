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

export function clearCache(key: string): void {
  try {
    localStorage.removeItem(getCacheKey(key));
  } catch {
    // ignore
  }
}

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
