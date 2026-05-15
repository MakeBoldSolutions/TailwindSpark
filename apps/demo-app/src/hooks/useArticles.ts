import { useCallback, useEffect, useState } from 'react';
import { clearArticlesCache, getArticles } from '../services/rss.service';
import type { Article } from '../types/rss-api';

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refreshCache: () => Promise<void>;
}

/**
 * Loads article data and exposes a cache refresh action.
 *
 * @returns Article results, loading state, and refresh handler
 */
export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getArticles()
      .then(data => setArticles(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load articles'))
      .finally(() => setLoading(false));
  }, []);

  const refreshCache = useCallback(async () => {
    setLoading(true);
    setError(null);
    clearArticlesCache();
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  return { articles, loading, error, refreshCache };
}
