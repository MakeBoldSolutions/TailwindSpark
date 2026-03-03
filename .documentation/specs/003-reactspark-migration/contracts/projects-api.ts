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
 * Project Entity
 * Represents a single portfolio project with metadata
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
 * Zod Schema for Project
 * Validates incoming API data at runtime
 */
export const ProjectSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  image_url: z.string().url(),
  project_url: z.string().url(),
  status: z.enum(['Active', 'Completed', 'Archived']),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  created_date: z.string().datetime().optional(),
  updated_date: z.string().datetime().optional(),
});

/**
 * Zod Schema for Projects Array Response
 * Validates the full API response
 */
export const ProjectsResponseSchema = z.array(ProjectSchema);

/**
 * Type inference from Zod schema
 * Ensures TypeScript type matches Zod validation
 */
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
export type ProjectsResponseType = z.infer<typeof ProjectsResponseSchema>;

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
