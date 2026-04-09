import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EcommerceLayout from '../components/EcommerceLayout';
import FilterPanel from '../components/FilterPanel';
import ProductGrid from '../components/ProductGrid';
import QuickViewModal from '../components/QuickViewModal';
import { MOCK_PRODUCTS } from '../data/ecommerce-data';
import type { CartItem, FilterState, Product } from '../types/ecommerce';

/**
 * E-commerce product catalog page with filtering and cart functionality.
 * 
 * Complete online store experience with product grid, advanced filtering,
 * search, quick view modal, and shopping cart integration.
 * 
 * @returns E-commerce page component
 * 
 * @example
 * ```tsx
 * <EcommercePage />
 * ```
 */
const EcommercePage: React.FC = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, 500],
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const productsPerPage = 8;

  // Filter and search products using useMemo instead of useEffect
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category));
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some((color: string) => filters.colors.includes(color))
      );
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some((size: string) => filters.sizes.includes(size))
      );
    }

    // Apply price range
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  }, [products, filters, searchQuery, sortBy]);

  // Reset current page when filters change - using a wrapper function
  const handleFiltersChange = (newFilters: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchQueryChange = (query: string | ((prev: string) => string)) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortByChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product, selectedColor?: string, selectedSize?: string) => {
    const existingItem = cart.find(
      item =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingItem) {
      setCart(
        cart.map(item =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.image,
          selectedColor: selectedColor || product.colors[0],
          selectedSize: selectedSize || product.sizes[0],
          quantity: 1,
        },
      ]);
    }
  };

  const handleWishlistToggle = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <EcommerceLayout
      cart={cart}
      setCart={setCart}
      searchQuery={searchQuery}
      setSearchQuery={handleSearchQueryChange}
    >
      <div className="min-h-screen bg-surface-alt">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <Link to="/demos" className="font-medium text-brand hover:text-brand-hover">
                      ← Back to Demos Overview
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-text-muted"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Link to="/ecommerce" className="ml-2 text-muted hover:text-text">
                      Home
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-muted"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 font-medium text-text">Products</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text">All Products</h1>
                <p className="mt-2 text-muted">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + productsPerPage, filteredProducts.length)} of{' '}
                  {filteredProducts.length} results
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-4">
                <label htmlFor="sort" className="text-sm font-medium text-text">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={e => handleSortByChange(e.target.value)}
                  className="rounded-md border bg-surface px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filter Panel */}
            <div className="w-64 flex-shrink-0">
              <FilterPanel products={products} filters={filters} setFilters={handleFiltersChange} />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <ProductGrid
                products={currentProducts}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                wishlist={wishlist}
                onQuickView={setQuickViewProduct}
                isLoading={false}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-between border-t border bg-surface px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-text">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(startIndex + productsPerPage, filteredProducts.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredProducts.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        {/* Previous button */}
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted ring-1 ring-inset ring-border hover:bg-surface-alt focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              page === currentPage
                                ? 'z-10 bg-brand text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
                                : 'text-text ring-1 ring-inset ring-border hover:bg-surface-alt focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Next button */}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted ring-1 ring-inset ring-border hover:bg-surface-alt focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
          isInWishlist={wishlist.includes(quickViewProduct.id)}
        />
      )}
    </EcommerceLayout>
  );
};

export default EcommercePage;
