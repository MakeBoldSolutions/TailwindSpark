import { Activity, ExternalLink, GitCommit, Shield, Users } from 'lucide-react';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Repository } from '../types/repos-api';

interface RepoDetailProps {
  repository: Repository;
}

/**
 * Renders the expanded detail panel for a repository card (accordion content).
 *
 * @param props - RepoDetail props
 * @param props.repository - Full repository data to display
 * @returns Detail panel element
 */
export const RepoDetail: React.FC<RepoDetailProps> = ({ repository }) => {
  const languageEntries = useMemo(() => {
    const total = Object.values(repository.languages).reduce((sum, bytes) => sum + bytes, 0);
    return Object.entries(repository.languages)
      .sort(([, a], [, b]) => b - a)
      .map(([lang, bytes]) => ({ lang, pct: total > 0 ? ((bytes / total) * 100).toFixed(1) : '0' }));
  }, [repository.languages]);

  const { commitHistory, attentionMetrics } = repository;

  return (
    <div className="space-y-4 p-4">
      {/* AI Summary */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-text">Summary</h3>
        <div className="prose prose-sm text-text-muted prose-headings:text-text prose-a:text-brand prose-strong:text-text prose-code:text-text">
          <ReactMarkdown>{repository.summaryText}</ReactMarkdown>
        </div>
      </div>

      {/* Commit Activity */}
      <div>
        <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-text">
          <GitCommit className="h-4 w-4" /> Commit Activity
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-surface-alt p-2">
            <div className="text-lg font-bold text-text">{commitHistory.recent_90d}</div>
            <div className="text-text-muted">90 days</div>
          </div>
          <div className="rounded-md bg-surface-alt p-2">
            <div className="text-lg font-bold text-text">{commitHistory.recent_180d}</div>
            <div className="text-text-muted">180 days</div>
          </div>
          <div className="rounded-md bg-surface-alt p-2">
            <div className="text-lg font-bold text-text">{commitHistory.recent_365d}</div>
            <div className="text-text-muted">365 days</div>
          </div>
        </div>
        {commitHistory.patterns.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {commitHistory.patterns.map(pattern => (
              <span key={pattern} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">
                {pattern}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      {languageEntries.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">Languages</h3>
          <div className="flex flex-wrap gap-1">
            {languageEntries.map(({ lang, pct }) => (
              <span key={lang} className="rounded bg-surface-alt px-2 py-0.5 text-xs text-text-muted">
                {lang} {pct}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attention Metrics */}
      <div>
        <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-text">
          <Activity className="h-4 w-4" /> Health
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-md bg-surface-alt p-2 text-center">
            <div className="font-semibold text-text">{attentionMetrics.tier}</div>
            <div className="text-text-muted">Tier</div>
          </div>
          <div className="rounded-md bg-surface-alt p-2 text-center">
            <div className="font-semibold text-text">
              <Shield className="mx-auto h-4 w-4" />
              {attentionMetrics.components.security.overall_state}
            </div>
            <div className="text-text-muted">Security</div>
          </div>
          <div className="rounded-md bg-surface-alt p-2 text-center">
            <div className="font-semibold text-text">{attentionMetrics.components.pull_requests.total_open}</div>
            <div className="text-text-muted">Open PRs</div>
          </div>
          <div className="rounded-md bg-surface-alt p-2 text-center">
            <div className="font-semibold text-text">{attentionMetrics.components.dependencies.outdated_count}</div>
            <div className="text-text-muted">Outdated Deps</div>
          </div>
        </div>
      </div>

      {/* Contributors */}
      {repository.contributorStats.length > 0 && (
        <div>
          <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-text">
            <Users className="h-4 w-4" /> Contributors
          </h3>
          <div className="flex flex-wrap gap-2">
            {repository.contributorStats.map(c => (
              <span key={c.login} className="rounded bg-surface-alt px-2 py-0.5 text-xs text-text-muted">
                {c.login} ({c.commits} commits)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-hover"
        >
          <ExternalLink className="h-3.5 w-3.5" /> GitHub
        </a>
        {repository.homepage && (
          <a
            href={repository.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-alt"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Homepage
          </a>
        )}
        {repository.pagesUrl && (
          <a
            href={repository.pagesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-alt"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Pages
          </a>
        )}
      </div>
    </div>
  );
};
