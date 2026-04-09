import type { ReposProfile, Repository } from '../types/repos-api';
import { REPOS_API_CONFIG, RawReposResponseSchema, mapRawProfile, mapRawRepository } from '../types/repos-api';
import { clearCache, getFromCache, setInCache } from './cache.service';
import { getPublicJsonFetchOptions } from './fetchOptions';

const { CACHE_KEY, CACHE_TTL, DATA_URL } = REPOS_API_CONFIG;
const PROFILE_CACHE_KEY = `${CACHE_KEY}_profile`;

interface ReposData {
  repositories: Repository[];
  profile: ReposProfile;
}

function parseAndMapRepos(json: unknown): ReposData {
  const raw = RawReposResponseSchema.parse(json);
  return {
    repositories: raw.repositories.map(mapRawRepository),
    profile: mapRawProfile(raw.profile),
  };
}

async function fetchReposFromUrl(url: string): Promise<ReposData> {
  const response = await fetch(url, getPublicJsonFetchOptions());
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json: unknown = await response.json();
  return parseAndMapRepos(json);
}

/**
 * Returns repositories and profile data from cache or local data file.
 *
 * @returns Normalized repositories and profile data
 */
export async function getRepositories(): Promise<ReposData> {
  const cachedRepos = getFromCache<Repository[]>(CACHE_KEY, CACHE_TTL.DEV, CACHE_TTL.PROD);
  const cachedProfile = getFromCache<ReposProfile>(PROFILE_CACHE_KEY, CACHE_TTL.DEV, CACHE_TTL.PROD);
  if (cachedRepos && cachedProfile) {
    return { repositories: cachedRepos, profile: cachedProfile };
  }

  try {
    const data = await fetchReposFromUrl(DATA_URL);
    setInCache(CACHE_KEY, data.repositories);
    setInCache(PROFILE_CACHE_KEY, data.profile);
    return data;
  } catch {
    return { repositories: [], profile: { username: '', totalRepositories: 0, totalStars: 0, totalForks: 0, totalCommits: 0 } };
  }
}

/**
 * Clears the cached repositories payload.
 */
export function clearReposCache(): void {
  clearCache(CACHE_KEY);
  clearCache(PROFILE_CACHE_KEY);
}
