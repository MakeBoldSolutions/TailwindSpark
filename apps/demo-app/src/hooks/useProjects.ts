import { useCallback, useEffect, useState } from 'react';
import { clearProjectsCache, getProjects } from '../services/projects.service';
import type { Project } from '../types/projects-api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshCache = useCallback(async () => {
    clearProjectsCache();
    await fetchData();
  }, [fetchData]);

  return { projects, loading, error, refreshCache };
}
