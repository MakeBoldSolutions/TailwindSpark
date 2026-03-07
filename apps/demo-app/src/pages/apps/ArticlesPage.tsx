import { useEffect, useMemo, useState } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useArticles } from '../../hooks/useArticles';
import { ArticleCard } from '../../sections/ArticleCard';
import type { ArticleSortOrder } from '../../types/rss-api';

const PAGE_SIZE = 6;

/**
 * Renders the articles mini-app with filtering and pagination.
 *
 * @returns Articles app page
 */
function ArticlesPage() {
  const { setSEO } = useSEO();
  const { articles, loading, error, refreshCache } = useArticles();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<ArticleSortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSEO({
      title: 'Articles - TailwindSpark',
      description: 'Browse blog articles from the RSS feed with category filtering.',
    });
  }, [setSEO]);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category));
    return ['All', ...Array.from(cats).sort()];
  }, [articles]);

  const filtered = useMemo(() => {
    let result = [...articles];

    if (categoryFilter !== 'All') {
      result = result.filter(a => a.category === categoryFilter);
    }

    result.sort((a, b) => {
      const cmp = new Date(a.pub_date).getTime() - new Date(b.pub_date).getTime();
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [articles, categoryFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safePage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages] as const;
    }

    if (safePage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    }

    return [1, 'ellipsis', safePage - 1, safePage, safePage + 1, 'ellipsis', totalPages] as const;
  }, [safePage, totalPages]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-text-muted">Loading articles...</p>
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
      <h1 className="mb-8 text-3xl font-bold text-text">Articles</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <select
          aria-label="Filter articles by category"
          value={categoryFilter}
          onChange={e => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-md border border-border bg-surface px-4 py-2 text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setSortOrder(order => (order === 'desc' ? 'asc' : 'desc'));
            setCurrentPage(1);
          }}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:bg-surface-alt"
        >
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {paginated.length === 0 ? (
        <p className="py-8 text-center text-text-muted">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="rounded-md border border-border px-3 py-1 text-sm text-text transition-colors hover:bg-surface-alt disabled:opacity-50"
          >
            Previous
          </button>
          {visiblePages.map((page, index) => page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                page === safePage
                  ? 'bg-brand text-white'
                  : 'border border-border text-text hover:bg-surface-alt'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="rounded-md border border-border px-3 py-1 text-sm text-text transition-colors hover:bg-surface-alt disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-text-muted">
        Showing {paginated.length} of {filtered.length} article{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default ArticlesPage;
