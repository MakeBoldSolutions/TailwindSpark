import type { Article } from '../types/rss-api';
import { ARTICLES_API_CONFIG, RawArticlesResponseSchema, mapRawArticle } from '../types/rss-api';
import { clearCache, getFromCache, setInCache } from './cache.service';
import { getPublicJsonFetchOptions } from './fetchOptions';

const { CACHE_KEY, CACHE_TTL, PROD_URL, FALLBACK_URL } = ARTICLES_API_CONFIG;

function parseAndMapArticles(json: unknown): Article[] {
  const raw = RawArticlesResponseSchema.parse(json);
  return raw.map(mapRawArticle);
}

async function fetchArticles(): Promise<Article[]> {
  const url = import.meta.env.DEV ? ARTICLES_API_CONFIG.DEV_URL : PROD_URL;
  const response = await fetch(url, getPublicJsonFetchOptions());
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  return parseAndMapArticles(json);
}

async function fetchFallbackArticles(): Promise<Article[]> {
  const response = await fetch(FALLBACK_URL, getPublicJsonFetchOptions());
  if (!response.ok) throw new Error('Fallback fetch failed');
  const json = await response.json();
  return parseAndMapArticles(json);
}

/**
 * Returns articles from cache, primary API, or fallback data.
 *
 * @returns Normalized article list
 */
export async function getArticles(): Promise<Article[]> {
  const cached = getFromCache<Article[]>(CACHE_KEY, CACHE_TTL.DEV, CACHE_TTL.PROD);
  if (cached) return cached;

  try {
    const data = await fetchArticles();
    setInCache(CACHE_KEY, data);
    return data;
  } catch {
    try {
      const fallback = await fetchFallbackArticles();
      setInCache(CACHE_KEY, fallback);
      return fallback;
    } catch {
      return [];
    }
  }
}

/**
 * Clears the cached articles payload.
 *
 * @returns Nothing
 */
export function clearArticlesCache(): void {
  clearCache(CACHE_KEY);
}
