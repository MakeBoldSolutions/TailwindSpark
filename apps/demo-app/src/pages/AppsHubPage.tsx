import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../contexts/SEOContext';
import { miniAppsData } from '../types/miniapp';

function AppsHubPage() {
  const { setSEO } = useSEO();

  useEffect(() => {
    setSEO({
      title: 'Apps - TailwindSpark',
      description: 'Discover mini-applications built with React and Tailwind CSS.',
      ogTitle: 'TailwindSpark Apps Hub',
      ogDescription: 'Explore interactive mini-apps: Projects, Articles, Jokes, Weather, and AI Chat.',
    });
  }, [setSEO]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold text-text">Apps</h1>
        <p className="text-lg text-text-muted">
          Explore interactive mini-applications built with React &amp; Tailwind CSS
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {miniAppsData.map(app => (
          <div
            key={app.id}
            className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 text-4xl">{app.icon}</div>
            <h2 className="mb-2 text-xl font-semibold text-text">{app.name}</h2>
            <p className="mb-6 flex-1 text-text-muted">{app.description}</p>
            <Link
              to={app.route}
              className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              aria-label={`Launch ${app.name}`}
            >
              Launch
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppsHubPage;
