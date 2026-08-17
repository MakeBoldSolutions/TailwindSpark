import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock cache.service before importing
vi.mock('./cache.service', () => ({
  getFromCache: vi.fn(() => null),
  setInCache: vi.fn(),
  clearCache: vi.fn(),
}));

import { PROJECTS_API_CONFIG } from '../types/projects-api';
import { clearCache, getFromCache, setInCache } from './cache.service';
import { clearProjectsCache, getProjects } from './projects.service';

vi.mock('../types/projects-api', async importOriginal => {
  const actual = await importOriginal<typeof import('../types/projects-api')>();

  return {
    ...actual,
    PROJECTS_API_CONFIG: {
      ...actual.PROJECTS_API_CONFIG,
      PROD_URL: '/data/projects.json',
      DEV_URL: '/api/subsites.json',
      FALLBACK_URL: '/fallback/projects.json',
    },
  };
});

const mockProject = {
  id: 1,
  p: 'Test Project',
  d: 'A test project',
  h: 'https://example.com',
  image: 'https://example.com/img.png',
  slug: 'test-project',
};

const expectedPrimaryUrl = import.meta.env.DEV
  ? PROJECTS_API_CONFIG.DEV_URL
  : PROJECTS_API_CONFIG.PROD_URL;

describe('projects.service', () => {
  it('uses a same-origin production snapshot URL', () => {
    expect(PROJECTS_API_CONFIG.PROD_URL).toBe('/data/projects.json');
    expect(PROJECTS_API_CONFIG.REMOTE_URL).toBe('https://makeboldspark.com/subsites.json');
  });

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns cached data when available', async () => {
    const cached = [
      {
        id: 1,
        name: 'Cached',
        description: 'Cached project',
        image_url: 'https://example.com/img.png',
        project_url: 'https://example.com',
        status: 'Active',
      },
    ];
    vi.mocked(getFromCache).mockReturnValue(cached);

    const result = await getProjects();
    expect(result).toBe(cached);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches from API when cache is empty', async () => {
    vi.mocked(getFromCache).mockReturnValue(null);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockProject]),
    } as Response);

    const result = await getProjects();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Project');
    expect(fetch).toHaveBeenCalledWith(expectedPrimaryUrl, expect.any(Object));
    expect(setInCache).toHaveBeenCalled();
  });

  it('falls back to fallback URL on primary failure', async () => {
    vi.mocked(getFromCache).mockReturnValue(null);
    vi.mocked(global.fetch)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockProject]),
      } as Response);

    const result = await getProjects();
    expect(result).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, expectedPrimaryUrl, expect.any(Object));
    expect(fetch).toHaveBeenNthCalledWith(2, '/fallback/projects.json', expect.any(Object));
  });

  it('returns empty array when both primary and fallback fail', async () => {
    vi.mocked(getFromCache).mockReturnValue(null);
    vi.mocked(global.fetch)
      .mockRejectedValueOnce(new Error('Primary failed'))
      .mockRejectedValueOnce(new Error('Fallback failed'));

    const result = await getProjects();
    expect(result).toEqual([]);
  });

  it('clearProjectsCache delegates to clearCache', () => {
    clearProjectsCache();
    expect(clearCache).toHaveBeenCalled();
  });
});
