import { useEffect, useMemo, useState, type FC } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from '../../sections/ProjectCard';
import type { Project, ProjectSortField, ProjectSortOrder } from '../../types/projects-api';
import { sanitizeInput } from '../../utils/sanitize';

interface ProjectGroup {
  key: string;
  name: string;
  description?: string;
  sortOrder: number;
  projects: Project[];
}

function getProjectCategoryKey(project: Project): string {
  return project.category_id || project.category || 'uncategorized';
}

function getProjectCategoryName(project: Project): string {
  return project.category || project.category_id || 'Uncategorized';
}

function filterProjects(
  projects: Project[],
  searchTerm: string,
  categoryFilter: string,
  statusFilter: string
) {
  let result = [...projects];

  if (categoryFilter !== 'All') {
    result = result.filter(project => getProjectCategoryKey(project) === categoryFilter);
  }

  if (statusFilter !== 'All') {
    result = result.filter(project => project.status === statusFilter);
  }

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    result = result.filter(project => {
      const searchable = [
        project.name,
        project.description,
        project.status,
        project.category,
        project.tagline,
        project.delivery_pattern,
        project.host_tag,
        ...(project.technologies ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(term);
    });
  }

  return result;
}

function sortProjects(
  projects: Project[],
  sortField: ProjectSortField,
  sortOrder: ProjectSortOrder
) {
  const sorted = [...projects].sort((a, b) => {
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

  return sorted;
}

function groupProjects(projects: Project[]): ProjectGroup[] {
  const groups = new Map<string, ProjectGroup>();

  for (const project of projects) {
    const key = getProjectCategoryKey(project);
    const existing = groups.get(key);
    if (existing) {
      existing.projects.push(project);
      continue;
    }

    groups.set(key, {
      key,
      name: getProjectCategoryName(project),
      description: project.category_description,
      sortOrder: project.category_sort_order ?? 999,
      projects: [project],
    });
  }

  return [...groups.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
  );
}

/**
 * Renders the projects mini-app with search, sorting, and pagination.
 *
 * @returns Projects app page
 */
const ProjectsPage: FC = (): React.JSX.Element => {
  const { setSEO } = useSEO();
  const { projects, loading, error, refreshCache } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<ProjectSortField>('name');
  const [sortOrder, setSortOrder] = useState<ProjectSortOrder>('asc');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setSEO({
      title: 'Projects - TailwindSpark',
      description: 'Explore portfolio projects with search, filter, and pagination.',
    });
  }, [setSEO]);

  const categoryOptions = useMemo(
    () =>
      groupProjects(projects).map(group => ({
        value: group.key,
        label: group.name,
      })),
    [projects]
  );

  const statusOptions = useMemo(
    () => [...new Set(projects.map(project => project.status))].sort((a, b) => a.localeCompare(b)),
    [projects]
  );

  const filtered = useMemo(
    () => filterProjects(projects, searchTerm, categoryFilter, statusFilter),
    [projects, searchTerm, categoryFilter, statusFilter]
  );

  const grouped = useMemo(
    () => groupProjects(sortProjects(filtered, sortField, sortOrder)),
    [filtered, sortField, sortOrder]
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="border-brand mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-text-muted">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="border-destructive/30 bg-destructive/5 rounded-lg border p-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={refreshCache}
            className="bg-brand hover:bg-brand-hover rounded-md px-4 py-2 text-sm text-white transition-colors"
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
        <div>
          <p className="text-brand mb-2 text-xs font-semibold tracking-wide uppercase">
            Ecosystem Inventory
          </p>
          <h1 className="text-text text-3xl font-bold">Initiatives, systems, and platforms</h1>
        </div>
        <button
          onClick={refreshCache}
          className="border-border bg-surface text-text hover:bg-surface-alt rounded-md border px-4 py-2 text-sm transition-colors"
        >
          Refresh Cache
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <input
          type="text"
          aria-label="Search projects"
          placeholder="Search ecosystem..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(sanitizeInput(e.target.value));
          }}
          className="border-border bg-surface text-text placeholder:text-text-muted focus:border-brand focus:ring-brand flex-1 rounded-md border px-4 py-2 focus:ring-1 focus:outline-none"
        />
        <select
          aria-label="Filter projects by category"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border-border bg-surface text-text focus:border-brand focus:ring-brand rounded-md border px-4 py-2 focus:ring-1 focus:outline-none"
        >
          <option value="All">All categories</option>
          {categoryOptions.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter projects by status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border-border bg-surface text-text focus:border-brand focus:ring-brand rounded-md border px-4 py-2 focus:ring-1 focus:outline-none"
        >
          <option value="All">All statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort projects"
          value={`${sortField}-${sortOrder}`}
          onChange={e => {
            const [field, order] = e.target.value.split('-') as [
              ProjectSortField,
              ProjectSortOrder,
            ];
            setSortField(field);
            setSortOrder(order);
          }}
          className="border-border bg-surface text-text focus:border-brand focus:ring-brand rounded-md border px-4 py-2 focus:ring-1 focus:outline-none"
        >
          <option value="id-asc">Ecosystem order</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-text-muted py-8 text-center">
          No projects found{searchTerm ? ` matching "${searchTerm}"` : ''}.
        </p>
      ) : (
        <div className="space-y-10">
          {grouped.map(group => (
            <section key={group.key} id={group.key}>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-text text-2xl font-semibold">{group.name}</h2>
                  {group.description && (
                    <p className="text-text-muted mt-1 max-w-3xl text-sm">{group.description}</p>
                  )}
                </div>
                <span className="text-text-muted text-sm">
                  {group.projects.length} item{group.projects.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.projects.map(project => (
                  <ProjectCard
                    key={`${group.key}-${project.id}-${project.name}`}
                    project={project}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-text-muted mt-4 text-center text-sm">
        Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default ProjectsPage;
