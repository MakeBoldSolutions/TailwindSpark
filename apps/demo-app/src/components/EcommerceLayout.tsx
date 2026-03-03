import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../types/ecommerce';
import { Logo } from './Logo';

/**
 * E-commerce layout component properties.
 */
interface EcommerceLayoutProps {
  /**
   * Child elements to render within the e-commerce layout.
   */
  children: React.ReactNode;
  /**
   * Current shopping cart items.
   */
  cart: CartItem[];
  /**
   * Function to update the shopping cart state.
   */
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  /**
   * Current search query string.
   */
  searchQuery: string;
  /**
   * Function to update the search query.
   */
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * E-commerce store layout with navigation, cart, and search functionality.
 * 
 * Provides complete shopping experience with category navigation, cart preview,
 * and product search. Includes mobile-responsive design and cart management.
 * 
 * @param root0 - Component props
 * @param root0.children - Child elements to render within the e-commerce layout
 * @param root0.cart - Current shopping cart items
 * @param root0.setCart - Function to update the shopping cart state
 * @param root0.searchQuery - Current search query string
 * @param root0.setSearchQuery - Function to update the search query
 * @returns E-commerce layout component
 * 
 * @example
 * ```tsx
 * <EcommerceLayout 
 *   cart={cart} 
 *   setCart={setCart}
 *   searchQuery={query}
 *   setSearchQuery={setQuery}
 * >
 *   <ProductCatalog />
 * </EcommerceLayout>
 * ```
 */
const EcommerceLayout: React.FC<EcommerceLayoutProps> = ({
  children,
  cart,
  setCart,
  searchQuery,
  setSearchQuery,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateCartItemQuantity = (id: number, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(
        cart.filter(
          item => !(item.id === id && item.selectedColor === color && item.selectedSize === size)
        )
      );
    } else {
      setCart(
        cart.map(item =>
          item.id === id && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const categories = [
    { name: 'Electronics', href: '/ecommerce' },
    { name: 'Clothing', href: '/ecommerce' },
    { name: 'Footwear', href: '/ecommerce' },
    { name: 'Accessories', href: '/ecommerce' },
    { name: 'Home & Garden', href: '/ecommerce' },
    { name: 'Sports', href: '/ecommerce' },
  ];

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsCartOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Navigation */}
      <header className="relative z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/ecommerce">
                  <Logo size="md" />
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {categories.map(category => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-alt/80 hover:text-text"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mx-8 max-w-lg flex-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border border-border bg-surface py-2 pl-10 pr-3 leading-5 placeholder-text-muted focus:border-focus-ring focus:placeholder-text-muted/70 focus:outline-none focus:ring-1 focus:ring-focus-ring sm:text-sm"
                  placeholder="Search products..."
                />
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <button
                className="rounded-full p-2 text-text transition-colors hover:bg-surface-alt hover:text-brand"
                title="View wishlist"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Account */}
              <button
                className="rounded-full p-2 text-text transition-colors hover:bg-surface-alt hover:text-brand"
                title="Account settings"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full p-2 text-text transition-colors hover:bg-surface-alt hover:text-brand"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5v6a2 2 0 002 2h2a2 2 0 002-2v-6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v4"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full p-2 text-text transition-colors hover:bg-surface-alt hover:text-brand md:hidden"
                title="Toggle mobile menu"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 border-t border-border bg-surface px-2 pb-3 pt-2 sm:px-3">
                {categories.map(category => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-text transition-colors hover:bg-surface-alt hover:text-text"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setIsCartOpen(false)}
            />
            <section className="absolute right-0 top-0 h-full w-full max-w-md transform transition-transform">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-text">Shopping cart</h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="-m-2 p-2 text-text-muted hover:text-text"
                        onClick={() => setIsCartOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      {cart.length === 0 ? (
                        <div className="py-12 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-text-muted"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-text">
                            Your cart is empty
                          </h3>
                          <p className="mt-1 text-sm text-text-muted">
                            Start adding some items to your cart!
                          </p>
                        </div>
                      ) : (
                        <ul className="-my-6 divide-y divide-border">
                          {cart.map(item => (
                            <li
                              key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                              className="flex py-6"
                            >
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-text">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                  <p className="mt-1 text-sm text-text-muted">
                                    {item.selectedColor} • {item.selectedSize}
                                  </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        updateCartItemQuantity(
                                          item.id,
                                          item.selectedColor,
                                          item.selectedSize,
                                          item.quantity - 1
                                        )
                                      }
                                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-surface-alt"
                                    >
                                      -
                                    </button>
                                    <span className="text-text-muted">Qty {item.quantity}</span>
                                    <button
                                      onClick={() =>
                                        updateCartItemQuantity(
                                          item.id,
                                          item.selectedColor,
                                          item.selectedSize,
                                          item.quantity + 1
                                        )
                                      }
                                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-surface-alt"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <div className="flex">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateCartItemQuantity(
                                          item.id,
                                          item.selectedColor,
                                          item.selectedSize,
                                          0
                                        )
                                      }
                                      className="font-medium text-brand hover:text-brand-hover"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-border px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-text">
                      <p>Subtotal</p>
                      <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-text-muted">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-brand px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-hover">
                        Checkout
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-text-muted">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="font-medium text-brand hover:text-brand-hover"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default EcommerceLayout;
