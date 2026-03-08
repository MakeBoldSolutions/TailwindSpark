import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../../contexts/SEOContext';
import WeatherPage from './WeatherPage';

const mockWeatherData = [
  {
    city_name: 'Dallas',
    country_code: 'US',
    coordinates: { lat: 32.78, lon: -96.8 },
    temperature: 72,
    feels_like: 74,
    humidity: 55,
    wind_speed: 10,
    clouds: 25,
    weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    timestamp: 1700000000,
  },
];

const mockSearchCity = vi.fn();

vi.mock('../../hooks/useWeather', () => ({
  useWeather: () => ({
    weatherResults: mockWeatherData,
    recentSearches: [{ city_name: 'Dallas', timestamp: 1700000000 }],
    loading: false,
    error: null,
    searchCity: mockSearchCity,
  }),
}));

// Mock WeatherMap lazy import
vi.mock('../../sections/WeatherMap', () => ({
  WeatherMap: ({ cityName }: { cityName: string }) => (
    <div role="img" aria-label={`Map showing ${cityName}`} />
  ),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <WeatherPage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('WeatherPage', () => {
  it('renders heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Weather Forecast/i })).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderPage();
    expect(screen.getByLabelText('City name')).toBeInTheDocument();
  });

  it('renders weather cards', () => {
    renderPage();
    expect(screen.getByText('Dallas')).toBeInTheDocument();
  });

  it('renders recent searches', () => {
    renderPage();
    expect(screen.getByText('Recent:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dallas' })).toBeInTheDocument();
  });

  it('searches for a city', async () => {
    const user = userEvent.setup();
    renderPage();
    const input = screen.getByLabelText('City name');
    await user.type(input, 'Chicago');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockSearchCity).toHaveBeenCalledWith('Chicago');
  });

  it('clicks recent search to search again', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Dallas' }));
    expect(mockSearchCity).toHaveBeenCalledWith('Dallas');
  });

  it('renders without critical axe violations', async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
