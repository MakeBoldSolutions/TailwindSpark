/**
 * Weather API Contract
 * 
 * TypeScript types and Zod schemas for WebSpark Weather API
 * Source: webspark.markhazleton.com OpenWeatherApi endpoint
 */

import { z } from 'zod';

/**
 * Geographic Coordinates
 */
export interface Coordinates {
  /** Latitude (-90 to 90) */
  lat: number;
  
  /** Longitude (-180 to 180) */
  lon: number;
}

/**
 * Weather Condition
 * Describes current weather condition with icon
 */
export interface WeatherCondition {
  /** Weather condition ID */
  id: number;
  
  /** Main weather category (e.g., "Clear", "Rain", "Clouds") */
  main: string;
  
  /** Detailed weather description (e.g., "light rain", "clear sky") */
  description: string;
  
  /** Weather icon code (e.g., "10d", "01n") */
  icon: string;
}

/**
 * Weather Data Entity
 * Complete current weather information for a location
 */
export interface WeatherData {
  /** City name */
  city_name: string;
  
  /** ISO 3166 country code (e.g., "US", "GB") */
  country_code: string;
  
  /** Geographic coordinates */
  coordinates: Coordinates;
  
  /** Temperature in Fahrenheit */
  temperature: number;
  
  /** "Feels like" temperature in Fahrenheit */
  feels_like: number;
  
  /** Humidity percentage (0-100) */
  humidity: number;
  
  /** Wind speed in mph */
  wind_speed: number;
  
  /** Cloud coverage percentage (0-100) */
  clouds: number;
  
  /** Weather condition details */
  weather: WeatherCondition;
  
  /** Data timestamp (Unix timestamp) */
  timestamp: number;
}

/**
 * Zod Schema for Coordinates
 */
const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

/**
 * Zod Schema for Weather Condition
 */
const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

/**
 * Zod Schema for Weather Data
 */
export const WeatherDataSchema = z.object({
  city_name: z.string().min(1),
  country_code: z.string(),
  coordinates: CoordinatesSchema,
  temperature: z.number(),
  feels_like: z.number(),
  humidity: z.number().min(0).max(100),
  wind_speed: z.number().nonnegative(),
  clouds: z.number().min(0).max(100),
  weather: WeatherConditionSchema,
  timestamp: z.number().int().nonnegative(),
});

/**
 * Type inference from Zod schema
 */
export type WeatherDataSchemaType = z.infer<typeof WeatherDataSchema>;

/**
 * WebSpark Weather API Raw Response
 * Structure returned by webspark.markhazleton.com OpenWeatherApi endpoint
 */
export interface WebSparkWeatherResponse {
  observationAge: string;
  currentConditions: {
    cloudCover: number;
    conditions: string;
    conditionsDescription: string;
    humidity: number;
    pressure: number;
    rainfallOneHour: number;
    temperature: number;
    visibility: number;
    windDirection: {
      abbreviation: string;
      name: string;
      middleAzimuth: number;
      minimumAzimuth: number;
      maximumAzimuth: number;
      precedence: number;
    };
    windDirectionDegrees: number;
    windSpeed: number;
  };
  errorMessage: string;
  fetchTime: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  observationTime: string;
  observationTimeUtc: string;
  success: boolean;
}

/**
 * API Response Wrapper
 */
export interface WeatherAPIResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

/**
 * Weather API Configuration
 */
export const WEATHER_API_CONFIG = {
  /** WebSpark Weather API base URL */
  BASE_URL: 'https://webspark.markhazleton.com/api/AsyncSpark/OpenWeatherApi',
  
  /** Current weather endpoint */
  CURRENT_ENDPOINT: '/weather',
  
  /** Cache key prefix for localStorage */
  CACHE_KEY_PREFIX: 'weather_',
  
  /** Cache TTL in milliseconds */
  CACHE_TTL: {
    DEV: 5 * 60 * 1000,    // 5 minutes in dev
    PROD: 60 * 60 * 1000,  // 1 hour in prod
  },
  
  /** Default cities to display on page load */
  DEFAULT_CITIES: ['Dallas', 'Wichita'],
  
  /** Maximum recent searches to store */
  MAX_RECENT_SEARCHES: 5,
  
  /** Recent searches localStorage key */
  RECENT_SEARCHES_KEY: 'weather_recent_searches',
} as const;

