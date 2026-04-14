import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Layout } from './Layout';

const renderLayout = ({
  route = '/',
  themeId = 'material',
  mode = 'light',
}: {
  route?: string;
  themeId?: 'material' | 'minimal' | 'brutalist';
  mode?: 'light' | 'dark';
} = {}) => {
  const onModeToggle = vi.fn();
  const onThemeChange = vi.fn();

  vi.mocked(useLocation).mockReturnValue({
    pathname: route,
    search: '',
    hash: '',
    state: null,
    key: route,
  });

  const result = render(
    <Layout
      themeId={themeId}
      mode={mode}
      availableThemes={[
        {
          id: 'material',
          label: 'Material',
          description: 'Material theme',
          defaultMode: 'light',
          supportedModes: ['light', 'dark'],
          metadata: {
            density: 'comfortable',
            typography: 'system',
            motion: 'smooth',
            shape: 'rounded',
          },
        },
        {
          id: 'minimal',
          label: 'Minimal',
          description: 'Minimal theme',
          defaultMode: 'light',
          supportedModes: ['light', 'dark'],
          metadata: {
            density: 'compact',
            typography: 'editorial',
            motion: 'minimal',
            shape: 'soft',
          },
        },
        {
          id: 'brutalist',
          label: 'Brutalist',
          description: 'Brutalist theme',
          defaultMode: 'dark',
          supportedModes: ['light', 'dark'],
          metadata: {
            density: 'roomy',
            typography: 'display',
            motion: 'snappy',
            shape: 'sharp',
          },
        },
      ]}
      onThemeChange={onThemeChange}
      onModeToggle={onModeToggle}
    >
      <div>Test Content</div>
    </Layout>
  );

  return {
    ...result,
    onModeToggle,
    onThemeChange,
  };
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sticky header and skip link', () => {
    renderLayout();

    const header = document.querySelector('header');

    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Skip to main content/i })).toBeInTheDocument();
    expect(header).toHaveClass('sticky', 'top-0', 'z-40');
  });

  it('renders navigation links and theme-specific toggle labels', () => {
    const onModeToggle = vi.fn();
    const onThemeChange = vi.fn();
    const { rerender } = render(
      <Layout
        themeId="material"
        mode="light"
        availableThemes={[
          {
            id: 'material',
            label: 'Material',
            description: 'Material theme',
            defaultMode: 'light',
            supportedModes: ['light', 'dark'],
            metadata: {
              density: 'comfortable',
              typography: 'system',
              motion: 'smooth',
              shape: 'rounded',
            },
          },
        ]}
        onThemeChange={onThemeChange}
        onModeToggle={onModeToggle}
      >
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Select theme/i })).toBeInTheDocument();

    rerender(
      <Layout
        themeId="material"
        mode="dark"
        availableThemes={[
          {
            id: 'material',
            label: 'Material',
            description: 'Material theme',
            defaultMode: 'light',
            supportedModes: ['light', 'dark'],
            metadata: {
              density: 'comfortable',
              typography: 'system',
              motion: 'smooth',
              shape: 'rounded',
            },
          },
        ]}
        onThemeChange={onThemeChange}
        onModeToggle={onModeToggle}
      >
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByRole('button', { name: /Switch to light mode/i })).toBeInTheDocument();
  });

  it('opens the Apps menu with keyboard input and exposes ARIA attributes', async () => {
    const user = userEvent.setup();
    renderLayout();

    const appsButton = screen.getByRole('button', { name: /Apps/i });

    expect(appsButton).toHaveAttribute('aria-haspopup', 'true');
    expect(appsButton).toHaveAttribute('aria-expanded', 'false');

    appsButton.focus();
    await user.keyboard('{Enter}');

    expect(appsButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /All Apps/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /AI Chat/i })).toBeInTheDocument();
  });

  it('closes the Apps menu when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderLayout();

    const appsButton = screen.getByRole('button', { name: /Apps/i });
    await user.click(appsButton);

    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(appsButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows active styling for the current apps route', async () => {
    const user = userEvent.setup();
    renderLayout({ route: '/apps/projects' });

    const appsButton = screen.getByRole('button', { name: /Apps/i });

    await user.click(appsButton);

    const projectsLink = screen.getByRole('menuitem', { name: /Projects/i });
    expect(projectsLink.className).toContain('bg-brand/10');
    expect(projectsLink.className).toContain('text-brand');
  });

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderLayout();

    const mobileMenuButton = screen.getByRole('button', { name: /Toggle mobile menu/i });

    expect(screen.queryByText(/^All Apps$/i)).not.toBeInTheDocument();

    await user.click(mobileMenuButton);

    expect(screen.getAllByText(/^Apps$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/^All Apps$/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Projects/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByText(/^All Apps$/i)).not.toBeInTheDocument();
  });
});
