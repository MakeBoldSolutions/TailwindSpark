import { useCallback, useEffect, useState } from 'react';
import { clearProjectsCache, getProjects } from '../services/projects.service';
import type { Project } from '../types/projects-api';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refreshCache: () => Promise<void>;
}

/**
 * Loads project data and exposes a cache refresh action.
 *
 * @returns Project results, loading state, and refresh handler
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then(data => setProjects(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  const refreshCache = useCallback(async () => {
    setLoading(true);
    setError(null);
    clearProjectsCache();
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  return { projects, loading, error, refreshCache };
}
