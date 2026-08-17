import type { Project } from '../types/projects-api';
import {
  PROJECTS_API_CONFIG,
  RawProjectsResponseSchema,
  mapRawProjectsResponse,
} from '../types/projects-api';
import { clearCache, getFromCache, setInCache } from './cache.service';
import { getPublicJsonFetchOptions } from './fetchOptions';

const { CACHE_KEY, CACHE_TTL, PROD_URL, FALLBACK_URL } = PROJECTS_API_CONFIG;

function parseAndMapProjects(json: unknown): Project[] {
  const raw = RawProjectsResponseSchema.parse(json);
  return mapRawProjectsResponse(raw);
}

async function fetchProjectsFromUrl(url: string): Promise<Project[]> {
  const response = await fetch(url, getPublicJsonFetchOptions());
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  return parseAndMapProjects(json);
}

async function fetchProjects(): Promise<Project[]> {
  const url = import.meta.env.DEV ? PROJECTS_API_CONFIG.DEV_URL : PROD_URL;
  return fetchProjectsFromUrl(url);
}

async function fetchFallbackProjects(primaryUrl: string): Promise<Project[]> {
  if (primaryUrl === FALLBACK_URL) {
    throw new Error('Fallback URL matches primary URL');
  }

  return fetchProjectsFromUrl(FALLBACK_URL);
}

/**
 * Returns projects from cache, primary API, or fallback data.
 *
 * @returns Normalized project list
 */
export async function getProjects(): Promise<Project[]> {
  const cached = getFromCache<Project[]>(CACHE_KEY, CACHE_TTL.DEV, CACHE_TTL.PROD);
  if (cached) return cached;

  const primaryUrl = import.meta.env.DEV ? PROJECTS_API_CONFIG.DEV_URL : PROD_URL;

  try {
    const data = await fetchProjects();
    setInCache(CACHE_KEY, data);
    return data;
  } catch {
    try {
      const fallback = await fetchFallbackProjects(primaryUrl);
      setInCache(CACHE_KEY, fallback);
      return fallback;
    } catch {
      return [];
    }
  }
}

/**
 * Clears the cached projects payload.
 *
 * @returns Nothing
 */
export function clearProjectsCache(): void {
  clearCache(CACHE_KEY);
}
