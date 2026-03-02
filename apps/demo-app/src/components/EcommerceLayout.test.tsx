import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { CartItem } from '../types/ecommerce';
import EcommerceLayout from './EcommerceLayout';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockCart: CartItem[] = [];
const mockSetCart = vi.fn();
const mockSearchQuery = '';
const mockSetSearchQuery = vi.fn();

describe('EcommerceLayout', () => {
  it('renders without crashing', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Ecommerce Content</div>
      </EcommerceLayout>
    );
    expect(screen.getByText(/Ecommerce Content/i)).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Product Listing</div>
      </EcommerceLayout>
    );
    expect(screen.getByText(/Product Listing/i)).toBeInTheDocument();
  });

  it('displays header navigation', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Header should be present
    const header = document.querySelector('header') ||
                  document.querySelector('nav');
    expect(header).toBeInTheDocument();
  });

  it('shows shopping cart icon or link', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Cart link/icon
    const cart = screen.queryByText(/Cart/i) ||
                screen.queryByRole('link', { name: /cart/i }) ||
                document.querySelector('[aria-label*="cart"]');
    expect(cart).toBeTruthy();
  });

  it('displays product categories or navigation', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Category navigation
    const nav = screen.getAllByRole('link');
    expect(nav.length).toBeGreaterThan(0);
  });

  it('shows search functionality', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Search input or button
    const search = screen.queryByPlaceholderText(/Search/i) ||
                  screen.queryByRole('button', { name: /search/i });
    expect(search).toBeTruthy();
  });

  it('renders footer', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Footer section
    const footer = document.querySelector('footer') ||
                  document.querySelector('[class*="footer"]');
    expect(footer).toBeTruthy();
  });

  it('displays logo or brand', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Logo or brand name
    const logo = document.querySelector('[data-testid="logo"]') ||
                screen.queryByText(/TailwindSpark/i);
    expect(logo).toBeTruthy();
  });

  it('shows user account link', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Account/profile link
    const accountLink = screen.queryByText(/Account|Profile|Sign In/i) ||
                       document.querySelector('[aria-label*="account"]');
    expect(accountLink).toBeTruthy();
  });

  it('has responsive layout', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Content</div>
      </EcommerceLayout>
    );
    
    // Responsive classes
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('renders main content area', () => {
    renderWithRouter(
      <EcommerceLayout
        cart={mockCart}
        setCart={mockSetCart}
        searchQuery={mockSearchQuery}
        setSearchQuery={mockSetSearchQuery}
      >
        <div>Main Content</div>
      </EcommerceLayout>
    );
    
    // Main content wrapper
    const main = document.querySelector('main') ||
                document.querySelector('[role="main"]');
    expect(main).toBeTruthy();
  });
});
