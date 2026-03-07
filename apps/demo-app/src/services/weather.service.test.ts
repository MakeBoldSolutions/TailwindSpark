import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getRecentSearches, getWeatherByCity } from './weather.service';

describe('weather.service', () => {
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

  describe('getWeatherByCity', () => {
    const mockApiResponse = {
      success: true,
      errorMessage: null,
      location: { name: 'London', latitude: 51.5, longitude: -0.12 },
      currentConditions: {
        temperature: 15,
        humidity: 72,
        windSpeed: 8,
        cloudCover: 60,
        conditions: 'Clouds',
        conditionsDescription: 'overcast clouds',
      },
      observationTimeUtc: '2025-01-15T12:00:00Z',
    };

    it('fetches and transforms weather data', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockApiResponse),
      } as Response);

      const result = await getWeatherByCity('London');
      expect(result.city_name).toBe('London');
      expect(result.temperature).toBe(15);
      expect(result.humidity).toBe(72);
      expect(result.coordinates.lat).toBe(51.5);
    });

    it('throws on rate limit', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 429,
      } as Response);

      await expect(getWeatherByCity('London')).rejects.toThrow('rate limit');
    });

    it('throws on API error', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(getWeatherByCity('London')).rejects.toThrow('Weather API error');
    });

    it('throws when API response is not successful', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: false, errorMessage: 'City not found' }),
      } as Response);

      await expect(getWeatherByCity('FakeCity')).rejects.toThrow('City not found');
    });

    it('caches weather data and adds to recent searches', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockApiResponse),
      } as Response);

      await getWeatherByCity('London');
      const recent = getRecentSearches();
      expect(recent).toHaveLength(1);
      expect(recent[0].city_name).toBe('London');
    });
  });

  describe('getRecentSearches', () => {
    it('returns empty array when no searches', () => {
      expect(getRecentSearches()).toEqual([]);
    });
  });
});
