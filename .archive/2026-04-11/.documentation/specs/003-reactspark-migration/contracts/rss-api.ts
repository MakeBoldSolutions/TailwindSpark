/**
 * RSS Feed API Contract
 * 
 * TypeScript types and Zod schemas for ReactSpark RSS XML feed
 * Source: https://reactspark.com/rss.xml
 */

import { z } from 'zod';

/**
 * Article Entity
 * Represents a single blog article from RSS feed
 */
export interface Article {
  /** Unique article identifier (GUID from RSS) */
  id: string;
  
  /** Article title */
  title: string;
  
  /** Article excerpt or summary */
  description: string;
  
  /** Absolute URL to full article */
  link: string;
  
  /** Article category (e.g., "ReactSpark", "Technology") */
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
 * Zod Schema for Article
 * Validates parsed RSS item data at runtime
 */
export const ArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  link: z.string().url(),
  category: z.string().min(1),
  pub_date: z.string().datetime(),
  author: z.string().max(100).optional(),
  image_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Zod Schema for Articles Array Response
 */
export const ArticlesResponseSchema = z.array(ArticleSchema);

/**
 * Type inference from Zod schema
 */
export type ArticleSchemaType = z.infer<typeof ArticleSchema>;
export type ArticlesResponseType = z.infer<typeof ArticlesResponseSchema>;

/**
 * RSS XML Structure (Before Parsing)
 * Raw RSS feed structure for XML parsing
 */
export interface RSSChannel {
  title: string;
  description: string;
  link: string;
  language?: string;
  lastBuildDate?: string;
  items: RSSItem[];
}

export interface RSSItem {
  guid: string;
  title: string;
  description: string;
  link: string;
  category?: string | string[];
  pubDate: string;
  author?: string;
  'media:content'?: {
    '@_url': string;
  };
  'content:encoded'?: string;
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
 * RSS API Configuration
 */
export const RSS_API_CONFIG = {
  /** Production RSS feed URL */
  PROD_URL: 'https://reactspark.com/rss.xml',
  
  /** Development proxy endpoint (configured in vite.config.ts) */
  DEV_URL: '/api/rss.xml',
  
  /** Fallback local file path (relative to public/) */
  FALLBACK_URL: '/data/rss.xml',
  
  /** Cache key for localStorage */
  CACHE_KEY: 'articles_v1',
  
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
export type ArticleSortOrder = 'asc' | 'desc';

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
