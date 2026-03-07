import { useCallback, useEffect, useState } from 'react';
import { getRecentSearches, getWeatherByCity } from '../services/weather.service';
import type { RecentSearch, WeatherData } from '../types/weather-api';
import { WEATHER_API_CONFIG } from '../types/weather-api';

interface UseWeatherReturn {
  weatherResults: WeatherData[];
  recentSearches: RecentSearch[];
  loading: boolean;
  error: string | null;
  searchCity: (city: string) => Promise<void>;
}

/**
 * Loads default weather cards and exposes city search behavior.
 *
 * @returns Weather results, recent searches, and search state
 */
export function useWeather(): UseWeatherReturn {
  const [weatherResults, setWeatherResults] = useState<WeatherData[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    // Load default cities
    WEATHER_API_CONFIG.DEFAULT_CITIES.forEach(city => {
      getWeatherByCity(city)
        .then(data =>
          setWeatherResults(prev =>
            prev.some(w => w.city_name === data.city_name) ? prev : [...prev, data],
          ),
        )
        .catch(() => {});
    });
  }, []);

  const searchCity = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCity(city);
      setWeatherResults(prev => {
        const filtered = prev.filter(w => w.city_name !== data.city_name);
        return [data, ...filtered];
      });
      setRecentSearches(getRecentSearches());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { weatherResults, recentSearches, loading, error, searchCity };
}
