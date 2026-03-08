import type { RecentSearch, WeatherData, WebSparkWeatherResponse } from '../types/weather-api';
import { WEATHER_API_CONFIG, WeatherDataSchema } from '../types/weather-api';
import { getPublicJsonFetchOptions } from './fetchOptions';

/**
 * Maps a weather description to an OpenWeather-style icon code.
 *
 * @param conditions - Weather description returned by the API
 * @returns Weather icon code compatible with the shared icon map
 */
function conditionsToIconCode(conditions: string): string {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;
  const suffix = isDay ? 'd' : 'n';
  const lower = conditions.toLowerCase();

  if (lower.includes('thunderstorm')) return `11${suffix}`;
  if (lower.includes('drizzle') || lower.includes('shower')) return `09${suffix}`;
  if (lower.includes('rain')) return `10${suffix}`;
  if (lower.includes('snow')) return `13${suffix}`;
  if (lower.includes('mist') || lower.includes('fog') || lower.includes('haze')) return `50${suffix}`;
  if (lower.includes('clear')) return `01${suffix}`;
  if (lower.includes('few cloud')) return `02${suffix}`;
  if (lower.includes('scattered')) return `03${suffix}`;
  if (lower.includes('cloud') || lower.includes('overcast')) return `04${suffix}`;
  return `01${suffix}`;
}

function transformResponse(raw: WebSparkWeatherResponse): WeatherData {
  const c = raw.currentConditions;
  return {
    city_name: raw.location.name,
    country_code: '',
    coordinates: { lat: raw.location.latitude, lon: raw.location.longitude },
    temperature: c.temperature,
    feels_like: c.temperature,
    humidity: c.humidity,
    wind_speed: c.windSpeed,
    clouds: c.cloudCover,
    weather: {
      id: 0,
      main: c.conditions,
      description: c.conditionsDescription,
      icon: conditionsToIconCode(c.conditionsDescription),
    },
    timestamp: Math.floor(new Date(raw.observationTimeUtc).getTime() / 1000),
  };
}

function getCacheKey(city: string): string {
  return `${WEATHER_API_CONFIG.CACHE_KEY_PREFIX}${city.toLowerCase().trim()}`;
}

function getCachedWeather(city: string): WeatherData | null {
  try {
    const raw = localStorage.getItem(getCacheKey(city));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    const ttl = import.meta.env.DEV
      ? WEATHER_API_CONFIG.CACHE_TTL.DEV
      : WEATHER_API_CONFIG.CACHE_TTL.PROD;
    if (Date.now() - ts > ttl) return null;
    return WeatherDataSchema.parse(data);
  } catch {
    return null;
  }
}

function setCachedWeather(city: string, data: WeatherData): void {
  try {
    localStorage.setItem(getCacheKey(city), JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // quota exceeded – silently ignore
  }
}

/**
 * Returns current weather for a city and stores the result in cache.
 *
 * @param city - City name to query
 * @returns Normalized weather data for the requested city
 */
export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const cached = getCachedWeather(city);
  if (cached) return cached;

  const params = new URLSearchParams({
    location: city.trim(),
  });

  const res = await fetch(
    `${WEATHER_API_CONFIG.BASE_URL}${WEATHER_API_CONFIG.CURRENT_ENDPOINT}?${params}`,
    getPublicJsonFetchOptions(),
  );

  if (res.status === 429) throw new Error('API rate limit exceeded. Please try again in a few minutes.');
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const json: WebSparkWeatherResponse = await res.json();
  if (!json.success) {
    throw new Error(json.errorMessage || 'City not found. Please check the spelling and try again.');
  }

  const data = transformResponse(json);
  WeatherDataSchema.parse(data);
  setCachedWeather(city, data);
  addRecentSearch(city);
  return data;
}

/**
 * Returns the recent weather search history.
 *
 * @returns Recent city searches
 */
export function getRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(WEATHER_API_CONFIG.RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(city: string): void {
  const searches = getRecentSearches().filter(
    s => s.city_name.toLowerCase() !== city.toLowerCase(),
  );
  searches.unshift({ city_name: city.trim(), timestamp: Date.now() });
  if (searches.length > WEATHER_API_CONFIG.MAX_RECENT_SEARCHES) searches.pop();
  localStorage.setItem(WEATHER_API_CONFIG.RECENT_SEARCHES_KEY, JSON.stringify(searches));
}
