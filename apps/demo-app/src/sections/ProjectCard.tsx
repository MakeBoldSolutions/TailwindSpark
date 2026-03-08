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
    <div className="flex flex-col rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      {project.image_url && (
        <img
          src={project.image_url}
          alt={project.name}
          className="h-48 w-full rounded-t-lg object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">{project.name}</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[project.status] ?? 'bg-surface-alt text-text-muted'}`}
          >
            {project.status}
          </span>
        </div>
        <p className="mb-4 flex-1 text-sm text-text-muted">{project.description}</p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {project.technologies.map(tech => (
              <span
                key={tech}
                className="rounded bg-surface-alt px-2 py-0.5 text-xs text-text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <a
          href={project.project_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          View Project
        </a>
      </div>
    </div>
  );
};
