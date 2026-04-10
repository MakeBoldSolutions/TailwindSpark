import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RepoSortField, RepoStatusFilter } from '../types/repos-api';
import { RepoFilters } from './RepoFilters';

describe('RepoFilters', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    languageFilter: null,
    onLanguageChange: vi.fn(),
    statusFilter: 'all' as RepoStatusFilter,
    onStatusChange: vi.fn(),
    sortBy: 'composite_score' as RepoSortField,
    onSortChange: vi.fn(),
    availableLanguages: ['TypeScript', 'JavaScript', 'Python', 'C#'],
    resultCount: 25,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Search Input', () => {
    it('renders search input with placeholder', () => {
      render(<RepoFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search repositories...');
      expect(searchInput).toBeInTheDocument();
    });

    it('displays current search query value', () => {
      render(<RepoFilters {...defaultProps} searchQuery="test query" />);
      
      const searchInput = screen.getByDisplayValue('test query');
      expect(searchInput).toBeInTheDocument();
    });

    it('calls onSearchChange when typing in search', () => {
      const handleSearchChange = vi.fn();
      render(<RepoFilters {...defaultProps} onSearchChange={handleSearchChange} />);
      
      const searchInput = screen.getByPlaceholderText('Search repositories...');
      fireEvent.change(searchInput, { target: { value: 'new search' } });
      
      expect(handleSearchChange).toHaveBeenCalledWith('new search');
    });

    it('has proper aria-label for accessibility', () => {
      render(<RepoFilters {...defaultProps} />);
      
      const searchInput = screen.getByLabelText('Search repositories');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Language Filter', () => {
    it('renders language dropdown with all languages', () => {
      render(<RepoFilters {...defaultProps} />);
      
      const languageSelect = screen.getByLabelText('Filter by language');
      expect(languageSelect).toBeInTheDocument();
      
      const options = languageSelect.querySelectorAll('option');
      expect(options).toHaveLength(5); // "All Languages" + 4 languages
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('C#')).toBeInTheDocument();
    });

    it('shows "All Languages" as default option', () => {
      render(<RepoFilters {...defaultProps} />);
      
      expect(screen.getByText('All Languages')).toBeInTheDocument();
    });

    it('displays selected language', () => {
      render(<RepoFilters {...defaultProps} languageFilter="TypeScript" />);
      
      const languageSelect = screen.getByLabelText('Filter by language') as HTMLSelectElement;
      expect(languageSelect.value).toBe('TypeScript');
    });

    it('calls onLanguageChange when selecting a language', () => {
      const handleLanguageChange = vi.fn();
      render(<RepoFilters {...defaultProps} onLanguageChange={handleLanguageChange} />);
      
      const languageSelect = screen.getByLabelText('Filter by language');
      fireEvent.change(languageSelect, { target: { value: 'Python' } });
      
      expect(handleLanguageChange).toHaveBeenCalledWith('Python');
    });

    it('calls onLanguageChange with null when selecting "All Languages"', () => {
      const handleLanguageChange = vi.fn();
      render(<RepoFilters {...defaultProps} onLanguageChange={handleLanguageChange} />);
      
      const languageSelect = screen.getByLabelText('Filter by language');
      fireEvent.change(languageSelect, { target: { value: '' } });
      
      expect(handleLanguageChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Status Filter', () => {
    it('renders status dropdown with all options', () => {
      render(<RepoFilters {...defaultProps} />);
      
      const statusSelect = screen.getByLabelText('Filter by status');
      expect(statusSelect).toBeInTheDocument();
      
      expect(screen.getByText('All Status')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Stale')).toBeInTheDocument();
      expect(screen.getByText('Archived')).toBeInTheDocument();
    });

    it('displays selected status', () => {
      render(<RepoFilters {...defaultProps} statusFilter="active" />);
      
      const statusSelect = screen.getByLabelText('Filter by status') as HTMLSelectElement;
      expect(statusSelect.value).toBe('active');
    });

    it('calls onStatusChange when selecting a status', () => {
      const handleStatusChange = vi.fn();
      render(<RepoFilters {...defaultProps} onStatusChange={handleStatusChange} />);
      
      const statusSelect = screen.getByLabelText('Filter by status');
      fireEvent.change(statusSelect, { target: { value: 'archived' } });
      
      expect(handleStatusChange).toHaveBeenCalledWith('archived');
    });
  });

  describe('Sort Dropdown', () => {
    it('renders sort dropdown with all sort options', () => {
      render(<RepoFilters {...defaultProps} />);
      
      const sortSelect = screen.getByLabelText('Sort repositories');
      expect(sortSelect).toBeInTheDocument();
      
      expect(screen.getByText('Composite Score')).toBeInTheDocument();
      expect(screen.getByText('Stars')).toBeInTheDocument();
      expect(screen.getByText('Forks')).toBeInTheDocument();
      expect(screen.getByText('Total Commits')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Name (A-Z)')).toBeInTheDocument();
    });

    it('displays selected sort field', () => {
      render(<RepoFilters {...defaultProps} sortBy="stars" />);
      
      const sortSelect = screen.getByLabelText('Sort repositories') as HTMLSelectElement;
      expect(sortSelect.value).toBe('stars');
    });

    it('calls onSortChange when selecting a sort option', () => {
      const handleSortChange = vi.fn();
      render(<RepoFilters {...defaultProps} onSortChange={handleSortChange} />);
      
      const sortSelect = screen.getByLabelText('Sort repositories');
      fireEvent.change(sortSelect, { target: { value: 'forks' } });
      
      expect(handleSortChange).toHaveBeenCalledWith('forks');
    });
  });

  describe('Result Count', () => {
    it('displays result count', () => {
      render(<RepoFilters {...defaultProps} resultCount={42} />);
      
      expect(screen.getByText(/42 results/i)).toBeInTheDocument();
    });

    it('displays singular form for one result', () => {
      render(<RepoFilters {...defaultProps} resultCount={1} />);
      
      expect(screen.getByText(/1 result$/i)).toBeInTheDocument();
    });

    it('displays plural form for multiple results', () => {
      render(<RepoFilters {...defaultProps} resultCount={10} />);
      
      expect(screen.getByText(/10 results$/i)).toBeInTheDocument();
    });

    it('displays zero results message', () => {
      render(<RepoFilters {...defaultProps} resultCount={0} />);
      
      expect(screen.getByText(/0 results/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('all form controls have proper labels', () => {
      render(<RepoFilters {...defaultProps} />);
      
      expect(screen.getByLabelText('Search repositories')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by language')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
      expect(screen.getByLabelText('Sort repositories')).toBeInTheDocument();
    });

    it('search input is keyboard accessible', () => {
      render(<RepoFilters {...defaultProps} />);
      
      const searchInput = screen.getByLabelText('Search repositories');
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Empty State', () => {
    it('renders correctly with no languages available', () => {
      render(<RepoFilters {...defaultProps} availableLanguages={[]} />);
      
      const languageSelect = screen.getByLabelText('Filter by language');
      const options = languageSelect.querySelectorAll('option');
      expect(options).toHaveLength(1); // Only "All Languages"
    });
  });
});
