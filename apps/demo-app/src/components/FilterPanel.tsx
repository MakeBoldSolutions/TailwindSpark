import React from 'react';
import type { FilterState, Product } from '../types/ecommerce';

/**
 * Filter panel component properties.
 */
interface FilterPanelProps {
  /**
   * Complete product list for extracting filter options.
   */
  products: Product[];
  /**
   * Current filter state.
   */
  filters: FilterState;
  /**
   * Function to update filter state.
   */
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

/**
 * Product filtering panel with multiple filter types.
 * 
 * Provides category, brand, color, size, and price range filtering
 * with clear all functionality. Automatically extracts unique values from products.
 * 
 * @param root0 - Component props
 * @param root0.products - Complete product list for extracting filter options
 * @param root0.filters - Current filter state
 * @param root0.setFilters - Function to update filter state
 * @returns Filter panel component
 * 
 * @example
 * ```tsx
 * <FilterPanel
 *   products={allProducts}
 *   filters={filters}
 *   setFilters={setFilters}
 * />
 * ```
 */
const FilterPanel: React.FC<FilterPanelProps> = ({ products, filters, setFilters }) => {
  // Extract unique values from products
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];
  const colors = [...new Set(products.flatMap(p => p.colors))];
  const sizes = [...new Set(products.flatMap(p => p.sizes))];

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: string | boolean | [number, number]
  ) => {
    setFilters(prev => {
      if (filterType === 'priceRange') {
        return { ...prev, [filterType]: value as [number, number] };
      }
      if (filterType === 'inStockOnly') {
        return { ...prev, [filterType]: value as boolean };
      }

      const currentValues = prev[filterType] as string[];
      const stringValue = value as string;

      const newValues = currentValues.includes(stringValue)
        ? currentValues.filter(v => v !== stringValue)
        : [...currentValues, stringValue];

      return { ...prev, [filterType]: newValues };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: [0, 500],
      inStockOnly: false,
    });
  };

  return (
    <div className="sticky top-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Category</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleFilterChange('categories', category)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Brand</h4>
            <div className="space-y-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleFilterChange('brands', brand)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Price Range</h4>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="500"
                value={filters.priceRange[1]}
                onChange={e =>
                  handleFilterChange('priceRange', [
                    filters.priceRange[0],
                    parseInt(e.target.value),
                  ])
                }
                className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                aria-label="Maximum price"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Color</h4>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleFilterChange('colors', color)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    filters.colors.includes(color)
                      ? 'border-indigo-300 bg-indigo-100 text-indigo-800'
                      : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleFilterChange('sizes', size)}
                  className={`rounded border px-3 py-1 text-xs transition-colors ${
                    filters.sizes.includes(size)
                      ? 'border-indigo-300 bg-indigo-100 text-indigo-800'
                      : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={e => handleFilterChange('inStockOnly', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">In stock only</span>
            </label>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.categories.length > 0 ||
          filters.brands.length > 0 ||
          filters.colors.length > 0 ||
          filters.sizes.length > 0 ||
          filters.inStockOnly) && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="mb-3 text-sm font-medium text-gray-900">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map(category => (
                <span
                  key={`category-${category}`}
                  className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
                >
                  Category: {category}
                  <button
                    onClick={() => handleFilterChange('categories', category)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.brands.map(brand => (
                <span
                  key={`brand-${brand}`}
                  className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
                >
                  Brand: {brand}
                  <button
                    onClick={() => handleFilterChange('brands', brand)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.colors.map(color => (
                <span
                  key={`color-${color}`}
                  className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
                >
                  Color: {color}
                  <button
                    onClick={() => handleFilterChange('colors', color)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.sizes.map(size => (
                <span
                  key={`size-${size}`}
                  className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
                >
                  Size: {size}
                  <button
                    onClick={() => handleFilterChange('sizes', size)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.inStockOnly && (
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                  In Stock Only
                  <button
                    onClick={() => handleFilterChange('inStockOnly', false)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
