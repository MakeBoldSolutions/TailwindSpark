import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { MiniApp } from '../types/miniapp';
import { MiniAppCard } from './MiniAppCard';

const mockApp: MiniApp = {
  id: 'test',
  name: 'Test App',
  description: 'A test mini-app description.',
  route: '/apps/test',
  icon: '🧪',
};

const renderCard = (app: MiniApp = mockApp) =>
  render(<BrowserRouter><MiniAppCard app={app} /></BrowserRouter>);

describe('MiniAppCard', () => {
  it('renders app name', () => {
    renderCard();
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders app description', () => {
    renderCard();
    expect(screen.getByText('A test mini-app description.')).toBeInTheDocument();
  });

  it('renders app icon', () => {
    renderCard();
    expect(screen.getByText('🧪')).toBeInTheDocument();
  });

  it('renders Launch link with correct route', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /Launch Test App/i });
    expect(link).toHaveAttribute('href', '/apps/test');
  });

  it('has accessible aria-label on Launch link', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /Launch Test App/i });
    expect(link).toHaveAttribute('aria-label', 'Launch Test App');
  });
});
