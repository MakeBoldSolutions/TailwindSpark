import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearReposCache, getRepositories } from '../services/repos.service';
import type { RepoSortDirection, RepoSortField, RepoStatusFilter, ReposProfile, Repository } from '../types/repos-api';

interface UseReposReturn {
  repositories: Repository[];
  filteredRepositories: Repository[];
  profile: ReposProfile | null;
  loading: boolean;
  error: string | null;
  refreshCache: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  languageFilter: string | null;
  setLanguageFilter: (language: string | null) => void;
  statusFilter: RepoStatusFilter;
  setStatusFilter: (status: RepoStatusFilter) => void;
  sortBy: RepoSortField;
  setSortBy: (field: RepoSortField) => void;
  sortDirection: RepoSortDirection;
  setSortDirection: (dir: RepoSortDirection) => void;
  availableLanguages: string[];
  expandedRepo: string | null;
  setExpandedRepo: (name: string | null) => void;
}

/**
 * Loads repository data and provides filtering, sorting, and expansion state.
 *
 * @returns Repository data, filter controls, and loading state
 */
export function useRepos(): UseReposReturn {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [profile, setProfile] = useState<ReposProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter/sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<RepoStatusFilter>('all');
  const [sortBy, setSortBy] = useState<RepoSortField>('composite_score');
  const [sortDirection, setSortDirection] = useState<RepoSortDirection>('desc');
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRepositories();
      setRepositories(data.repositories);
      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load repositories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshCache = useCallback(async () => {
    clearReposCache();
    await fetchData();
  }, [fetchData]);

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    for (const repo of repositories) {
      if (repo.language) langs.add(repo.language);
    }
    return [...langs].sort();
  }, [repositories]);

  const filteredRepositories = useMemo(() => {
    let result = repositories.filter(r => !r.isPrivate);

    // Text search
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.name.toLowerCase().includes(term) ||
          (r.description?.toLowerCase().includes(term) ?? false) ||
          r.summaryText.toLowerCase().includes(term),
      );
    }

    // Language filter
    if (languageFilter) {
      result = result.filter(r => r.language === languageFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => {
        if (statusFilter === 'archived') return r.isArchived;
        if (statusFilter === 'active') return !r.isArchived && r.daysSinceLastPush < 90;
        if (statusFilter === 'stale') return !r.isArchived && r.daysSinceLastPush >= 90;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'composite_score':
          cmp = a.compositeScore - b.compositeScore;
          break;
        case 'stars':
          cmp = a.stars - b.stars;
          break;
        case 'forks':
          cmp = a.forks - b.forks;
          break;
        case 'total_commits':
          cmp = a.totalCommits - b.totalCommits;
          break;
        case 'recent_commits_90d':
          cmp = a.recentCommits90d - b.recentCommits90d;
          break;
        case 'age_days':
          cmp = a.ageDays - b.ageDays;
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [repositories, searchQuery, languageFilter, statusFilter, sortBy, sortDirection]);

  return {
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
    sortDirection,
    setSortDirection,
    availableLanguages,
    expandedRepo,
    setExpandedRepo,
  };
}
