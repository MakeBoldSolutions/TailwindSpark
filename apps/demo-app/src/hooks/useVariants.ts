import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVariants } from '../services/variants.service';
import type { AIVariant } from '../types/chat-api';

interface UseVariantsReturn {
  variants: AIVariant[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filterByCategory: (category: string | null) => void;
  searchVariants: (term: string) => void;
  filteredVariants: AIVariant[];
}

/**
 * Loads AI variants and exposes derived filters for the chat UI.
 *
 * @returns Variant data, filters, and loading state
 */
export function useVariants(): UseVariantsReturn {
  const [variants, setVariants] = useState<AIVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;
    getVariants()
      .then(data => {
        if (!cancelled) setVariants(data);
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load variants.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(
    () => [...new Set(variants.map(v => v.definitionType))],
    [variants],
  );

  const filteredVariants = useMemo(() => {
    let result = variants;
    if (categoryFilter) result = result.filter(v => v.definitionType === categoryFilter);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        v =>
          v.name.toLowerCase().includes(lower) ||
          v.description.toLowerCase().includes(lower) ||
          v.definitionType.toLowerCase().includes(lower),
      );
    }
    return result;
  }, [variants, categoryFilter, searchTerm]);

  const filterByCategory = useCallback((cat: string | null) => setCategoryFilter(cat), []);
  const searchVariants = useCallback((term: string) => setSearchTerm(term), []);

  return { variants, categories, loading, error, filterByCategory, searchVariants, filteredVariants };
}
