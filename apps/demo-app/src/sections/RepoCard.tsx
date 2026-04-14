import { Eye, GitFork, Star } from 'lucide-react';
import type { Repository } from '../types/repos-api';
import { RepoDetail } from './RepoDetail';

interface RepoCardProps {
  repository: Repository;
  isExpanded: boolean;
  onToggle: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-data-viz-1',
  JavaScript: 'bg-data-viz-7',
  Python: 'bg-data-viz-2',
  'C#': 'bg-data-viz-3',
  PowerShell: 'bg-data-viz-6',
  HTML: 'bg-data-viz-5',
  CSS: 'bg-data-viz-4',
};

/**
 * Displays a repository summary card with optional inline detail expansion.
 *
 * @param props - RepoCard props
 * @param props.repository - Repository data to render
 * @param props.isExpanded - Whether the detail panel is visible
 * @param props.onToggle - Callback to toggle expansion
 * @returns Repository card element
 */
export const RepoCard: React.FC<RepoCardProps> = ({ repository, isExpanded, onToggle }) => {
  const description = repository.description ?? repository.summaryText;
  const langColor = repository.language ? (LANGUAGE_COLORS[repository.language] ?? 'bg-secondary-400') : null;

  return (
    <div
      className={`rounded-panel border border-border bg-[var(--card-bg)] shadow-card transition-shadow hover:shadow-lg ${repository.isArchived ? 'opacity-70' : ''}`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded ? 'true' : 'false'}
        aria-controls={`repo-detail-${repository.name}`}
        onClick={onToggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="cursor-pointer p-4"
      >
        {/* Header row */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            {repository.name}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            {repository.isArchived && (
              <span className="rounded-full bg-secondary-200 px-2 py-0.5 text-xs font-medium text-secondary-700">
                Archived
              </span>
            )}
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
              #{repository.rank}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-text-muted">{description}</p>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
          {repository.language && (
            <span className="flex items-center gap-1">
              <span className={`inline-block h-3 w-3 rounded-full ${langColor}`} />
              {repository.language}
            </span>
          )}
          <span className="flex items-center gap-1" title="Stars">
            <Star className="h-3.5 w-3.5" />
            {repository.stars}
          </span>
          <span className="flex items-center gap-1" title="Forks">
            <GitFork className="h-3.5 w-3.5" />
            {repository.forks}
          </span>
          <span className="flex items-center gap-1" title="Watchers">
            <Eye className="h-3.5 w-3.5" />
            {repository.watchers}
          </span>
          <span className="ml-auto text-xs font-medium text-brand">
            Score: {repository.compositeScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Accordion detail panel */}
      {isExpanded && (
        <div
          id={`repo-detail-${repository.name}`}
          role="region"
          aria-label={`Details for ${repository.name}`}
          className="border-t border-border"
        >
          <RepoDetail repository={repository} />
        </div>
      )}
    </div>
  );
};
