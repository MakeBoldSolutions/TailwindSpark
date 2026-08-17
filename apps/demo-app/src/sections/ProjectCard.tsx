import type { Project } from '../types/projects-api';

interface ProjectCardProps {
  project: Project;
}

const statusClasses: Record<string, string> = {
  Active: 'bg-success-100 text-success-800',
  Completed: 'bg-brand/10 text-brand',
  Archived: 'bg-secondary-200 text-secondary-700',
};

/**
 * Displays a portfolio project summary card.
 *
 * @param props - Project card props
 * @param props.project - Project data to render
 * @returns Project card UI
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="rounded-panel border-border shadow-card flex flex-col border bg-[var(--card-bg)] transition-shadow hover:shadow-lg">
      {project.image_url && (
        <img
          src={project.image_url}
          alt={project.name}
          className="rounded-t-panel h-48 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start gap-3">
          {!project.image_url && project.icon && (
            <div
              className="rounded-panel bg-brand/10 flex h-11 w-11 shrink-0 items-center justify-center text-2xl"
              aria-hidden="true"
            >
              {project.icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2
              className="text-text text-lg font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {project.name}
            </h2>
            {project.tagline && <p className="text-text-muted mt-1 text-sm">{project.tagline}</p>}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[project.status] ?? 'bg-surface-alt text-text-muted'}`}
          >
            {project.status}
          </span>
          {project.category && (
            <span className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-xs font-medium">
              {project.category}
            </span>
          )}
          {project.host_tag && (
            <span className="bg-surface-alt text-text-muted rounded-full px-2 py-0.5 text-xs font-medium">
              {project.host_tag}
            </span>
          )}
        </div>
        <p className="text-text-muted mb-4 flex-1 text-sm">{project.description}</p>
        {project.delivery_pattern && (
          <p className="rounded-panel bg-surface-alt text-text mb-4 px-3 py-2 text-xs font-medium">
            {project.delivery_pattern}
          </p>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {project.technologies.map(tech => (
              <span
                key={tech}
                className="rounded-control bg-surface-alt text-text-muted px-2 py-0.5 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        {project.related_initiatives && project.related_initiatives.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {project.related_initiatives.slice(0, 3).map(initiative => (
              <span
                key={initiative}
                className="rounded-control border-border text-text-muted border px-2 py-0.5 text-xs"
              >
                {initiative}
              </span>
            ))}
          </div>
        )}
        <a
          href={project.project_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-control bg-brand hover:bg-brand-hover inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Open Site
        </a>
      </div>
    </article>
  );
};
