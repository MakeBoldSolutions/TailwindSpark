import { useEffect, useState, type FormEvent } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useWeather } from '../../hooks/useWeather';
import WeatherCard from '../../sections/WeatherCard';

function WeatherPage() {
  const { setSEO } = useSEO();
  const { weatherResults, recentSearches, loading, error, searchCity } = useWeather();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setSEO({
      title: 'Weather Forecast - TailwindSpark',
      description: 'Search weather by city with interactive maps and recent searches.',
    });
  }, [setSEO]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCity(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-text">Weather Forecast</h1>
        <p className="text-text-muted">
          Search weather by city — powered by WebSpark
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="mx-auto mb-8 flex max-w-md gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter city name..."
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          aria-label="City name"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-lg bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand/90 disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="mx-auto mb-8 flex max-w-md flex-wrap items-center gap-2">
          <span className="text-sm text-text-muted">Recent:</span>
          {recentSearches.map(s => (
            <button
              key={s.city_name}
              onClick={() => searchCity(s.city_name)}
              className="rounded-full bg-surface-alt px-3 py-1 text-sm text-text-muted transition hover:bg-brand/10 hover:text-brand"
            >
              {s.city_name}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {weatherResults.length === 0 && !loading ? (
        <p className="py-12 text-center text-text-muted">
          {error ? 'No results. Try another city.' : 'Loading default cities...'}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {weatherResults.map(w => (
            <WeatherCard key={w.city_name} data={w} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherPage;
