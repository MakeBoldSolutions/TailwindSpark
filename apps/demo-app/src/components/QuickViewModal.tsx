import React, { useState } from 'react';
import type { Product } from '../types/ecommerce';

/**
 * Quick view modal component properties.
 */
interface QuickViewModalProps {
  /**
   * Product to display in the modal.
   */
  product: Product;
  /**
   * Callback to close the modal.
   */
  onClose: () => void;
  /**
   * Callback when adding product to cart.
   */
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  /**
   * Callback to toggle product wishlist status.
   */
  onWishlistToggle: (productId: number) => void;
  /**
   * Whether the product is currently in the wishlist.
   */
  isInWishlist: boolean;
}

/**
 * Product quick view modal with image gallery, options, and cart actions.
 * 
 * Displays product details, color/size selection, quantity picker, and reviews
 * in a modal overlay without leaving the current page.
 * 
 * @param root0 - Component props
 * @param root0.product - Product to display in the modal
 * @param root0.onClose - Callback to close the modal
 * @param root0.onAddToCart - Callback when adding product to cart
 * @param root0.onWishlistToggle - Callback to toggle product wishlist status
 * @param root0.isInWishlist - Whether the product is currently in the wishlist
 * @returns Quick view modal component
 * 
 * @example
 * ```tsx
 * <QuickViewModal
 *   product={selectedProduct}
 *   onClose={() => setSelectedProduct(null)}
 *   onAddToCart={handleAddToCart}
 *   onWishlistToggle={handleWishlistToggle}
 *   isInWishlist={wishlist.includes(product.id)}
 * />
 * ```
 */
const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onWishlistToggle,
  isInWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedColor, selectedSize);
    }
    onClose();
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      black: 'bg-black',
      white: 'bg-white border-2 border-gray-300',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      navy: 'bg-blue-900',
      gray: 'bg-gray-500',
      silver: 'bg-gray-400',
      brown: 'bg-amber-800',
      tan: 'bg-amber-600',
      pink: 'bg-pink-500',
      'rose gold': 'bg-rose-400',
      'light blue': 'bg-blue-300',
      'dark blue': 'bg-blue-800',
    };

    return colorMap[color.toLowerCase()] || 'bg-gray-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-surface">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-2xl font-bold text-text">Quick View</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-text-muted hover:text-text"
            title="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-surface-alt">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-80 w-full object-cover object-center"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedImage(product.image)}
                    className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                      selectedImage === product.image ? 'border-brand' : 'border-border'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  {product.images.slice(1).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                        selectedImage === image ? 'border-brand' : 'border-border'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-text">{product.name}</h1>
                <p className="mt-2 text-lg text-text-muted">{product.brand}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">${product.salePrice}</span>
                    <span className="text-xl text-gray-500 line-through">${product.price}</span>
                    <span className="rounded bg-red-100 px-2 py-1 text-sm font-semibold text-red-800">
                      Save ${(product.price - product.salePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Key Features</h3>
                <ul className="list-inside list-disc space-y-1 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Color Selection */}
              {product.colors.length > 1 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Color</h3>
                  <div className="flex space-x-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full ${getColorClass(color)} ${
                          selectedColor === color
                            ? 'ring-2 ring-brand ring-offset-2'
                            : 'ring-1 ring-gray-300'
                        } transition-all duration-200`}
                        title={color}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Selected: {selectedColor}</p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes.length > 1 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xl font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                {product.stockCount <= 10 && (
                  <p className="mt-2 text-sm text-orange-600">
                    Only {product.stockCount} left in stock!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 rounded-md px-6 py-3 font-medium transition-colors ${
                    product.inStock
                      ? 'bg-brand text-brand-fg hover:bg-brand-hover'
                      : 'cursor-not-allowed bg-gray-300 text-gray-500'
                  }`}
                >
                  {product.inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
                </button>

                <button
                  onClick={() => onWishlistToggle(product.id)}
                  className={`rounded-md border p-3 transition-colors ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg
                    className="h-6 w-6"
                    fill={isInWishlist ? 'currentColor' : 'none'}
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
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`h-3 w-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span
                  className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}
                >
                  {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
