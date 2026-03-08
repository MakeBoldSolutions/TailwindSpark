import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../../contexts/SEOContext';
import ProjectsPage from './ProjectsPage';

const mockProjects = [
  { id: 1, name: 'Alpha Project', description: 'First project', image_url: '', project_url: 'https://example.com/1', status: 'Active' as const, technologies: ['React'] },
  { id: 2, name: 'Beta Project', description: 'Second project', image_url: '', project_url: 'https://example.com/2', status: 'Completed' as const, technologies: ['TypeScript'] },
  { id: 3, name: 'Gamma Project', description: 'Third project', image_url: '', project_url: 'https://example.com/3', status: 'Active' as const, technologies: ['Vue'] },
];

vi.mock('../../hooks/useProjects', () => ({
  useProjects: () => ({
    projects: mockProjects,
    loading: false,
    error: null,
    refreshCache: vi.fn(),
  }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <ProjectsPage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('ProjectsPage', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Projects/i })).toBeInTheDocument();
  });

  it('displays project cards', () => {
    renderPage();
    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
    expect(screen.getByText('Beta Project')).toBeInTheDocument();
  });

  it('has search input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Search projects/i)).toBeInTheDocument();
  });

  it('filters projects by search term', async () => {
    const user = userEvent.setup();
    renderPage();

    const input = screen.getByPlaceholderText(/Search projects/i);
    await user.type(input, 'Alpha');

    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
    expect(screen.queryByText('Beta Project')).not.toBeInTheDocument();
  });

  it('has sort select', () => {
    renderPage();
    const select = screen.getByDisplayValue('Name (A-Z)');
    expect(select).toBeInTheDocument();
  });

  it('displays refresh cache button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Refresh Cache/i })).toBeInTheDocument();
  });

  it('shows result count', () => {
    renderPage();
    expect(screen.getByText(/Showing \d+ of \d+ project/i)).toBeInTheDocument();
  });

  it('renders without critical axe violations', async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
