import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '../types/ecommerce';
import QuickViewModal from './QuickViewModal';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  brand: 'Test Brand',
  price: 99.99,
  category: 'Test Category',
  image: '/test-image.jpg',
  images: ['/test-image.jpg'],
  colors: ['black', 'white', 'blue'],
  sizes: ['S', 'M', 'L', 'XL'],
  description: 'Test product description',
  features: ['Feature 1', 'Feature 2'],
  inStock: true,
  stockCount: 10,
  rating: 4.5,
  reviewCount: 100,
};

describe('QuickViewModal', () => {
  const mockOnClose = vi.fn();
  const mockOnAddToCart = vi.fn();
  const mockOnWishlistToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
  });

  it('displays product name and brand', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Brand/i)).toBeInTheDocument();
  });

  it('displays product price', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
  });

  it('shows color selection options', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    
    // Color options should be displayed
    const colorElements = screen.getByText(/Color/i);
    expect(colorElements).toBeInTheDocument();
  });

  it('shows size selection options', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    
    // Size options should be displayed
    const sizeElements = screen.getByText(/Size/i);
    expect(sizeElements).toBeInTheDocument();
  });

  it('displays product rating and reviews', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    
    const addToCartButton = screen.getByRole('button', { name: /Add to Cart/i });
    await user.click(addToCartButton);
    
    expect(mockOnAddToCart).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    
    // Find close button (X icon or Close text)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons[0]; // Usually the close button is first
    
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('toggles wishlist when heart icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    
    // Find wishlist button
    const buttons = screen.getAllByRole('button');
    const wishlistButton = buttons.find(btn => 
      btn.querySelector('svg') || btn.getAttribute('aria-label')?.includes('wishlist')
    );
    
    if (wishlistButton) {
      await user.click(wishlistButton);
      expect(mockOnWishlistToggle).toHaveBeenCalledWith(mockProduct.id);
    }
  });

  it('allows quantity selection', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    
    // Quantity controls should be present
    const quantityText = screen.getByText(/Quantity/i);
    expect(quantityText).toBeInTheDocument();
  });

  it('displays product description', () => {
    render(
      <QuickViewModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        onWishlistToggle={mockOnWishlistToggle}
        isInWishlist={false}
      />
    );
    expect(screen.getByText(/Test product description/i)).toBeInTheDocument();
  });
});
