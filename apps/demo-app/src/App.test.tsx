import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => {
    const pathname = '/';
    const routes = React.Children.toArray(children) as React.ReactElement[];
    const matchedRoute = routes.find(route => route.props.path === pathname)
      ?? routes.find(route => route.props.path === '*')
      ?? null;

    return matchedRoute ? <>{matchedRoute.props.element}</> : null;
  },
  Route: ({ path, element }: { path?: string; element: React.ReactNode }) => <>{React.createElement('mock-route', { path, element })}</>,
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: unknown }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeMode;
  });

  it('renders without crashing', () => {
    render(<App />);
    // The app should render without throwing an error
    expect(document.body).toBeInTheDocument();
  });

  it('switches theme and mode from the app shell', async () => {
    const user = userEvent.setup();

    render(<App />);

    const themeSelect = await screen.findByRole('combobox', { name: /select theme/i });

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('material');
      expect(document.documentElement.dataset.themeMode).toBe('light');
    });

    await user.selectOptions(themeSelect, 'minimal');

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('minimal');
      expect(themeSelect).toHaveValue('minimal');
    });

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));

    await waitFor(() => {
      expect(document.documentElement.dataset.themeMode).toBe('dark');
      expect(document.documentElement).toHaveClass('dark');
    });
  });

  it('renders the app shell without critical axe violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
