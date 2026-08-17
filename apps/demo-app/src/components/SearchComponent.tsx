import { Search, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

/**
 * Search result data structure.
 */
interface SearchResult {
  /**
   * Display title of the search result.
   */
  title: string;
  /**
   * Brief description of the result.
   */
  description: string;
  /**
   * Navigation URL for the result.
   */
  url: string;
  /**
   * Category classification of the result.
   */
  category: 'component' | 'animation' | 'demo' | 'page';
}

const searchData: SearchResult[] = [
  // Components
  {
    title: 'Button Components',
    description: 'Interactive buttons with multiple variants and states',
    url: '/design-system',
    category: 'component',
  },
  {
    title: 'Form Components',
    description: 'Complete form library with validation and accessibility',
    url: '/design-system',
    category: 'component',
  },
  {
    title: 'Card Components',
    description: 'Flexible card layouts with headers and footers',
    url: '/design-system',
    category: 'component',
  },
  {
    title: 'Modal Components',
    description: 'Accessible modal dialogs with keyboard navigation',
    url: '/design-system',
    category: 'component',
  },

  // Animations
  {
    title: 'Transition Effects',
    description: 'Smooth transitions for hover, focus, and state changes',
    url: '/animations',
    category: 'animation',
  },
  {
    title: 'Keyframe Animations',
    description: 'Built-in CSS animations with Tailwind utility classes',
    url: '/animations',
    category: 'animation',
  },
  {
    title: 'Interactive Animations',
    description: 'User-triggered animations and state-based transitions',
    url: '/animations',
    category: 'animation',
  },
  {
    title: 'Complex Animations',
    description: 'Multi-property animations with scale, rotate, and shadow',
    url: '/animations',
    category: 'animation',
  },

  // Demos
  {
    title: 'SaaS Dashboard',
    description: 'Full-featured business dashboard with analytics and user management',
    url: '/dashboard',
    category: 'demo',
  },
  {
    title: 'E-commerce Store',
    description: 'Modern online store with product grids and shopping cart',
    url: '/ecommerce',
    category: 'demo',
  },
  {
    title: 'Marketing Landing',
    description: 'Agency-style landing page with hero sections and testimonials',
    url: '/marketing',
    category: 'demo',
  },

  // Pages
  {
    title: 'Home Page',
    description: 'Welcome page with feature overview and navigation',
    url: '/',
    category: 'page',
  },
  {
    title: 'Design System',
    description: 'Comprehensive showcase of all Tailwind components',
    url: '/design-system',
    category: 'page',
  },
  {
    title: 'Animation Showcase',
    description: 'Complete demonstration of Tailwind animation utilities',
    url: '/animations',
    category: 'page',
  },
];

/**
 * Search component properties.
 */
interface SearchComponentProps {
  /**
   * Controls visibility of the search modal.
   */
  isOpen: boolean;
  /**
   * Callback to close the search modal.
   */
  onClose: () => void;
}

/**
 * Full-featured search component with keyboard navigation and filtering.
 *
 * Provides instant search across components, animations, demos, and pages
 * with arrow key navigation and Enter to select functionality.
 *
 * @param root0 - Component props
 * @param root0.isOpen - Controls visibility of the search modal
 * @param root0.onClose - Callback to close the search modal
 * @returns Search component modal
 *
 * @example
 * ```tsx
 * <SearchComponent isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
 * ```
 */
export const SearchComponent: React.FC<SearchComponentProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    return searchData.filter(
      item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      setTimeout(() => {
        window.location.hash = filteredResults[selectedIndex].url;
      }, 0);
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Use React Router or a more React-friendly navigation approach
    // For now, we'll use a safe assignment pattern
    setTimeout(() => {
      window.location.hash = result.url;
    }, 0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[color:var(--modal-overlay)] pt-20 backdrop-blur-sm">
      <div className="rounded-panel border-border shadow-modal mx-4 w-full max-w-2xl border bg-[var(--card-bg)]">
        {/* Search Header */}
        <div className="border-border flex items-center gap-3 border-b p-4">
          <Search className="text-muted h-5 w-5" />
          <input
            type="text"
            placeholder="Search components, animations, demos..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="text-text placeholder-muted flex-1 border-none bg-transparent outline-none"
            /* eslint-disable-next-line jsx-a11y/no-autofocus */
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-control hover:bg-surface-hover p-1 transition-colors"
            aria-label="Close search"
          >
            <X className="text-muted h-5 w-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() && filteredResults.length === 0 && (
            <div className="text-muted p-4 text-center">No results found for "{query}"</div>
          )}

          {filteredResults.map((result, index) => (
            <button
              key={`${result.url}-${index}`}
              onClick={() => handleResultClick(result)}
              aria-label={`Open ${result.title}`}
              className={`hover:bg-surface-hover w-full p-4 text-left transition-colors ${
                index === selectedIndex ? 'bg-surface-hover' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-2 h-2 w-2 rounded-full ${
                    result.category === 'component'
                      ? 'bg-brand'
                      : result.category === 'animation'
                        ? 'bg-success'
                        : result.category === 'demo'
                          ? 'bg-primary-500' // eslint-disable-line no-raw-primary-class/no-raw-primary-class
                          : 'bg-border'
                  }`}
                />
                <div className="flex-1">
                  <div
                    className="text-text font-medium"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {result.title}
                  </div>
                  <div className="text-muted mt-1 text-sm">{result.description}</div>
                  <div className="text-muted mt-1 text-xs capitalize">{result.category}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Search Tips */}
        {query.trim() && filteredResults.length > 0 && (
          <div className="text-muted border border-t p-4 text-xs">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span>
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
