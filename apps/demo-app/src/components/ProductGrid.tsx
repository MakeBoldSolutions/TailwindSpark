import React, { useState } from 'react';
import type { Product } from '../types/ecommerce';

/**
 * Product grid component properties.
 */
interface ProductGridProps {
  /**
   * Array of products to display.
   */
  products: Product[];
  /**
   * Callback when adding product to cart.
   */
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  /**
   * Callback to toggle product wishlist status.
   */
  onWishlistToggle: (productId: number) => void;
  /**
   * Array of product IDs currently in the wishlist.
   */
  wishlist: number[];
  /**
   * Callback to open quick view modal for a product.
   */
  onQuickView: (product: Product) => void;
  /**
   * Loading state indicator.
   */
  isLoading: boolean;
}

/**
 * Responsive product grid with cards, images, and interactive actions.
 *
 * Displays products in a responsive grid with hover effects, wishlist toggle,
 * quick view, and add to cart functionality. Includes loading skeletons and
 * empty state handling.
 *
 * @param root0 - Component props
 * @param root0.products - Array of products to display
 * @param root0.onAddToCart - Callback when adding product to cart
 * @param root0.onWishlistToggle - Callback to toggle product wishlist status
 * @param root0.wishlist - Array of product IDs currently in the wishlist
 * @param root0.onQuickView - Callback to open quick view modal for a product
 * @param root0.isLoading - Loading state indicator
 * @returns Product grid component
 *
 * @example
 * ```tsx
 * <ProductGrid
 *   products={filteredProducts}
 *   onAddToCart={handleAddToCart}
 *   onWishlistToggle={handleWishlistToggle}
 *   wishlist={wishlist}
 *   onQuickView={handleQuickView}
 *   isLoading={loading}
 * />
 * ```
 */
const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onWishlistToggle,
  wishlist,
  onQuickView,
  isLoading,
}) => {
  const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});

  const handleImageLoad = (productId: number) => {
    setImageLoadStates(prev => ({ ...prev, [productId]: true }));
  };

  const ProductSkeleton = () => (
    <div className="group animate-pulse overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="bg-surface-alt aspect-[4/3]">
        <div className="bg-surface-alt h-48 w-full"></div>
      </div>
      <div className="p-4">
        <div className="bg-surface-alt mb-2 h-4 rounded"></div>
        <div className="bg-surface-alt mb-2 h-3 w-2/3 rounded"></div>
        <div className="flex items-center justify-between">
          <div className="bg-surface-alt h-6 w-1/3 rounded"></div>
          <div className="bg-surface-alt h-8 w-1/4 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="text-muted mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-text mt-4 text-lg font-medium">No products found</h3>
        <p className="text-muted mt-2">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
        >
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {!imageLoadStates[product.id] && (
              <div className="bg-surface-alt absolute inset-0 animate-pulse"></div>
            )}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <img
              src={product.image}
              alt={product.name}
              className={`h-48 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
                imageLoadStates[product.id] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(product.id)}
            />

            {/* Sale Badge */}
            {product.salePrice && (
              <div className="bg-error absolute top-2 left-2 rounded px-2 py-1 text-xs font-semibold text-white">
                SALE
              </div>
            )}

            {/* Stock Badge */}
            {!product.inStock && (
              <div className="bg-surface-inverse absolute top-2 right-2 rounded px-2 py-1 text-xs font-semibold text-white">
                OUT OF STOCK
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => onWishlistToggle(product.id)}
              aria-label={
                wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'
              }
              className="absolute top-2 right-2 transform rounded-full bg-white p-2 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 hover:scale-110"
              title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                className={`h-5 w-5 ${
                  wishlist.includes(product.id) ? 'text-error fill-current' : 'text-muted'
                }`}
                fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Quick View Button */}
            <button
              onClick={() => onQuickView(product)}
              className="bg-opacity-75 hover:bg-opacity-90 absolute inset-x-0 bottom-0 bg-black py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              Quick View
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-text group-hover:text-brand line-clamp-2 text-sm font-medium transition-colors">
                {product.name}
              </h3>
              <p className="text-muted text-sm">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="mb-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'text-warning' : 'text-border'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-muted ml-1 text-sm">({product.reviewCount})</span>
            </div>

            {/* Colors */}
            {/* Product color swatches represent actual physical product colors, not UI theme colors */}
            {/* eslint-disable no-raw-primary-class/no-raw-primary-class */}
            <div className="mb-3 flex items-center space-x-1">
              {product.colors.slice(0, 4).map(color => (
                <div
                  key={color}
                  className={`h-4 w-4 rounded-full border ${
                    color.toLowerCase() === 'black'
                      ? 'bg-black'
                      : color.toLowerCase() === 'white'
                        ? 'bg-white'
                        : color.toLowerCase() === 'red'
                          ? 'bg-red-500'
                          : color.toLowerCase() === 'blue'
                            ? 'bg-blue-500'
                            : color.toLowerCase() === 'navy'
                              ? 'bg-blue-900'
                              : color.toLowerCase() === 'gray'
                                ? 'bg-gray-500'
                                : color.toLowerCase() === 'silver'
                                  ? 'bg-gray-400'
                                  : color.toLowerCase() === 'brown'
                                    ? 'bg-amber-800'
                                    : color.toLowerCase() === 'tan'
                                      ? 'bg-amber-600'
                                      : color.toLowerCase() === 'pink'
                                        ? 'bg-pink-500'
                                        : color.toLowerCase() === 'rose gold'
                                          ? 'bg-rose-400'
                                          : color.toLowerCase() === 'light blue'
                                            ? 'bg-blue-300'
                                            : color.toLowerCase() === 'blue dark'
                                              ? 'bg-blue-800'
                                              : 'bg-gray-300'
                  }`}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-muted text-xs">+{product.colors.length - 4}</span>
              )}
            </div>
            {/* eslint-enable no-raw-primary-class/no-raw-primary-class */}

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {product.salePrice ? (
                  <>
                    <span className="text-error text-lg font-bold">${product.salePrice}</span>
                    <span className="text-muted text-sm line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-text text-lg font-bold">${product.price}</span>
                )}
              </div>

              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  product.inStock
                    ? 'bg-brand text-brand-fg hover:bg-brand-hover'
                    : 'bg-border text-muted cursor-not-allowed'
                }`}
                title={product.inStock ? 'Add to cart' : 'Out of stock'}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Stock Count */}
            {product.inStock && product.stockCount <= 10 && (
              <p className="text-warning mt-2 text-xs">Only {product.stockCount} left in stock!</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
