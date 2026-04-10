import { Search } from 'lucide-react';
import type { RepoSortField, RepoStatusFilter } from '../types/repos-api';

interface RepoFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  languageFilter: string | null;
  onLanguageChange: (language: string | null) => void;
  statusFilter: RepoStatusFilter;
  onStatusChange: (status: RepoStatusFilter) => void;
  sortBy: RepoSortField;
  onSortChange: (field: RepoSortField) => void;
  availableLanguages: string[];
  resultCount: number;
}

const SORT_OPTIONS: { value: RepoSortField; label: string }[] = [
  { value: 'composite_score', label: 'Composite Score' },
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
  { value: 'total_commits', label: 'Total Commits' },
  { value: 'recent_commits_90d', label: 'Recent Activity' },
  { value: 'age_days', label: 'Age' },
  { value: 'name', label: 'Name (A-Z)' },
];

/**
 * Renders search, language, status, and sort controls for the repository listing.
 *
 * @param props - Filter control props
 * @param props.searchQuery - Current search term
 * @param props.onSearchChange - Callback when search input changes
 * @param props.languageFilter - Currently selected language or null
 * @param props.onLanguageChange - Callback when language filter changes
 * @param props.statusFilter - Currently selected status filter
 * @param props.onStatusChange - Callback when status filter changes
 * @param props.sortBy - Currently selected sort field
 * @param props.onSortChange - Callback when sort changes
 * @param props.availableLanguages - List of distinct languages for the dropdown
 * @param props.resultCount - Number of results matching current filters
 * @returns Filter bar element
 */
export const RepoFilters: React.FC<RepoFiltersProps> = ({
  searchQuery,
  onSearchChange,
  languageFilter,
  onLanguageChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  availableLanguages,
  resultCount,
}) => {
  return (
    <div className="mb-6 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          aria-label="Search repositories"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border bg-surface py-2 pl-10 pr-4 text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          aria-label="Filter by language"
          value={languageFilter ?? ''}
          onChange={e => onLanguageChange(e.target.value || null)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="">All Languages</option>
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value as RepoStatusFilter)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="stale">Stale</option>
          <option value="archived">Archived</option>
        </select>

        <select
          aria-label="Sort repositories"
          value={sortBy}
          onChange={e => onSortChange(e.target.value as RepoSortField)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="text-sm text-text-muted sm:ml-auto">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};
