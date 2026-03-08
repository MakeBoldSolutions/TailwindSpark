import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./cache.service', () => ({
  getFromCache: vi.fn(() => null),
  setInCache: vi.fn(),
  clearCache: vi.fn(),
}));

import { clearCache, getFromCache, setInCache } from './cache.service';
import { clearArticlesCache, getArticles } from './rss.service';

const mockRawArticle = {
  id: 1,
  name: 'Test Article',
  description: 'Article description',
  slug: 'test-article',
  Section: 'Technology',
  publishedDate: '2025-01-15',
  author: 'Author',
};

describe('rss.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns cached data when available', async () => {
    const cached = [{ id: '1', title: 'Cached' }];
    vi.mocked(getFromCache).mockReturnValue(cached);

    const result = await getArticles();
    expect(result).toBe(cached);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches and maps articles from API', async () => {
    vi.mocked(getFromCache).mockReturnValue(null);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockRawArticle]),
    } as Response);

    const result = await getArticles();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Article');
    expect(setInCache).toHaveBeenCalled();
  });

  it('falls back on primary failure', async () => {
    vi.mocked(getFromCache).mockReturnValue(null);
    vi.mocked(global.fetch)
      .mockRejectedValueOnce(new Error('err'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockRawArticle]),
      } as Response);

    const result = await getArticles();
    expect(result).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('returns empty array when both fail', async () => {
    vi.mocked(getFromCache).mockReturnValue(null);
    vi.mocked(global.fetch)
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'));

    const result = await getArticles();
    expect(result).toEqual([]);
  });

  it('clearArticlesCache delegates to clearCache', () => {
    clearArticlesCache();
    expect(clearCache).toHaveBeenCalled();
  });
});
