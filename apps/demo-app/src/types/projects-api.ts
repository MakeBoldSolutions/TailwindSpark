/**
 * Projects API Contract
 * 
 * TypeScript types and Zod schemas for Projects JSON API
 * Source: https://markhazleton.com/projects.json
 */

import { z } from 'zod';

/**
 * Project Status
 * Represents the current state of a portfolio project
 */
export type ProjectStatus = 'Active' | 'Completed' | 'Archived';

/**
 * Project Entity (normalized for UI consumption)
 */
export interface Project {
  /** Unique project identifier */
  id: number;
  
  /** Project display name */
  name: string;
  
  /** Short project description (1-2 sentences) */
  description: string;
  
  /** Absolute URL to project screenshot or logo image */
  image_url: string;
  
  /** Absolute URL to live project or GitHub repository */
  project_url: string;
  
  /** Current project status */
  status: ProjectStatus;
  
  /** Technology stack used in the project */
  technologies?: string[];
  
  /** Whether this project should be featured prominently */
  featured?: boolean;
  
  /** Project creation date (ISO 8601 format) */
  created_date?: string;
  
  /** Last updated date (ISO 8601 format) */
  updated_date?: string;
}

/**
 * Raw API Project Schema
 * Matches the actual response from https://markhazleton.com/projects.json
 */
export const RawProjectSchema = z.object({
  id: z.number(),
  p: z.string().min(1),
  d: z.string().min(1),
  h: z.string().url(),
  image: z.string(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  keywords: z.string().optional(),
  promotion: z.object({
    status: z.string().optional(),
  }).optional(),
}).passthrough();

export const RawProjectsResponseSchema = z.array(RawProjectSchema);

/** Map a raw API project to the normalized Project interface */
export function mapRawProject(raw: z.infer<typeof RawProjectSchema>): Project {
  const apiStatus = raw.promotion?.status;
  let status: ProjectStatus = 'Active';
  if (apiStatus === 'Completed' || apiStatus === 'Archived') {
    status = apiStatus;
  } else if (apiStatus === 'Active') {
    status = 'Active';
  }

  const imageBase = 'https://markhazleton.com';
  const imageUrl = raw.image.startsWith('http') ? raw.image : `${imageBase}${raw.image}`;

  return {
    id: raw.id,
    name: raw.p,
    description: raw.d,
    image_url: imageUrl,
    project_url: raw.h,
    status,
  };
}

/**
 * Type inference from Zod schema
 */
export type RawProjectSchemaType = z.infer<typeof RawProjectSchema>;
export type RawProjectsResponseType = z.infer<typeof RawProjectsResponseSchema>;

/**
 * API Response Wrapper
 * For error handling and validation results
 */
export interface ProjectsAPIResponse {
  success: boolean;
  data?: Project[];
  error?: string;
}

/**
 * Projects API Configuration
 */
export const PROJECTS_API_CONFIG = {
  /** Production API endpoint */
  PROD_URL: 'https://markhazleton.com/projects.json',
  
  /** Development proxy endpoint (configured in vite.config.ts) */
  DEV_URL: '/api/projects.json',
  
  /** Fallback local file path (relative to public/) */
  FALLBACK_URL: '/data/projects.json',
  
  /** Cache key for localStorage */
  CACHE_KEY: 'projects_v1',
  
  /** Cache TTL in milliseconds (5 min dev, 1 hour prod) */
  CACHE_TTL: {
    DEV: 5 * 60 * 1000,
    PROD: 60 * 60 * 1000,
  },
} as const;

/**
 * Project Filters
 * Used for client-side filtering in ProjectsPage
 */
export interface ProjectFilters {
  searchTerm?: string;
  status?: ProjectStatus;
  technologies?: string[];
  featured?: boolean;
}

/**
 * Project Sort Options
 */
export type ProjectSortField = 'name' | 'id' | 'created_date' | 'updated_date';
export type ProjectSortOrder = 'asc' | 'desc';

export interface ProjectSort {
  field: ProjectSortField;
  order: ProjectSortOrder;
}

/**
 * Pagination Configuration
 */
export interface ProjectsPagination {
  /** Current page number (1-indexed) */
  currentPage: number;
  
  /** Items per page */
  itemsPerPage: number;
  
  /** Total number of items */
  totalItems: number;
  
  /** Total number of pages */
  totalPages: number;
}

export const PROJECTS_PAGINATION_CONFIG = {
  /** Default items per page */
  DEFAULT_PAGE_SIZE: 6,
  
  /** Available page size options */
  PAGE_SIZE_OPTIONS: [6, 12, 24],
} as const;
