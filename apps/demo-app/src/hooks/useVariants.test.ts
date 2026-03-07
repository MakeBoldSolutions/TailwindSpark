import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useVariants } from './useVariants';

const mockVariants = [
  {
    definitionId: 1,
    name: 'Alpha',
    description: 'First variant',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-15T00:00:00Z',
    urlEncodedName: 'alpha',
    outputType: 1,
    prompt: 'You are Alpha.',
    promptHash: 'a1',
    definitionType: 'Conversational',
    definitionTypes: ['Conversational'],
    role: 1,
    model: 'gpt-4o',
    temperature: '0.7',
    definitionResponses: [],
    conversationId: '00000000-0000-0000-0000-000000000001',
    slug: 'alpha',
  },
  {
    definitionId: 2,
    name: 'Beta',
    description: 'Second variant',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-10T00:00:00Z',
    urlEncodedName: 'beta',
    outputType: 1,
    prompt: 'You are Beta.',
    promptHash: 'b2',
    definitionType: 'Creative',
    definitionTypes: ['Creative'],
    role: 1,
    model: 'gpt-3.5-turbo',
    temperature: '0.9',
    definitionResponses: [],
    conversationId: '00000000-0000-0000-0000-000000000002',
    slug: 'beta',
  },
];

vi.mock('../services/variants.service', () => ({
  getVariants: vi.fn(() => Promise.resolve(mockVariants)),
}));

describe('useVariants', () => {
  it('returns variants after loading', async () => {
    const { result } = renderHook(() => useVariants());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.variants).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('extracts categories', async () => {
    const { result } = renderHook(() => useVariants());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categories).toContain('Conversational');
    expect(result.current.categories).toContain('Creative');
  });

  it('filters by category', async () => {
    const { result } = renderHook(() => useVariants());
    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.filterByCategory('Creative');
    await waitFor(() => {
      expect(result.current.filteredVariants).toHaveLength(1);
      expect(result.current.filteredVariants[0].name).toBe('Beta');
    });
  });

  it('searches variants by name', async () => {
    const { result } = renderHook(() => useVariants());
    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.searchVariants('alpha');
    await waitFor(() => {
      expect(result.current.filteredVariants).toHaveLength(1);
      expect(result.current.filteredVariants[0].name).toBe('Alpha');
    });
  });

  it('handles error state', async () => {
    const { getVariants } = await import('../services/variants.service');
    vi.mocked(getVariants).mockRejectedValueOnce(new Error('API down'));

    const { result } = renderHook(() => useVariants());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('API down');
  });
});
