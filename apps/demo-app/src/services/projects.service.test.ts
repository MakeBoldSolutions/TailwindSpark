import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock cache.service before importing
vi.mock('./cache.service', () => ({
  getFromCache: vi.fn(() => null),
  setInCache: vi.fn(),
  clearCache: vi.fn(),
}));

import { clearCache, getFromCache, setInCache } from './cache.service';
import { clearProjectsCache, getProjects } from './projects.service';

const mockProject = {
  id: 1,
  p: 'Test Project',
  d: 'A test project',
  h: 'https://example.com',
  image: 'https://example.com/img.png',
  slug: 'test-project',
};

describe('projects.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns cached data when available', async () => {
    const cached = [{ id: 1, name: 'Cached' }];
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
