import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useArticles } from './useArticles';

const mockArticles = [
  { id: '1', title: 'Article A', description: 'Desc', link: 'https://example.com', category: 'Tech', pub_date: '2025-01-01', author: 'Author' },
];

vi.mock('../services/rss.service', () => ({
  getArticles: vi.fn(() => Promise.resolve(mockArticles)),
  clearArticlesCache: vi.fn(),
}));

describe('useArticles', () => {
  it('returns articles after loading', async () => {
    const { result } = renderHook(() => useArticles());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.articles).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('provides refreshCache function', async () => {
    const { result } = renderHook(() => useArticles());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(typeof result.current.refreshCache).toBe('function');
  });

  it('handles error state', async () => {
    const { getArticles } = await import('../services/rss.service');
    vi.mocked(getArticles).mockRejectedValueOnce(new Error('Fetch failed'));

    const { result } = renderHook(() => useArticles());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Fetch failed');
  });
});
