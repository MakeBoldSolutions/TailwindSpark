import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

interface WeatherMapProps {
  lat: number;
  lon: number;
  cityName: string;
}

/**
 * Renders a Leaflet map centered on the requested city.
 *
 * @param props - Component props
 * @param props.lat - City latitude
 * @param props.lon - City longitude
 * @param props.cityName - City label for the map marker
 * @returns Weather map element
 */
export const WeatherMap: React.FC<WeatherMapProps> = (props) => {
  const { lat, lon, cityName } = props;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // If map already created, update view
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 10);
      // Clear old markers and add new one
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });
      L.marker([lat, lon]).addTo(mapInstanceRef.current).bindPopup(cityName).openPopup();
      return;
    }

    // Create new map
    const map = L.map(mapRef.current).setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup(cityName).openPopup();
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lon, cityName]);

  return (
    <div
      ref={mapRef}
      className="h-64 w-full rounded-lg border border-border"
      role="img"
      aria-label={`Map showing ${cityName}`}
    />
  );
};
