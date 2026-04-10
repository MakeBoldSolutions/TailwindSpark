import { GitFork, Star, GitCommit, FolderGit2 } from 'lucide-react';
import { useMemo } from 'react';
import type { ReposProfile, Repository } from '../types/repos-api';

interface RepoSummaryProps {
  repositories: Repository[];
  profile: ReposProfile | null;
}

/**
 * Displays aggregate portfolio statistics across all repositories.
 *
 * @param props - Summary props
 * @param props.repositories - Full (unfiltered) repository array for totals
 * @param props.profile - Profile data from the data source
 * @returns Summary stats element
 */
export const RepoSummary: React.FC<RepoSummaryProps> = ({ repositories, profile }) => {
  const stats = useMemo(() => {
    const totalRepos = repositories.filter(r => !r.isPrivate).length;
    const totalCommits = repositories.reduce((sum, r) => sum + r.totalCommits, 0);
    const totalStars = repositories.reduce((sum, r) => sum + r.stars, 0);
    const totalForks = repositories.reduce((sum, r) => sum + r.forks, 0);

    // Language distribution (top 8)
    const langCounts = new Map<string, number>();
    for (const repo of repositories) {
      if (repo.language) {
        langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
      }
    }
    const topLanguages = [...langCounts.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    const activeCount = repositories.filter(r => !r.isArchived && !r.isPrivate && r.daysSinceLastPush < 90).length;
    const staleCount = repositories.filter(r => !r.isArchived && !r.isPrivate && r.daysSinceLastPush >= 90).length;
    const archivedCount = repositories.filter(r => r.isArchived).length;

    return { totalRepos, totalCommits, totalStars, totalForks, topLanguages, activeCount, staleCount, archivedCount };
  }, [repositories]);

  // Use profile data if available, otherwise fall back to computed
  const displayCommits = profile?.totalCommits ?? stats.totalCommits;
  const displayStars = profile?.totalStars ?? stats.totalStars;
  const displayForks = profile?.totalForks ?? stats.totalForks;

  return (
    <div className="mb-6 space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-4 text-center">
          <FolderGit2 className="mx-auto mb-1 h-5 w-5 text-brand" />
          <div className="text-2xl font-bold text-text">{stats.totalRepos}</div>
          <div className="text-xs text-text-muted">Repositories</div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 text-center">
          <GitCommit className="mx-auto mb-1 h-5 w-5 text-brand" />
          <div className="text-2xl font-bold text-text">{displayCommits.toLocaleString()}</div>
          <div className="text-xs text-text-muted">Total Commits</div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 text-center">
          <Star className="mx-auto mb-1 h-5 w-5 text-brand" />
          <div className="text-2xl font-bold text-text">{displayStars}</div>
          <div className="text-xs text-text-muted">Total Stars</div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 text-center">
          <GitFork className="mx-auto mb-1 h-5 w-5 text-brand" />
          <div className="text-2xl font-bold text-text">{displayForks}</div>
          <div className="text-xs text-text-muted">Total Forks</div>
        </div>
      </div>

      {/* Language distribution + activity status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {stats.topLanguages.map(([lang, count]) => (
            <span key={lang} className="rounded-full bg-surface-alt px-2 py-0.5 text-xs text-text-muted">
              {lang} ({count})
            </span>
          ))}
        </div>
        <div className="flex gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" /> {stats.activeCount} active
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-warning" /> {stats.staleCount} stale
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-secondary-400" /> {stats.archivedCount} archived
          </span>
        </div>
      </div>
    </div>
  );
};
