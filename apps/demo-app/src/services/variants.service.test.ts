import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getVariants } from './variants.service';

describe('variants.service', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    store = {};
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => store[key] ?? null);
    vi.mocked(localStorage.setItem).mockImplementation((key: string, value: string) => { store[key] = value; });
    vi.mocked(localStorage.removeItem).mockImplementation((key: string) => { delete store[key]; });
    vi.mocked(localStorage.clear).mockImplementation(() => { store = {}; });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockVariant = {
    definitionId: 1,
    name: 'Test Variant',
    description: 'A test variant.',
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-15T00:00:00Z',
    urlEncodedName: 'test-variant',
    outputType: 1,
    prompt: 'You are helpful.',
    promptHash: 'abc',
    definitionType: 'Conversational',
    definitionTypes: ['Conversational'],
    role: 1,
    model: 'gpt-4o',
    temperature: '0.7',
    definitionResponses: [],
    conversationId: '00000000-0000-0000-0000-000000000001',
    slug: 'test-variant',
  };

  it('fetches and returns variants from API', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockVariant]),
    } as Response);

    const result = await getVariants();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Variant');
  });

  it('throws on API error', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getVariants()).rejects.toThrow('Variants API error');
  });

  it('returns cached variants on subsequent calls', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockVariant]),
    } as Response);

    await getVariants();
    const result = await getVariants();
    expect(result).toHaveLength(1);
    // Only fetched once due to cache
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
