import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Joke } from '../types/joke-api';
import {
    addToJokeHistory,
    deleteSavedJoke,
    getJokeHistory,
    getLikedJokes,
    getRandomJoke,
    getSavedJokes,
    saveJoke,
    toggleLikeJoke,
} from './joke.service';

const mockJoke: Joke = {
  id: 42,
  type: 'single',
  joke: 'Why do programmers prefer dark mode?',
  category: 'Programming',
  safe: true,
  flags: { nsfw: false, religious: false, political: false, racist: false, sexist: false, explicit: false },
};

describe('joke.service', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // Create a working localStorage mock since setup.ts replaces it with vi.fn()
    store = {};
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => store[key] ?? null);
    vi.mocked(localStorage.setItem).mockImplementation((key: string, value: string) => { store[key] = value; });
    vi.mocked(localStorage.removeItem).mockImplementation((key: string) => { delete store[key]; });
    vi.mocked(localStorage.clear).mockImplementation(() => { store = {}; });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getRandomJoke', () => {
    it('fetches and parses a joke from the API', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockJoke),
      } as Response);

      const result = await getRandomJoke();
      expect(result.id).toBe(42);
      expect(result.type).toBe('single');
      if (result.type === 'single') {
        expect(result.joke).toContain('dark mode');
      }
    });

    it('returns fallback joke on API error', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network'));

      const result = await getRandomJoke();
      expect(result).toBeDefined();
      expect(result.category).toBe('Programming');
    });

    it('returns fallback joke when API returns error flag', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ error: true, message: 'Rate limited' }),
      } as Response);

      const result = await getRandomJoke();
      expect(result).toBeDefined();
    });
  });

  describe('saved jokes', () => {
    it('returns empty array when no saved jokes', () => {
      expect(getSavedJokes()).toEqual([]);
    });

    it('saves and retrieves a joke', () => {
      saveJoke(mockJoke);
      const saved = getSavedJokes();
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe(42);
    });

    it('does not duplicate jokes', () => {
      saveJoke(mockJoke);
      saveJoke(mockJoke);
      expect(getSavedJokes()).toHaveLength(1);
    });

    it('deletes a saved joke', () => {
      saveJoke(mockJoke);
      deleteSavedJoke(42);
      expect(getSavedJokes()).toHaveLength(0);
    });
  });

  describe('liked jokes', () => {
    it('returns empty array when no liked jokes', () => {
      expect(getLikedJokes()).toEqual([]);
    });

    it('toggles like on', () => {
      const liked = toggleLikeJoke(42);
      expect(liked).toBe(true);
      expect(getLikedJokes()).toContain(42);
    });

    it('toggles like off', () => {
      toggleLikeJoke(42);
      const liked = toggleLikeJoke(42);
      expect(liked).toBe(false);
      expect(getLikedJokes()).not.toContain(42);
    });
  });

  describe('joke history', () => {
    it('returns empty array when no history', () => {
      expect(getJokeHistory()).toEqual([]);
    });

    it('adds jokes to history', () => {
      addToJokeHistory(mockJoke);
      const history = getJokeHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe(42);
    });

    it('prevents duplicate entries in history', () => {
      addToJokeHistory(mockJoke);
      addToJokeHistory(mockJoke);
      expect(getJokeHistory()).toHaveLength(1);
    });
  });
});
