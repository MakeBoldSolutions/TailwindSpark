import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AnimationPage } from './AnimationPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AnimationPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<AnimationPage />);
    expect(screen.getByText(/Animation/i)).toBeInTheDocument();
  });

  it('displays page heading', () => {
    renderWithRouter(<AnimationPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Animation/i);
  });

  it('shows animation showcase sections', () => {
    renderWithRouter(<AnimationPage />);
    
    // Animation examples should be in sections
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('renders animation examples', () => {
    renderWithRouter(<AnimationPage />);
    
    // Animated elements should be present
    const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('displays different animation types', () => {
    renderWithRouter(<AnimationPage />);
    
    // Different animation categories
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(1);
  });

  it('shows hover animations', () => {
    renderWithRouter(<AnimationPage />);
    
    // Elements with hover effects
    const hoverElements = document.querySelectorAll('[class*="hover:"]');
    expect(hoverElements.length).toBeGreaterThan(0);
  });

  it('displays transition effects', () => {
    renderWithRouter(<AnimationPage />);
    
    // Transition classes
    const transitionElements = document.querySelectorAll('[class*="transition"]');
    expect(transitionElements.length).toBeGreaterThan(0);
  });

  it('renders keyframe animations', () => {
    renderWithRouter(<AnimationPage />);
    
    // Keyframe animation examples
    const keyframeElements = document.querySelectorAll('[class*="animate-"]');
    expect(keyframeElements.length).toBeGreaterThan(0);
  });

  it('shows animation controls or demos', () => {
    renderWithRouter(<AnimationPage />);
    
    // Interactive controls for animations
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has proper layout structure', () => {
    renderWithRouter(<AnimationPage />);
    
    // Main content container
    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('displays animation descriptions', () => {
    renderWithRouter(<AnimationPage />);
    
    // Descriptions for animation examples
    const descriptions = document.querySelectorAll('p');
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('renders with responsive design', () => {
    renderWithRouter(<AnimationPage />);
    
    // Responsive grid layouts
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });
});