/**
 * Weather Icons Mapping
 * Map OpenWeatherMap icon codes to readable descriptions
 */
export const WEATHER_ICONS = {
  '01d': { name: 'Clear Sky', emoji: '☀️' },
  '01n': { name: 'Clear Sky', emoji: '🌙' },
  '02d': { name: 'Few Clouds', emoji: '🌤️' },
  '02n': { name: 'Few Clouds', emoji: '☁️' },
  '03d': { name: 'Scattered Clouds', emoji: '☁️' },
  '03n': { name: 'Scattered Clouds', emoji: '☁️' },
  '04d': { name: 'Broken Clouds', emoji: '☁️' },
  '04n': { name: 'Broken Clouds', emoji: '☁️' },
  '09d': { name: 'Shower Rain', emoji: '🌧️' },
  '09n': { name: 'Shower Rain', emoji: '🌧️' },
  '10d': { name: 'Rain', emoji: '🌦️' },
  '10n': { name: 'Rain', emoji: '🌧️' },
  '11d': { name: 'Thunderstorm', emoji: '⛈️' },
  '11n': { name: 'Thunderstorm', emoji: '⛈️' },
  '13d': { name: 'Snow', emoji: '❄️' },
  '13n': { name: 'Snow', emoji: '❄️' },
  '50d': { name: 'Mist', emoji: '🌫️' },
  '50n': { name: 'Mist', emoji: '🌫️' },
} as const;

/**
 * Weather icon codes supported by the shared weather icon map.
 */
export type WeatherIconCode = keyof typeof WEATHER_ICONS;

/**
 * Weather API Error Codes
 */
export const WEATHER_API_ERRORS = {
  CITY_NOT_FOUND: {
    code: 404,
    message: 'City not found. Please check the spelling and try again.',
  },
  RATE_LIMIT: {
    code: 429,
    message: 'API rate limit exceeded. Please try again in a few minutes.',
  },
  API_KEY_INVALID: {
    code: 401,
    message: 'Invalid API key. Please contact support.',
  },
  NETWORK_ERROR: {
    code: -1,
    message: 'Network error. Please check your internet connection.',
  },
} as const;

/**
 * Recent Search Item
 */
export interface RecentSearch {
  city_name: string;
  timestamp: number;
}

/**
 * Temperature conversion helpers for the weather UI.
 */
export const TemperatureUtils = {
  /**
   * Converts Fahrenheit to Celsius.
   *
   * @param fahrenheit - Temperature in Fahrenheit
   * @returns Temperature in Celsius
   */
  fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * (5 / 9);
  },
  
  /**
   * Converts Celsius to Fahrenheit.
   *
   * @param celsius - Temperature in Celsius
   * @returns Temperature in Fahrenheit
   */
  celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  },
  
  /**
   * Formats a temperature for display.
   *
   * @param temp - Temperature value to format
   * @param unit - Temperature unit label
   * @returns Formatted temperature string
   */
  formatTemperature(temp: number, unit: 'F' | 'C' = 'F'): string {
    return `${Math.round(temp)}°${unit}`;
  },
};

/**
 * Wind Speed Conversion Helpers
 */
export const WindUtils = {  
  /**
   * Converts miles per hour to kilometers per hour.
   *
   * @param mph - Wind speed in miles per hour
   * @returns Wind speed in kilometers per hour
   */
  mphToKmh(mph: number): number {
    return mph * 1.60934;
  },
  
  /**
   * Converts meters per second to miles per hour.
   *
   * @param ms - Wind speed in meters per second
   * @returns Wind speed in miles per hour
   */
  msToMph(ms: number): number {
    return ms * 2.23694;
  },
  
  /**
   * Converts wind direction degrees to a cardinal label.
   *
   * @param degrees - Wind direction in degrees
   * @returns Cardinal direction label
   */
  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  },
};

/**
 * Leaflet Map Configuration
 */
export const WEATHER_MAP_CONFIG = {
  /** Default zoom level */
  DEFAULT_ZOOM: 10,
  
  /** Tile layer URL (OpenStreetMap) */
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  
  /** Tile attribution */
  TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  
  /** Map container style */
  CONTAINER_STYLE: {
    height: '400px',
    width: '100%',
    borderRadius: '0.5rem',
  },
} as const;
