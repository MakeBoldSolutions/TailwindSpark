import { useCallback, useEffect, useState } from 'react';
import { clearArticlesCache, getArticles } from '../services/rss.service';
import type { Article } from '../types/rss-api';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshCache = useCallback(async () => {
    clearArticlesCache();
    await fetchData();
  }, [fetchData]);

  return { articles, loading, error, refreshCache };
}
