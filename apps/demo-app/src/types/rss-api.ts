/**
 * Articles API Contract
 * 
 * TypeScript types and Zod schemas for Articles JSON API
 * Source: https://markhazleton.com/articles.json
 */

import { z } from 'zod';

/**
 * Article Entity (normalized for UI consumption)
 */
export interface Article {
  /** Unique article identifier */
  id: string;
  
  /** Article title */
  title: string;
  
  /** Article excerpt or summary */
  description: string;
  
  /** Absolute URL to full article */
  link: string;
  
  /** Article category / section */
  category: string;
  
  /** Publication date (ISO 8601 format) */
  pub_date: string;
  
  /** Article author name */
  author?: string;
  
  /** Featured image URL */
  image_url?: string;
  
  /** Article tags/keywords */
  tags?: string[];
}

/**
 * Raw API Article Schema
 * Matches the actual response from https://markhazleton.com/articles.json
 */
export const RawArticleSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string(),
  slug: z.string(),
  Section: z.string().optional(),
  publishedDate: z.string().optional(),
  author: z.string().optional(),
  img_src: z.string().optional(),
  keywords: z.string().optional(),
}).passthrough();

/**
 * Zod schema for the articles collection response.
 */
export const RawArticlesResponseSchema = z.array(RawArticleSchema);

/**
 * Maps a raw feed entry to the normalized article interface.
 *
 * @param raw - Raw article returned by the articles feed
 * @returns Normalized article entity used by the UI
 */
export function mapRawArticle(raw: z.infer<typeof RawArticleSchema>): Article {
  const baseUrl = 'https://markhazleton.com';
  const link = raw.slug.startsWith('http') ? raw.slug : `${baseUrl}/${raw.slug}`;
  const imageUrl = raw.img_src
    ? (raw.img_src.startsWith('http') ? raw.img_src : `${baseUrl}${raw.img_src}`)
    : undefined;

  return {
    id: String(raw.id),
    title: raw.name,
    description: raw.description || raw.name,
    link,
    category: raw.Section || 'Uncategorized',
    pub_date: raw.publishedDate
      ? new Date(raw.publishedDate).toISOString()
      : new Date().toISOString(),
    author: raw.author || undefined,
    image_url: imageUrl,
    tags: raw.keywords ? raw.keywords.split(',').map(k => k.trim()) : undefined,
  };
}

/**
 * API Response Wrapper
 */
export interface ArticlesAPIResponse {
  success: boolean;
  data?: Article[];
  error?: string;
}

/**
 * Articles API Configuration
 */
export const ARTICLES_API_CONFIG = {
  /** Production API endpoint */
  PROD_URL: 'https://markhazleton.com/articles.json',
  
  /** Development proxy endpoint (configured in vite.config.ts) */
  DEV_URL: '/api/articles.json',
  
  /** Fallback local file path (relative to public/) */
  FALLBACK_URL: '/data/articles.json',
  
  /** Cache key for localStorage */
  CACHE_KEY: 'articles_v2',
  
  /** Cache TTL in milliseconds (5 min dev, 1 hour prod) */
  CACHE_TTL: {
    DEV: 5 * 60 * 1000,
    PROD: 60 * 60 * 1000,
  },
} as const;

/**
 * Article Filters
 * Used for client-side filtering in ArticlesPage
 */
export interface ArticleFilters {
  searchTerm?: string;
  category?: string;
  author?: string;
  tags?: string[];
}

/**
 * Article Sort Options
 */
export type ArticleSortField = 'pub_date' | 'title' | 'category';

/**
 * Supported article sort directions.
 */
export type ArticleSortOrder = 'asc' | 'desc';

/**
 * Article sort configuration used by the articles page.
 */
export interface ArticleSort {
  field: ArticleSortField;
  order: ArticleSortOrder;
}

/**
 * Article Category Constants
 * Known categories from ReactSpark feed
 */
export const ARTICLE_CATEGORIES = {
  REACT_SPARK: 'ReactSpark',
  TECHNOLOGY: 'Technology',
  WEB_DEVELOPMENT: 'Web Development',
  TUTORIALS: 'Tutorials',
  NEWS: 'News',
} as const;

/**
 * Union of known article categories.
 */
export type ArticleCategory = typeof ARTICLE_CATEGORIES[keyof typeof ARTICLE_CATEGORIES];

/**
 * Pagination Configuration
 */
export interface ArticlesPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Shared pagination defaults for the articles page.
 */
export const ARTICLES_PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 6,
  PAGE_SIZE_OPTIONS: [6, 12, 24],
} as const;

/**
 * RSS Parser Helper Types
 */
export interface RSSParseOptions {
  /** Whether to extract image from content:encoded HTML */
  extractImageFromContent?: boolean;
  
  /** Whether to extract tags from categories */
  extractTags?: boolean;
  
  /** Transform function for article titles */
  transformTitle?: (title: string) => string;
}

/**
 * RSS Parser Result
 */
export interface RSSParseResult {
  channel: {
    title: string;
    description: string;
    link: string;
  };
  articles: Article[];
}
