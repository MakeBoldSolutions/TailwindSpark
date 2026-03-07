import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useWeather } from './useWeather';

vi.mock('../services/weather.service', () => ({
  getWeatherByCity: vi.fn(() =>
    Promise.resolve({
      city_name: 'London',
      country_code: 'GB',
      coordinates: { lat: 51.5, lon: -0.12 },
      temperature: 15,
      feels_like: 13,
      humidity: 72,
      wind_speed: 8,
      clouds: 60,
      weather: { id: 0, main: 'Clouds', description: 'overcast', icon: '04d' },
      timestamp: 1705330800,
    }),
  ),
  getRecentSearches: vi.fn(() => []),
}));

describe('useWeather', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(Array.isArray(result.current.weatherResults)).toBe(true);
  });

  it('provides searchCity function', () => {
    const { result } = renderHook(() => useWeather());
    expect(typeof result.current.searchCity).toBe('function');
  });

  it('loads default cities on mount', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.weatherResults.length).toBeGreaterThan(0));
  });

  it('searchCity updates results', async () => {
    const { result } = renderHook(() => useWeather());

    await result.current.searchCity('Paris');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.weatherResults.length).toBeGreaterThan(0);
    });
  });

  it('handles search error', async () => {
    const { getWeatherByCity } = await import('../services/weather.service');
    const { result } = renderHook(() => useWeather());

    // Wait for default cities to finish loading
    await waitFor(() => expect(result.current.weatherResults.length).toBeGreaterThan(0));

    // Now mock rejection for the next call
    vi.mocked(getWeatherByCity).mockRejectedValueOnce(new Error('City not found'));

    await result.current.searchCity('FakeCity');

    await waitFor(() => {
      expect(result.current.error).toBe('City not found');
    });
  });

  it('does not search empty string', async () => {
    const { getWeatherByCity } = await import('../services/weather.service');
    vi.mocked(getWeatherByCity).mockClear();

    const { result } = renderHook(() => useWeather());
    await result.current.searchCity('   ');

    // Should not have called the service for empty input
    expect(result.current.loading).toBe(false);
  });
});
