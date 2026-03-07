import { useEffect, useMemo, useState } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from '../../sections/ProjectCard';
import type { ProjectSortField, ProjectSortOrder } from '../../types/projects-api';
import { sanitizeInput } from '../../utils/sanitize';

const PAGE_SIZE = 6;

/**
 * Renders the projects mini-app with search, sorting, and pagination.
 *
 * @returns Projects app page
 */
function ProjectsPage() {
  const { setSEO } = useSEO();
  const { projects, loading, error, refreshCache } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<ProjectSortField>('name');
  const [sortOrder, setSortOrder] = useState<ProjectSortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSEO({
      title: 'Projects - TailwindSpark',
      description: 'Explore portfolio projects with search, filter, and pagination.',
    });
  }, [setSEO]);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.status.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === 'id') {
        cmp = a.id - b.id;
      } else if (sortField === 'created_date') {
        cmp = (a.created_date || '').localeCompare(b.created_date || '');
      } else if (sortField === 'updated_date') {
        cmp = (a.updated_date || '').localeCompare(b.updated_date || '');
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [projects, searchTerm, sortField, sortOrder]);

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
          <p className="text-text-muted">Loading projects...</p>
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-text">Projects</h1>
        <button
          onClick={refreshCache}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:bg-surface-alt"
        >
          Refresh Cache
        </button>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          aria-label="Search projects"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(sanitizeInput(e.target.value));
            setCurrentPage(1);
          }}
          className="flex-1 rounded-md border border-border bg-surface px-4 py-2 text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
        <select
          aria-label="Sort projects"
          value={`${sortField}-${sortOrder}`}
          onChange={e => {
            const [field, order] = e.target.value.split('-') as [ProjectSortField, ProjectSortOrder];
            setSortField(field);
            setSortOrder(order);
            setCurrentPage(1);
          }}
          className="rounded-md border border-border bg-surface px-4 py-2 text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="id-asc">ID (Ascending)</option>
          <option value="id-desc">ID (Descending)</option>
        </select>
      </div>

      {/* Results */}
      {paginated.length === 0 ? (
        <p className="py-8 text-center text-text-muted">
          No projects found{searchTerm ? ` matching "${searchTerm}"` : ''}.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Pagination */}
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
        Showing {paginated.length} of {filtered.length} project{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default ProjectsPage;
