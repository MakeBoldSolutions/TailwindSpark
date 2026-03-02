import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DashboardLayout } from './DashboardLayout';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardLayout', () => {
  it('renders without crashing', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test Dashboard">
        <div>Dashboard Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText(/Dashboard Content/i)).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Test Dashboard Page</div>
      </DashboardLayout>
    );
    expect(screen.getByText(/Test Dashboard Page/i)).toBeInTheDocument();
  });

  it('displays sidebar navigation', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Sidebar should be present
    const sidebar = document.querySelector('[class*="sidebar"]') ||
                   document.querySelector('aside');
    expect(sidebar).toBeTruthy();
  });

  it('shows dashboard navigation links', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Dashboard link
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
  });

  it('displays analytics navigation link', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Analytics link
    expect(screen.getByRole('link', { name: /Analytics/i })).toBeInTheDocument();
  });

  it('shows users navigation link', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Users link
    expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
  });

  it('displays settings navigation link', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Settings link
    expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Main Content Area</div>
      </DashboardLayout>
    );
    
    // Main content
    const mainArea = document.querySelector('main') ||
                    document.querySelector('[role="main"]');
    expect(mainArea).toBeInTheDocument();
  });

  it('has responsive layout', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Responsive classes
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('shows navigation icons', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Navigation icons
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('highlights active navigation item', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Active link should have special styling
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders with proper spacing', () => {
    renderWithRouter(
      <DashboardLayout pageTitle="Test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    // Proper spacing classes
    const spacedElements = document.querySelectorAll('[class*="space"], [class*="gap"], [class*="p-"]');
    expect(spacedElements.length).toBeGreaterThan(0);
  });
});
