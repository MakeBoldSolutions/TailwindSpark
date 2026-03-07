import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock leaflet before importing component
vi.mock('leaflet', () => {
  const mockMarker = {
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    openPopup: vi.fn().mockReturnThis(),
  };
  const mockTileLayer = { addTo: vi.fn().mockReturnThis() };
  const mockMap = {
    setView: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    eachLayer: vi.fn(),
  };
  return {
    default: {
      map: vi.fn(() => mockMap),
      tileLayer: vi.fn(() => mockTileLayer),
      marker: vi.fn(() => mockMarker),
      Marker: class {},
    },
  };
});

vi.mock('leaflet/dist/leaflet.css', () => ({}));

import { WeatherMap } from './WeatherMap';

describe('WeatherMap', () => {
  it('renders a div with role img', () => {
    render(<WeatherMap lat={32.78} lon={-96.8} cityName="Dallas" />);
    expect(screen.getByRole('img', { name: 'Map showing Dallas' })).toBeInTheDocument();
  });

  it('renders with correct aria-label', () => {
    render(<WeatherMap lat={51.5} lon={-0.12} cityName="London" />);
    expect(screen.getByRole('img', { name: 'Map showing London' })).toBeInTheDocument();
  });
});
