import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../../contexts/SEOContext';
import ReposPage from './ReposPage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const mockSetSearchQuery = vi.fn();
const mockSetLanguageFilter = vi.fn();
const mockSetStatusFilter = vi.fn();
const mockSetSortBy = vi.fn();
const mockSetExpandedRepo = vi.fn();
const mockRefreshCache = vi.fn();

vi.mock('../../hooks/useRepos', () => ({
  useRepos: () => ({
    repositories: [
      {
        name: 'TailwindSpark',
        description: 'Design system repository',
        language: 'TypeScript',
        stargazers_count: 10,
        forks_count: 2,
        watchers_count: 5,
        open_issues_count: 1,
        html_url: 'https://github.com/example/TailwindSpark',
        homepage: 'https://example.com',
        archived: false,
        fork: false,
        updated_at: '2026-04-13T00:00:00Z',
        topics: ['react', 'tailwind'],
        license: { key: 'mit', name: 'MIT License' },
      },
    ],
    filteredRepositories: [
      {
        name: 'TailwindSpark',
        description: 'Design system repository',
        language: 'TypeScript',
        stargazers_count: 10,
        forks_count: 2,
        watchers_count: 5,
        open_issues_count: 1,
        html_url: 'https://github.com/example/TailwindSpark',
        homepage: 'https://example.com',
        archived: false,
        fork: false,
        updated_at: '2026-04-13T00:00:00Z',
        topics: ['react', 'tailwind'],
        license: { key: 'mit', name: 'MIT License' },
      },
    ],
    profile: {
      public_repos: 1,
      followers: 10,
      following: 1,
      login: 'markhazleton',
      html_url: 'https://github.com/markhazleton',
    },
    loading: false,
    error: null,
    refreshCache: mockRefreshCache,
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    languageFilter: null,
    setLanguageFilter: mockSetLanguageFilter,
    statusFilter: 'all',
    setStatusFilter: mockSetStatusFilter,
    sortBy: 'updated',
    setSortBy: mockSetSortBy,
    availableLanguages: ['TypeScript'],
    expandedRepo: null,
    setExpandedRepo: mockSetExpandedRepo,
  }),
}));

vi.mock('../../sections/RepoSummary', () => ({
  RepoSummary: () => <div>Repository summary</div>,
}));

vi.mock('../../sections/RepoFilters', () => ({
  RepoFilters: ({ onSearchChange, resultCount }: { onSearchChange: (value: string) => void; resultCount: number }) => (
    <div>
      <label htmlFor="repo-search">Search repositories</label>
      <input id="repo-search" onChange={event => onSearchChange(event.target.value)} />
      <span>{resultCount} results</span>
    </div>
  ),
}));

vi.mock('../../sections/RepoCard', () => ({
  RepoCard: ({ repository, onToggle }: { repository: { name: string }; onToggle: () => void }) => (
    <button onClick={onToggle}>{repository.name}</button>
  ),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <ReposPage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('ReposPage', () => {
  it('renders repositories content', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: /GitHub Repositories/i })).toBeInTheDocument();
    expect(screen.getByText('Repository summary')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TailwindSpark/i })).toBeInTheDocument();
  });

  it('refreshes repository data', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /Refresh Cache/i }));
    expect(mockRefreshCache).toHaveBeenCalled();
  });

  it('passes sanitized search input to filters', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/Search repositories/i), 'spark');
    expect(mockSetSearchQuery).toHaveBeenCalled();
  });

  it.each(themeMatrix)('keeps repositories route content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: /GitHub Repositories/i })).toBeInTheDocument();
    expect(screen.getByText(/1 results/i)).toBeInTheDocument();
    expect(screen.getByText(/Showing 1 of 1 repositor/i)).toBeInTheDocument();
  });
});