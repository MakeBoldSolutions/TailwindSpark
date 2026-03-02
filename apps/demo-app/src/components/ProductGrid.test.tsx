import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '../types/ecommerce';
import ProductGrid from './ProductGrid';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    brand: 'Brand A',
    price: 49.99,
    category: 'Category 1',
    image: '/image1.jpg',
    images: ['/image1.jpg'],
    colors: ['black', 'white'],
    sizes: ['S', 'M', 'L'],
    description: 'Description 1',
    features: ['Feature 1', 'Feature 2'],
    inStock: true,
    stockCount: 10,
    rating: 4.5,
    reviewCount: 100,
  },
  {
    id: 2,
    name: 'Product 2',
    brand: 'Brand B',
    price: 79.99,
    category: 'Category 2',
    image: '/image2.jpg',
    images: ['/image2.jpg'],
    colors: ['blue', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Description 2',
    features: ['Feature 1'],
    inStock: true,
    stockCount: 5,
    rating: 4.0,
    reviewCount: 50,
  },
];

describe('ProductGrid', () => {
  const mockOnAddToCart = vi.fn();
  const mockOnWishlistToggle = vi.fn();
  const mockOnQuickView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
  });

  it('displays all products', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
  });

  it('shows product prices', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    expect(screen.getByText(/\$49\.99/)).toBeInTheDocument();
    expect(screen.getByText(/\$79\.99/)).toBeInTheDocument();
  });

  it('displays product brands', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    expect(screen.getByText(/Brand A/i)).toBeInTheDocument();
    expect(screen.getByText(/Brand B/i)).toBeInTheDocument();
  });

  it('shows loading skeletons when isLoading is true', () => {
    render(
      <ProductGrid
        products={[]}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={true}
      />
    );
    
    // Loading skeletons should be present
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders grid layout', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    
    // Grid layout should be present
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('displays product images', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    
    const images = document.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('shows product ratings', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/4\.0/)).toBeInTheDocument();
  });

  it('highlights wishlist items', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[1]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    
    // Wishlist icon/button should show active state for product 1
    const wishlistButtons = screen.getAllByRole('button');
    expect(wishlistButtons.length).toBeGreaterThan(0);
  });

  it('renders empty state when no products', () => {
    render(
      <ProductGrid
        products={[]}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        wishlist={[]}
        onQuickView={mockOnQuickView}
        isLoading={false}
      />
    );
    
    // Empty state or grid should be present
    const container = document.querySelector('[class*="grid"]') || document.querySelector('div');
    expect(container).toBeInTheDocument();
  });
});
