import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { WeatherData } from '../types/weather-api';
import WeatherCard from './WeatherCard';

const mockWeather: WeatherData = {
  city_name: 'Dallas',
  country_code: 'US',
  coordinates: { lat: 32.78, lon: -96.8 },
  temperature: 72,
  feels_like: 74,
  humidity: 55,
  wind_speed: 10.4,
  clouds: 25,
  weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
  timestamp: 1700000000,
};

describe('WeatherCard', () => {
  it('renders city name and country', () => {
    render(<WeatherCard data={mockWeather} />);
    expect(screen.getByText('Dallas, US')).toBeInTheDocument();
  });

  it('renders weather description', () => {
    render(<WeatherCard data={mockWeather} />);
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  it('renders weather emoji with aria-label', () => {
    render(<WeatherCard data={mockWeather} />);
    const emoji = screen.getByRole('img', { name: 'clear sky' });
    expect(emoji).toHaveTextContent('☀️');
  });

  it('renders humidity', () => {
    render(<WeatherCard data={mockWeather} />);
    expect(screen.getByText('55%')).toBeInTheDocument();
  });

  it('renders wind speed rounded', () => {
    render(<WeatherCard data={mockWeather} />);
    expect(screen.getByText('10 mph')).toBeInTheDocument();
  });

  it('renders cloud coverage', () => {
    render(<WeatherCard data={mockWeather} />);
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});
