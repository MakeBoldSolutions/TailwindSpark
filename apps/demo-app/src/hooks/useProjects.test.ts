import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useProjects } from './useProjects';

const mockProjects = [
  { id: 1, name: 'Project A', description: 'Desc A', image_url: '', project_url: '', status: 'Active' as const, technologies: [] },
  { id: 2, name: 'Project B', description: 'Desc B', image_url: '', project_url: '', status: 'Completed' as const, technologies: [] },
];

vi.mock('../services/projects.service', () => ({
  getProjects: vi.fn(() => Promise.resolve(mockProjects)),
  clearProjectsCache: vi.fn(),
}));

describe('useProjects', () => {
  it('returns projects after loading', async () => {
    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.projects).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('provides refreshCache function', async () => {
    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(typeof result.current.refreshCache).toBe('function');
  });

  it('handles error state', async () => {
    const { getProjects } = await import('../services/projects.service');
    vi.mocked(getProjects).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network error');
    expect(result.current.projects).toEqual([]);
  });
});
