/**
 * Product data structure for e-commerce displays.
 */
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
}

/**
 * Filter state for product filtering.
 */
export interface FilterState {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

/**
 * Shopping cart item data structure.
 */
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

/**
 * User account information.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}
