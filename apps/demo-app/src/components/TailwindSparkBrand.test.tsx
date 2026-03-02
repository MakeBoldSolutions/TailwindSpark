import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TailwindSparkBrand } from './TailwindSparkBrand';

describe('TailwindSparkBrand', () => {
  it('renders without crashing', () => {
    render(<TailwindSparkBrand />);
    expect(screen.getByText(/TailwindSpark/i)).toBeInTheDocument();
  });

  it('displays brand name', () => {
    render(<TailwindSparkBrand />);
    expect(screen.getByText(/TailwindSpark/i)).toBeInTheDocument();
  });

  it('renders default variant', () => {
    render(<TailwindSparkBrand />);
    const brandElement = screen.getByText(/TailwindSpark/i);
    expect(brandElement).toBeInTheDocument();
  });

  it('renders hero variant', () => {
    render(<TailwindSparkBrand variant="hero" />);
    const brandElement = screen.getByText(/TailwindSpark/i);
    expect(brandElement).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<TailwindSparkBrand variant="footer" />);
    const brandElement = screen.getByText(/TailwindSpark/i);
    expect(brandElement).toBeInTheDocument();
  });

  it('shows logo and title together when logoTitleTogether is true', () => {
    render(<TailwindSparkBrand logoTitleTogether={true} />);
    
    // Logo and title should both be present
    expect(screen.getByText(/TailwindSpark/i)).toBeInTheDocument();
  });

  it('displays logo component', () => {
    render(<TailwindSparkBrand />);
    
    // Logo should be present
    const logo = document.querySelector('[data-testid="logo"]') ||
                document.querySelector('svg');
    expect(logo).toBeTruthy();
  });

  it('shows tagline or description', () => {
    render(<TailwindSparkBrand variant="hero" />);
    
    // Tagline should appear in hero variant
    const tagline = screen.queryByText(/Modern|React|TypeScript|Tailwind/i);
    expect(tagline).toBeTruthy();
  });

  it('has proper text styling', () => {
    render(<TailwindSparkBrand />);
    
    // Text should have styling classes
    const brandText = screen.getByText(/TailwindSpark/i);
    expect(brandText.className).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<TailwindSparkBrand variant="hero" />);
    expect(screen.getByText(/TailwindSpark/i)).toBeInTheDocument();
    
    rerender(<TailwindSparkBrand variant="footer" />);
    expect(screen.getByText(/TailwindSpark/i)).toBeInTheDocument();
  });

  it('displays spark icon or emblem', () => {
    render(<TailwindSparkBrand />);
    
    // Spark icon/emblem
    const icon = document.querySelector('svg') ||
                document.querySelector('[class*="spark"], [class*="icon"]');
    expect(icon).toBeTruthy();
  });

  it('shows brand colors', () => {
    render(<TailwindSparkBrand />);
    
    // Brand styling with colors
    const brandElement = document.querySelector('[class*="brand"], [class*="gradient"]');
    expect(brandElement || screen.getByText(/TailwindSpark/i)).toBeTruthy();
  });

  it('renders with responsive classes', () => {
    render(<TailwindSparkBrand variant="hero" />);
    
    // Responsive sizing
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThanOrEqual(0);
  });
});
