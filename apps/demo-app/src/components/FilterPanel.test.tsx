import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { FilterState, Product } from '../types/ecommerce';
import FilterPanel from './FilterPanel';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    brand: 'Brand A',
    price: 49.99,
    category: 'Electronics',
    image: '/image1.jpg',
    images: ['/image1.jpg'],
    colors: ['black', 'white'],
    sizes: ['S', 'M'],
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
    category: 'Clothing',
    image: '/image2.jpg',
    images: ['/image2.jpg'],
    colors: ['blue', 'red'],
    sizes: ['L', 'XL'],
    description: 'Description 2',
    features: ['Feature 1'],
    inStock: false,
    stockCount: 0,
    rating: 4.0,
    reviewCount: 50,
  },
];

const initialFilters: FilterState = {
  categories: [],
  brands: [],
  colors: [],
  sizes: [],
  priceRange: [0, 500],
  inStockOnly: false,
};

describe('FilterPanel', () => {
  const mockSetFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Filter|Category/i)).toBeInTheDocument();
  });

  it('displays category filters', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Category/i)).toBeInTheDocument();
  });

  it('shows all unique categories from products', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/Clothing/i)).toBeInTheDocument();
  });

  it('displays brand filters', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Brand/i)).toBeInTheDocument();
    expect(screen.getByText(/Brand A/i)).toBeInTheDocument();
    expect(screen.getByText(/Brand B/i)).toBeInTheDocument();
  });

  it('shows color filter options', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Color/i)).toBeInTheDocument();
  });

  it('displays size filter options', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Size/i)).toBeInTheDocument();
  });

  it('shows price range filter', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Price/i)).toBeInTheDocument();
  });

  it('displays in stock filter checkbox', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/In Stock|Stock/i)).toBeInTheDocument();
  });

  it('handles category selection', async () => {
    const user = userEvent.setup();
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    
    const electronicsCheckbox = screen.getByLabelText(/Electronics/i) ||
                                screen.getByText(/Electronics/i);
    
    if (electronicsCheckbox.tagName === 'INPUT') {
      await user.click(electronicsCheckbox);
    } else {
      const checkbox = electronicsCheckbox.closest('label')?.querySelector('input');
      if (checkbox) await user.click(checkbox);
    }
    
    expect(mockSetFilters).toHaveBeenCalled();
  });

  it('shows clear all filters button', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    expect(screen.getByText(/Clear All|Reset/i)).toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /Clear All|Reset/i });
    await user.click(clearButton);
    
    expect(mockSetFilters).toHaveBeenCalled();
  });

  it('renders checkboxes for filter options', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('extracts unique values from products', () => {
    render(
      <FilterPanel
        products={mockProducts}
        filters={initialFilters}
        setFilters={mockSetFilters}
      />
    );
    
    // Should show unique categories, brands, colors, sizes
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/Clothing/i)).toBeInTheDocument();
  });
});
