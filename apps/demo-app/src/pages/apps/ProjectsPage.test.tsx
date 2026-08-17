import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../../contexts/SEOContext';
import ProjectsPage from './ProjectsPage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const mockProjects = [
  {
    id: 1,
    name: 'Alpha Project',
    description: 'First project',
    image_url: '',
    project_url: 'https://example.com/1',
    status: 'Active' as const,
    technologies: ['React'],
    category_id: 'application-frameworks',
    category: 'Application Frameworks',
    category_description: 'Reusable application delivery patterns.',
    category_sort_order: 40,
    tagline: 'Alpha tagline',
  },
  {
    id: 2,
    name: 'Beta Project',
    description: 'Second project',
    image_url: '',
    project_url: 'https://example.com/2',
    status: 'Completed' as const,
    technologies: ['TypeScript'],
    category_id: 'context-ai',
    category: 'Context and AI',
    category_description: 'Tools and patterns for better context.',
    category_sort_order: 20,
    tagline: 'Beta tagline',
  },
  {
    id: 3,
    name: 'Gamma Project',
    description: 'Third project',
    image_url: '',
    project_url: 'https://example.com/3',
    status: 'Active' as const,
    technologies: ['Vue'],
    category_id: 'application-frameworks',
    category: 'Application Frameworks',
    category_description: 'Reusable application delivery patterns.',
    category_sort_order: 40,
  },
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
    </BrowserRouter>
  );

describe('ProjectsPage', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: /Initiatives, systems, and platforms/i })
    ).toBeInTheDocument();
  });

  it('displays project cards', () => {
    renderPage();
    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
    expect(screen.getByText('Beta Project')).toBeInTheDocument();
  });

  it('has search input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Search ecosystem/i)).toBeInTheDocument();
  });

  it('filters projects by search term', async () => {
    const user = userEvent.setup();
    renderPage();

    const input = screen.getByPlaceholderText(/Search ecosystem/i);
    await user.type(input, 'Alpha');

    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
    expect(screen.queryByText('Beta Project')).not.toBeInTheDocument();
  });

  it('groups projects by ecosystem category', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 2, name: 'Context and AI' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Application Frameworks' })
    ).toBeInTheDocument();
  });

  it('filters projects by category', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/Filter projects by category/i), 'context-ai');

    expect(screen.getByText('Beta Project')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument();
  });

  it('filters projects by status', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/Filter projects by status/i), 'Completed');

    expect(screen.getByText('Beta Project')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument();
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

  it.each(themeMatrix)(
    'keeps projects route content available under %s %s mode',
    (themeId, mode) => {
      document.documentElement.dataset.theme = themeId;
      document.documentElement.dataset.themeMode = mode;
      document.documentElement.classList.toggle('dark', mode === 'dark');

      renderPage();

      expect(
        screen.getByRole('heading', { level: 1, name: /Initiatives, systems, and platforms/i })
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search ecosystem/i)).toBeInTheDocument();
      expect(screen.getByText(/Showing \d+ of \d+ project/i)).toBeInTheDocument();
    }
  );
});
