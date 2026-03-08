import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SEOProvider } from '../contexts/SEOContext';
import AppsHubPage from './AppsHubPage';

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <AppsHubPage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('AppsHubPage', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Apps');
  });

  it('displays all 5 mini-app cards', () => {
    renderPage();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Joke Generator')).toBeInTheDocument();
    expect(screen.getByText('Weather Forecast')).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
  });

  it('renders a grid layout', () => {
    renderPage();
    const grid = document.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
  });

  it('displays subtitle text', () => {
    renderPage();
    expect(screen.getByText(/Explore interactive mini-applications/i)).toBeInTheDocument();
  });

  it('renders MiniAppCard links with correct routes', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const routes = links.map(l => l.getAttribute('href'));
    expect(routes).toContain('/apps/projects');
    expect(routes).toContain('/apps/articles');
    expect(routes).toContain('/apps/joke');
    expect(routes).toContain('/apps/weather');
    expect(routes).toContain('/apps/ai-chat');
  });
});
