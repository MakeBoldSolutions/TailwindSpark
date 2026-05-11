/**
 * AI Chat API Contract
 * 
 * TypeScript types and Zod schemas for PromptSpark AI Variants and SignalR Chat
 * Sources:
 * - PromptSpark Variants API
 * - SignalR Chat Hub (real-time messaging)
 */

import { z } from 'zod';
import { normalizeUserText } from '../utils/sanitize';

/**
 * AI Variant Entity
 * Represents an AI assistant variant/persona from the PromptSpark API
 * Source: https://web.makeboldspark.com/api/PromptSpark/Variant
 */
export interface AIVariant {
  /** Unique variant identifier */
  definitionId: number;

  /** Variant display name */
  name: string;

  /** Variant description/purpose */
  description: string;

  /** ISO datetime when this variant was created */
  created: string;

  /** ISO datetime when this variant was last updated */
  updated: string;

  /** URL-encoded variant name */
  urlEncodedName: string;

  /** Output type identifier */
  outputType: number;

  /** System prompt/instructions for this variant */
  prompt: string;

  /** Hash of the prompt content */
  promptHash: string;

  /** Primary variant type/category */
  definitionType: string;

  /** All variant type/category tags */
  definitionTypes: string[];

  /** Role identifier */
  role: number;

  /** Underlying AI model (e.g., "gpt-4o", "gpt-3.5-turbo") */
  model: string;

  /** Model temperature as string (e.g., "0.7") */
  temperature: string;

  /** Stored responses for this variant */
  definitionResponses: unknown[];

  /** Conversation identifier (UUID) */
  conversationId: string;

  /** URL-friendly slug */
  slug: string;
}

/**
 * Zod Schema for AI Variant
 */
export const AIVariantSchema = z.object({
  definitionId: z.number(),
  name: z.string().min(1),
  description: z.string(),
  created: z.string(),
  updated: z.string(),
  urlEncodedName: z.string(),
  outputType: z.number(),
  prompt: z.string(),
  promptHash: z.string(),
  definitionType: z.string(),
  definitionTypes: z.array(z.string()),
  role: z.number(),
  model: z.string(),
  temperature: z.string(),
  definitionResponses: z.array(z.unknown()),
  conversationId: z.string(),
  slug: z.string(),
});

/**
 * Zod Schema for Variants Array Response
 */
export const AIVariantsResponseSchema = z.array(AIVariantSchema);

/**
 * AI Variants API Configuration
 */
export const AI_VARIANTS_API_CONFIG = {
  /** PromptSpark variants endpoint */
  VARIANTS_URL: 'https://web.makeboldspark.com/api/PromptSpark/Variant',
  
  /** Cache key for localStorage */
  CACHE_KEY: 'ai_variants_v1',
  
  /** Cache TTL in milliseconds */
  CACHE_TTL: {
    DEV: 5 * 60 * 1000,
    PROD: 60 * 60 * 1000,
  },
} as const;

/**
 * Chat Message Role
 */
export type ChatMessageRole = 'user' | 'assistant' | 'system';

/**
 * Chat Message Entity
 * Represents a single message in chat conversation
 */
export interface ChatMessage {
  /** Unique message identifier (UUID) */
  id: string;
  
  /** AIVariant ID this chat is with */
  variant_id: string;
  
  /** Message sender role */
  role: ChatMessageRole;
  
  /** Message text content (Markdown for assistant messages) */
  content: string;
  
  /** Message timestamp (Unix timestamp) */
  timestamp: number;
  
  /** Whether message is still streaming (for assistant responses) */
  streaming?: boolean;
  
  /** Error message if message failed to send/receive */
  error?: string;
}

/**
 * SignalR Hub Connection Status
 */
export type SignalRConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnecting';

/**
 * SignalR Configuration
 */
export const SIGNALR_CONFIG = {
  /** Chat hub URL */
  HUB_URL: 'https://web.makeboldspark.com/chatHub',
  
  /** Connection retry delays (exponential backoff) */
  RETRY_DELAYS: [0, 2000, 10000, 30000] as number[], // 0s, 2s, 10s, 30s, then give up
  
  /** Maximum message length */
  MAX_MESSAGE_LENGTH: 2000,
  
  /** Chat user name localStorage key */
  USER_NAME_KEY: 'chat_user_name',
  
  /** Default user name if not set */
  DEFAULT_USER_NAME: 'Anonymous',
  
  /** Hub methods */
  METHODS: {
    /** Client → Server: Send message to variant */
    SEND_MESSAGE: 'SendMessage',
    
    /** Server → Client: Receive complete message */
    RECEIVE_MESSAGE: 'ReceiveMessage',
    
    /** Server → Client: Receive streaming chunk */
    RECEIVE_CHUNK: 'ReceiveChunk',
    
    /** Server → Client: Streaming complete */
    STREAM_COMPLETE: 'StreamComplete',
    
    /** Server → Client: Error occurred */
    ERROR: 'Error',
  },
} as const;

/**
 * Chat Message Helpers
 */

/**
 * Creates a user-authored chat message.
 *
 * @param variantId - Variant identifier associated with the message
 * @param content - Message content entered by the user
 * @returns User chat message payload
 */
export function createUserMessage(
  variantId: number | string,
  content: string
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    variant_id: String(variantId),
    role: 'user',
    content,
    timestamp: Date.now(),
  };
}

/**
 * Sanitizes message content before rendering in the UI.
 *
 * @param content - Raw message content to sanitize
 * @returns Sanitized message content
 */
export function sanitizeMessageContent(content: string): string {
  return normalizeUserText(content);
}

/**
 * Validates chat input against configured length limits.
 *
 * @param content - Message text to validate
 * @returns True when the message can be sent
 */
export function isMessageValid(content: string): boolean {
  const trimmed = content.trim();
  return (
    trimmed.length > 0 &&
    trimmed.length <= SIGNALR_CONFIG.MAX_MESSAGE_LENGTH
  );
}

/**
 * Formats a chat timestamp for display.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Display-friendly timestamp string
 */
export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
