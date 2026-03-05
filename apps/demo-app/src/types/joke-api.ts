/**
 * JokeAPI Contract
 * 
 * TypeScript types and Zod schemas for JokeAPI (v2.jokeapi.dev)
 * Source: https://v2.jokeapi.dev/joke/Programming
 */

import { z } from 'zod';

/**
 * Joke Type
 * Determines the structure of the joke content
 */
export type JokeType = 'single' | 'twopart';

/**
 * Content Safety Flags
 * Flags for potentially sensitive content
 */
export interface JokeFlags {
  nsfw: boolean;
  religious: boolean;
  political: boolean;
  racist: boolean;
  sexist: boolean;
  explicit: boolean;
}

/**
 * Single-Line Joke
 * Joke with one complete joke field
 */
export interface SingleJoke {
  id: number;
  type: 'single';
  joke: string;
  category: string;
  safe: boolean;
  flags: JokeFlags;
  lang?: string;
}

/**
 * Two-Part Joke
 * Joke with setup and delivery (punchline)
 */
export interface TwoPartJoke {
  id: number;
  type: 'twopart';
  setup: string;
  delivery: string;
  category: string;
  safe: boolean;
  flags: JokeFlags;
  lang?: string;
}

/**
 * Joke Union Type
 * Either single or two-part joke
 */
export type Joke = SingleJoke | TwoPartJoke;

/**
 * Joke History
 * User's browsing history of viewed jokes
 */
export interface JokeHistory {
  /** Array of previously viewed jokes */
  jokes: Joke[];
  
  /** Maximum history size */
  maxSize: number;
  
  /** Last updated timestamp (ISO string) */
  lastUpdated: string;
}

/**
 * Zod Schema for Joke Flags
 */
const JokeFlagsSchema = z.object({
  nsfw: z.boolean(),
  religious: z.boolean(),
  political: z.boolean(),
  racist: z.boolean(),
  sexist: z.boolean(),
  explicit: z.boolean(),
});

/**
 * Zod Schema for Joke (Discriminated Union)
 * Validates joke structure based on type field
 */
export const JokeSchema = z.discriminatedUnion('type', [
  // Single-line joke schema
  z.object({
    id: z.number().int().positive(),
    type: z.literal('single'),
    joke: z.string().min(1),
    category: z.string(),
    safe: z.boolean(),
    flags: JokeFlagsSchema,
    lang: z.string().optional(),
  }),
  // Two-part joke schema
  z.object({
    id: z.number().int().positive(),
    type: z.literal('twopart'),
    setup: z.string().min(1),
    delivery: z.string().min(1),
    category: z.string(),
    safe: z.boolean(),
    flags: JokeFlagsSchema,
    lang: z.string().optional(),
  }),
]);

/**
 * Zod Schema for Joke History
 */
export const JokeHistorySchema = z.object({
  jokes: z.array(JokeSchema).max(10),
  maxSize: z.number().int().positive().default(10),
  lastUpdated: z.string().datetime(),
});

/**
 * Type inference from Zod schema
 */
export type JokeSchemaType = z.infer<typeof JokeSchema>;

/**
 * API Response (Success)
 */
export interface JokeAPISuccessResponse {
  error: false;
  joke?: string;
  setup?: string;
  delivery?: string;
  id: number;
  type: JokeType;
  category: string;
  safe: boolean;
  flags: JokeFlags;
  lang?: string;
}

/**
 * API Response (Error)
 */
export interface JokeAPIErrorResponse {
  error: true;
  internalError: boolean;
  code: number;
  message: string;
  causedBy: string[];
  additionalInfo: string;
  timestamp: number;
}

/**
 * API Response Union
 */
export type JokeAPIResponse = JokeAPISuccessResponse | JokeAPIErrorResponse;

/**
 * JokeAPI Configuration
 */
export const JOKE_API_CONFIG = {
  /** Base API URL */
  BASE_URL: 'https://v2.jokeapi.dev',
  
  /** Jokes endpoint */
  JOKES_ENDPOINT: '/joke/Programming',
  
  /** Full API URL */
  FULL_URL: 'https://v2.jokeapi.dev/joke/Programming',
  
  /** API parameters */
  PARAMS: {
    /** Only safe jokes (no NSFW content) */
    safe: true,
    
    /** Response format */
    format: 'json',
    
    /** Language */
    lang: 'en',
  },
  
  /** Fallback hardcoded joke (when API fails) */
  FALLBACK_JOKE: {
    id: 0,
    type: 'single' as const,
    joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
    category: 'Programming',
    safe: true,
    flags: {
      nsfw: false,
      religious: false,
      political: false,
      racist: false,
      sexist: false,
      explicit: false,
    },
  },
} as const;

/**
 * Saved Jokes Configuration
 */
export const SAVED_JOKES_CONFIG = {
  /** localStorage key for saved jokes */
  STORAGE_KEY: 'saved_jokes',
  
  /** localStorage key for liked joke IDs */
  LIKED_KEY: 'liked_jokes',
  
  /** localStorage key for joke history */
  HISTORY_KEY: 'joke_history',
  
  /** Maximum number of saved jokes */
  MAX_SAVED: 100,
  
  /** Maximum history size */
  MAX_HISTORY: 10,
} as const;

/**
 * Joke Display Helpers
 */

/**
 * Get joke text for display
 */
export function getJokeText(joke: Joke): string {
  if (joke.type === 'single') {
    return joke.joke;
  }
  return `${joke.setup}\n\n${joke.delivery}`;
}

/**
 * Check if joke is safe for all audiences
 */
export function isJokeSafe(joke: Joke): boolean {
  const { flags } = joke;
  return !Object.values(flags).some(flag => flag === true);
}

/**
 * Format joke for sharing (Web Share API)
 */
export interface ShareJokeParams {
  title?: string;
  text: string;
  url?: string;
}

export function formatJokeForSharing(joke: Joke): ShareJokeParams {
  const text = getJokeText(joke);
  return {
    title: 'Programming Joke',
    text: `${text}\n\n#ProgrammingHumor`,
    url: window.location.href,
  };
}

/**
 * Joke Statistics (for analytics)
 */
export interface JokeStats {
  totalFetched: number;
  totalLiked: number;
  totalSaved: number;
  favoriteCategory: string;
  safeJokesPercentage: number;
}
