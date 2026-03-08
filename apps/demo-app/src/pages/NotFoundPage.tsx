import type { FC } from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the fallback page for unknown routes.
 *
 * @returns Not found page element
 */
const NotFoundPage: FC = (): React.JSX.Element => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 text-6xl" aria-hidden="true">🔍</span>
      <h1 className="mb-2 text-3xl font-bold text-text">Page Not Found</h1>
      <p className="mb-8 text-text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition hover:bg-brand/90"
        >
          Go Home
        </Link>
        <Link
          to="/apps"
          className="rounded-lg border border-border bg-surface px-6 py-2.5 font-medium text-text transition hover:bg-surface-alt"
        >
          Explore Apps
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
