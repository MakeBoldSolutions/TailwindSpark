import { useEffect, type FC } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useRepos } from '../../hooks/useRepos';
import { RepoCard } from '../../sections/RepoCard';
import { RepoFilters } from '../../sections/RepoFilters';
import { RepoSummary } from '../../sections/RepoSummary';
import { sanitizeInput } from '../../utils/sanitize';

/**
 * Renders the GitHub Repositories Explorer mini-app.
 *
 * @returns Repositories explorer page
 */
const ReposPage: FC = (): React.JSX.Element => {
  const { setSEO } = useSEO();
  const {
    repositories,
    filteredRepositories,
    profile,
    loading,
    error,
    refreshCache,
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    availableLanguages,
    expandedRepo,
    setExpandedRepo,
  } = useRepos();

  useEffect(() => {
    setSEO({
      title: 'Repositories - TailwindSpark',
      description: 'Explore Mark Hazleton GitHub repositories with search, filtering, and detailed analytics.',
    });
  }, [setSEO]);

  // Reset expanded card when filters change
  useEffect(() => {
    setExpandedRepo(null);
  }, [searchQuery, languageFilter, statusFilter, sortBy, setExpandedRepo]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-text-muted">Loading repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <button
            onClick={refreshCache}
            className="rounded-md bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand-hover"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-text">GitHub Repositories</h1>
        <button
          onClick={refreshCache}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:bg-surface-alt"
        >
          Refresh Cache
        </button>
      </div>

      {/* Portfolio Summary */}
      <RepoSummary repositories={repositories} profile={profile} />

      {/* Filters */}
      <RepoFilters
        searchQuery={searchQuery}
        onSearchChange={(v: string) => setSearchQuery(sanitizeInput(v))}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        availableLanguages={availableLanguages}
        resultCount={filteredRepositories.length}
      />

      {/* Results */}
      {filteredRepositories.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-text-muted">
            No repositories found{searchQuery ? ` matching "${searchQuery}"` : ''}.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLanguageFilter(null);
              setStatusFilter('all');
            }}
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:bg-surface-alt"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepositories.map(repo => (
            <RepoCard
              key={repo.name}
              repository={repo}
              isExpanded={expandedRepo === repo.name}
              onToggle={() => setExpandedRepo(expandedRepo === repo.name ? null : repo.name)}
            />
          ))}
        </div>
      )}

      {/* Result count */}
      <p className="mt-4 text-center text-sm text-text-muted">
        Showing {filteredRepositories.length} of {repositories.length} repositor{repositories.length !== 1 ? 'ies' : 'y'}
      </p>
    </div>
  );
};

export default ReposPage;
