import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useJokes } from './useJokes';

const mockJoke = {
  id: 42,
  type: 'single' as const,
  joke: 'Why do programmers prefer dark mode?',
  category: 'Programming',
  safe: true,
  flags: { nsfw: false, religious: false, political: false, racist: false, sexist: false, explicit: false },
};

vi.mock('../services/joke.service', () => ({
  getRandomJoke: vi.fn(() => Promise.resolve(mockJoke)),
  getSavedJokes: vi.fn(() => []),
  getLikedJokes: vi.fn(() => []),
  getJokeHistory: vi.fn(() => []),
  saveJoke: vi.fn(),
  deleteSavedJoke: vi.fn(),
  toggleLikeJoke: vi.fn(),
  addToJokeHistory: vi.fn(),
}));

describe('useJokes', () => {
  it('fetches a joke on mount', async () => {
    const { result } = renderHook(() => useJokes());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.currentJoke).toEqual(mockJoke);
    expect(result.current.error).toBeNull();
  });

  it('provides saved jokes list', async () => {
    const { result } = renderHook(() => useJokes());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.savedJokes).toEqual([]);
  });

  it('provides liked joke ids', async () => {
    const { result } = renderHook(() => useJokes());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.likedJokeIds).toEqual([]);
  });

  it('provides handler functions', async () => {
    const { result } = renderHook(() => useJokes());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(typeof result.current.fetchNewJoke).toBe('function');
    expect(typeof result.current.handleSave).toBe('function');
    expect(typeof result.current.handleDelete).toBe('function');
    expect(typeof result.current.handleLike).toBe('function');
  });

  it('handleSave calls saveJoke service', async () => {
    const { saveJoke } = await import('../services/joke.service');
    const { result } = renderHook(() => useJokes());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.handleSave(mockJoke));
    expect(saveJoke).toHaveBeenCalledWith(mockJoke);
  });

  it('handleDelete calls deleteSavedJoke service', async () => {
    const { deleteSavedJoke } = await import('../services/joke.service');
    const { result } = renderHook(() => useJokes());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.handleDelete(42));
    expect(deleteSavedJoke).toHaveBeenCalledWith(42);
  });
});
