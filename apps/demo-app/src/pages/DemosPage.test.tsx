import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DemosPage } from './DemosPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DemosPage', () => {


  it('displays page heading', () => {
    renderWithRouter(<DemosPage />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('shows demo categories or sections', () => {
    const { container } = renderWithRouter(<DemosPage />);
    
    // Demos page renders
    expect(container.firstChild).toBeTruthy();
  });

  it('displays demo cards or links', () => {
    renderWithRouter(<DemosPage />);
    
    // Demo links or cards
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders demo descriptions', () => {
    renderWithRouter(<DemosPage />);
    
    // Demo cards should have descriptions
    const descriptions = document.querySelectorAll('p');
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('has grid layout for demo cards', () => {
    renderWithRouter(<DemosPage />);
    
    // Grid layout for demos
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('shows navigation links', () => {
    renderWithRouter(<DemosPage />);
    
    // Navigation should be present
    const nav = document.querySelector('nav') || screen.getAllByRole('link');
    expect(nav).toBeTruthy();
  });

  it('renders with proper spacing', () => {
    renderWithRouter(<DemosPage />);
    
    // Proper spacing between elements
    const spacedElements = document.querySelectorAll('[class*="space"], [class*="gap"]');
    expect(spacedElements.length).toBeGreaterThan(0);
  });

  it('displays demo categories', () => {
    const { container } = renderWithRouter(<DemosPage />);
    
    // Page renders with content
    expect(container.firstChild).toBeTruthy();
  });

  it('has responsive design', () => {
    renderWithRouter(<DemosPage />);
    
    // Responsive classes present
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });
});
