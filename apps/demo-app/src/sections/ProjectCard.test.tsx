import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Project } from '../types/projects-api';
import { ProjectCard } from './ProjectCard';

const mockProject: Project = {
  id: 1,
  name: 'Test Project',
  description: 'A test project description.',
  image_url: 'https://example.com/image.png',
  project_url: 'https://example.com/project',
  status: 'Active',
  technologies: ['React', 'TypeScript'],
  category: 'Application Frameworks',
  tagline: 'Reusable UI Patterns',
  icon: '*',
  delivery_pattern: 'Pattern -> Example -> Delivery',
  host_tag: 'GitHub Pages',
  related_initiatives: ['dev', 'web'],
};

describe('ProjectCard', () => {
  it('renders project name', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('A test project description.')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders ecosystem metadata', () => {
    render(<ProjectCard project={{ ...mockProject, image_url: '' }} />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Reusable UI Patterns')).toBeInTheDocument();
    expect(screen.getByText('Application Frameworks')).toBeInTheDocument();
    expect(screen.getByText('GitHub Pages')).toBeInTheDocument();
    expect(screen.getByText('Pattern -> Example -> Delivery')).toBeInTheDocument();
    expect(screen.getByText('dev')).toBeInTheDocument();
  });

  it('renders technology tags', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders project image with lazy loading', () => {
    render(<ProjectCard project={mockProject} />);
    const img = screen.getByAltText('Test Project');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('renders Open Site link', () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole('link', { name: /Open Site/i });
    expect(link).toHaveAttribute('href', 'https://example.com/project');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders without image when image_url is empty', () => {
    render(<ProjectCard project={{ ...mockProject, image_url: '' }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders different status classes', () => {
    render(<ProjectCard project={{ ...mockProject, status: 'Completed' }} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
