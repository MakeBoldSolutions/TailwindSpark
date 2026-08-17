import type { ReposProfile, Repository } from '../types/repos-api';
import {
  REPOS_API_CONFIG,
  RawReposResponseSchema,
  mapRawProfile,
  mapRawRepository,
} from '../types/repos-api';
import { clearCache, getFromCache, setInCache } from './cache.service';
import { getPublicJsonFetchOptions } from './fetchOptions';

const { CACHE_KEY, CACHE_TTL, DATA_URL } = REPOS_API_CONFIG;
const PROFILE_CACHE_KEY = `${CACHE_KEY}_profile`;

interface ReposData {
  repositories: Repository[];
  profile: ReposProfile;
}

function isRepository(value: unknown): value is Repository {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const repository = value as Partial<Repository>;
  return (
    typeof repository.name === 'string' &&
    typeof repository.summaryText === 'string' &&
    typeof repository.url === 'string' &&
    typeof repository.stars === 'number' &&
    typeof repository.forks === 'number' &&
    typeof repository.totalCommits === 'number' &&
    typeof repository.recentCommits90d === 'number' &&
    typeof repository.isPrivate === 'boolean' &&
    typeof repository.isArchived === 'boolean' &&
    typeof repository.daysSinceLastPush === 'number' &&
    typeof repository.compositeScore === 'number' &&
    typeof repository.ageDays === 'number' &&
    typeof repository.languages === 'object' &&
    repository.languages !== null
  );
}

function isReposProfile(value: unknown): value is ReposProfile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const profile = value as Partial<ReposProfile>;
  return (
    typeof profile.username === 'string' &&
    typeof profile.totalRepositories === 'number' &&
    typeof profile.totalStars === 'number' &&
    typeof profile.totalForks === 'number' &&
    typeof profile.totalCommits === 'number'
  );
}

function getCachedReposData(): ReposData | null {
  const cachedRepos = getFromCache<unknown>(CACHE_KEY, CACHE_TTL.DEV, CACHE_TTL.PROD);
  const cachedProfile = getFromCache<unknown>(PROFILE_CACHE_KEY, CACHE_TTL.DEV, CACHE_TTL.PROD);
  if (!cachedRepos || !cachedProfile) {
    return null;
  }

  if (
    Array.isArray(cachedRepos) &&
    cachedRepos.every(isRepository) &&
    isReposProfile(cachedProfile)
  ) {
    return { repositories: cachedRepos, profile: cachedProfile };
  }

  clearReposCache();
  return null;
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
 * Attempts to retrieve data from cache first. If cache is expired or missing,
 * fetches fresh data from the github-stats-spark data source. On fetch failure,
 * returns empty repositories array with default profile values to prevent UI crashes.
 *
 * @returns {Promise<ReposData>} Promise resolving to normalized repositories and profile data.
 * Returns empty arrays with default profile (username: '', zeros for all counters) if fetch fails.
 * @throws Never throws - all errors are caught and return empty data to maintain UI stability
 */
export async function getRepositories(): Promise<ReposData> {
  const cachedData = getCachedReposData();
  if (cachedData) return cachedData;

  try {
    const data = await fetchReposFromUrl(DATA_URL);
    setInCache(CACHE_KEY, data.repositories);
    setInCache(PROFILE_CACHE_KEY, data.profile);
    return data;
  } catch (error) {
    console.error('Failed to fetch repositories from data source:', error);
    return {
      repositories: [],
      profile: {
        username: '',
        totalRepositories: 0,
        totalStars: 0,
        totalForks: 0,
        totalCommits: 0,
      },
    };
  }
}

/**
 * Clears the cached repositories payload and profile data.
 *
 * Removes both repository array and profile data from browser storage cache.
 * Call this when implementing a manual cache refresh feature or after data
 * source updates that require bypassing stale cached data.
 *
 * @returns {void}
 */
export function clearReposCache(): void {
  clearCache(CACHE_KEY);
  clearCache(PROFILE_CACHE_KEY);
}
