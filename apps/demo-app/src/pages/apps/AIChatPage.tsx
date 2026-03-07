import { useEffect, useMemo, useState, type FC } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useVariants } from '../../hooks/useVariants';
import ChatInterface from '../../sections/ChatInterface';
import VariantCard from '../../sections/VariantCard';
import type { AIVariant } from '../../types/chat-api';
import { sanitizeInput } from '../../utils/sanitize';

/**
 * Renders the AI chat app landing page and variant browser.
 *
 * @returns AI chat app page
 */
const AIChatPage: FC = (): React.JSX.Element => {
  const { setSEO } = useSEO();
  const {
    categories,
    loading,
    error,
    filterByCategory,
    searchVariants,
    filteredVariants,
  } = useVariants();
  const [selectedVariant, setSelectedVariant] = useState<AIVariant | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);

  useEffect(() => {
    setSEO({
      title: 'AI Chat - TailwindSpark',
      description: 'Chat with AI variants powered by PromptSpark in real-time.',
    });
  }, [setSEO]);

  const handleCategoryChange = (cat: string | null) => {
    setCatFilter(cat);
    filterByCategory(cat);
  };

  const handleSearchChange = (term: string) => {
    setSearch(term);
    searchVariants(term);
  };

  // Featured variants: top 3 by most recent update
  const featuredVariants = useMemo(() => {
    return [...filteredVariants]
      .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
      .slice(0, 3);
  }, [filteredVariants]);

  const featuredIds = useMemo(() => new Set(featuredVariants.map(v => v.definitionId)), [featuredVariants]);

  // Group remaining by category
  const variantsByCategory = useMemo(() => {
    const remaining = filteredVariants.filter(v => !featuredIds.has(v.definitionId));
    const grouped: Record<string, AIVariant[]> = {};
    for (const v of remaining) {
      const cat = v.definitionType || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(v);
    }
    return grouped;
  }, [filteredVariants, featuredIds]);

  // Chat view when variant is selected
  if (selectedVariant) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ChatInterface
          variant={selectedVariant}
          onBack={() => setSelectedVariant(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-text">AI Chat</h1>
        <p className="text-text-muted">
          Select an AI variant to start chatting — powered by PromptSpark
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={e => handleSearchChange(sanitizeInput(e.target.value))}
          placeholder="Search variants..."
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          aria-label="Search AI variants"
        />
        <select
          value={catFilter ?? ''}
          onChange={e =>
            handleCategoryChange(
              e.target.value ? e.target.value : null,
            )
          }
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : filteredVariants.length === 0 ? (
        <p className="py-12 text-center text-text-muted">
          No variants found. Try adjusting your filters.
        </p>
      ) : (
        <>
          {/* Featured Variants */}
          {featuredVariants.length > 0 && !catFilter && !search && (
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold text-text">⭐ Featured Variants</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredVariants.map(variant => (
                  <VariantCard
                    key={variant.definitionId}
                    variant={variant}
                    isSelected={false}
                    onSelect={setSelectedVariant}
                    isFeatured
                  />
                ))}
              </div>
            </section>
          )}

          {/* Variants by Category */}
          {Object.entries(variantsByCategory).map(([category, variants]) => (
            <section key={category} className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-text">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {variants.map(variant => (
                  <VariantCard
                    key={variant.definitionId}
                    variant={variant}
                    isSelected={false}
                    onSelect={setSelectedVariant}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
};

export default AIChatPage;
