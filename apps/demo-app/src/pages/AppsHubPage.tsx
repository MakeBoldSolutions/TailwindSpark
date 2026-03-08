import { useEffect, type FC } from 'react';
import { MiniAppCard } from '../components/MiniAppCard';
import { useSEO } from '../contexts/SEOContext';
import { miniAppsData } from '../types/miniapp';

/**
 * Renders the mini-app hub landing page.
 *
 * @returns Apps hub page element
 */
const AppsHubPage: FC = (): React.JSX.Element => {
  const { setSEO } = useSEO();

  useEffect(() => {
    setSEO({
      title: 'Apps - TailwindSpark',
      description: 'Discover mini-applications built with React and Tailwind CSS.',
      ogTitle: 'TailwindSpark Apps Hub',
      ogDescription: 'Explore interactive mini-apps: Projects, Articles, Jokes, Weather, and AI Chat.',
      canonicalUrl: 'https://markhazleton.github.io/TailwindSpark/apps',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'TailwindSpark Apps',
        url: 'https://markhazleton.github.io/TailwindSpark/apps',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
      },
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
          <MiniAppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default AppsHubPage;
