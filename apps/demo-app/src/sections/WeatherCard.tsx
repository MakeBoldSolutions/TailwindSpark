import type { WeatherData, WeatherIconCode } from '../types/weather-api';
import { TemperatureUtils, WEATHER_ICONS } from '../types/weather-api';

interface WeatherCardProps {
  data: WeatherData;
}

/**
 * Displays current weather details for a city.
 *
 * @param props - Component props
 * @param props.data - Weather data to present
 * @returns Weather card element
 */
export default function WeatherCard(props: WeatherCardProps) {
  const { data } = props;
  const iconInfo = WEATHER_ICONS[data.weather.icon as WeatherIconCode];
  const emoji = iconInfo?.emoji ?? '🌡️';

  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-text">
            {data.city_name}{data.country_code ? `, ${data.country_code}` : ''}
          </h2>
          <p className="text-sm capitalize text-text-muted">
            {data.weather.description}
          </p>
        </div>
        <span className="text-4xl" role="img" aria-label={data.weather.description}>
          {emoji}
        </span>
      </div>

      <div className="mb-4 text-4xl font-bold text-brand">
        {TemperatureUtils.formatTemperature(data.temperature)}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-text-muted">
        <div>
          <span className="font-medium text-text">Feels like:</span>{' '}
          {TemperatureUtils.formatTemperature(data.feels_like)}
        </div>
        <div>
          <span className="font-medium text-text">Humidity:</span> {data.humidity}%
        </div>
        <div>
          <span className="font-medium text-text">Wind:</span> {Math.round(data.wind_speed)} mph
        </div>
        <div>
          <span className="font-medium text-text">Clouds:</span> {data.clouds}%
        </div>
      </div>
    </div>
  );
}
