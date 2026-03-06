import { Link } from 'react-router-dom';
import type { MiniApp } from '../types/miniapp';

interface MiniAppCardProps {
  app: MiniApp;
}

export const MiniAppCard: React.FC<MiniAppCardProps> = ({ app }) => {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
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
  );
};
