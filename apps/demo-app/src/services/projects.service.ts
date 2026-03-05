import type { Project } from '../types/projects-api';
import { PROJECTS_API_CONFIG, RawProjectsResponseSchema, mapRawProject } from '../types/projects-api';
import { clearCache, getFromCache, setInCache } from './cache.service';

const { CACHE_KEY, CACHE_TTL, PROD_URL, FALLBACK_URL } = PROJECTS_API_CONFIG;

function parseAndMapProjects(json: unknown): Project[] {
  const raw = RawProjectsResponseSchema.parse(json);
  return raw.map(mapRawProject);
}

async function fetchProjects(): Promise<Project[]> {
  const url = import.meta.env.DEV ? PROJECTS_API_CONFIG.DEV_URL : PROD_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  return parseAndMapProjects(json);
}

async function fetchFallbackProjects(): Promise<Project[]> {
  const response = await fetch(FALLBACK_URL);
  if (!response.ok) throw new Error('Fallback fetch failed');
  const json = await response.json();
  return parseAndMapProjects(json);
}

export async function getProjects(): Promise<Project[]> {
  const cached = getFromCache<Project[]>(CACHE_KEY, CACHE_TTL.DEV, CACHE_TTL.PROD);
  if (cached) return cached;

  try {
    const data = await fetchProjects();
    setInCache(CACHE_KEY, data);
    return data;
  } catch {
    try {
      const fallback = await fetchFallbackProjects();
      setInCache(CACHE_KEY, fallback);
      return fallback;
    } catch {
      return [];
    }
  }
}

export function clearProjectsCache(): void {
  clearCache(CACHE_KEY);
}
