/**
 * AI Chat API Contract
 * 
 * TypeScript types and Zod schemas for PromptSpark AI Variants and SignalR Chat
 * Sources:
 * - PromptSpark Variants API
 * - SignalR Chat Hub (real-time messaging)
 */

import { z } from 'zod';

/**
 * AI Variant Category
 * Categorizes different types of AI assistants
 */
export type AIVariantCategory =
  | 'GPT Models'
  | 'Development'
  | 'Creative'
  | 'Data Analysis'
  | 'General';

/**
 * AI Variant Entity
 * Represents an AI assistant variant/persona
 */
export interface AIVariant {
  /** Unique variant identifier (UUID) */
  id: string;
  
  /** Variant display name */
  name: string;
  
  /** Variant description/purpose */
  description: string;
  
  /** Variant category */
  category: AIVariantCategory;
  
  /** Underlying AI model (e.g., "gpt-4", "gpt-3.5-turbo") */
  model: string;
  
  /** Model temperature (0.0-2.0, controls randomness) */
  temperature: number;
  
  /** System prompt/instructions for this variant */
  system_prompt: string;
  
  /** Whether to display in featured section */
  featured: boolean;
  
  /** Icon identifier or URL */
  icon?: string;
  
  /** Searchable tags */
  tags?: string[];
}

/**
 * Zod Schema for AI Variant
 */
export const AIVariantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: z.enum(['GPT Models', 'Development', 'Creative', 'Data Analysis', 'General']),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  system_prompt: z.string().min(1),
  featured: z.boolean(),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Zod Schema for Variants Array Response
 */
export const AIVariantsResponseSchema = z.array(AIVariantSchema);

/**
 * Type inference from Zod schema
 */
export type AIVariantSchemaType = z.infer<typeof AIVariantSchema>;
export type AIVariantsResponseType = z.infer<typeof AIVariantsResponseSchema>;

/**
 * API Response Wrapper
 */
export interface AIVariantsAPIResponse {
  success: boolean;
  data?: AIVariant[];
  error?: string;
}

/**
 * AI Variants API Configuration
 */
export const AI_VARIANTS_API_CONFIG = {
  /** PromptSpark variants endpoint */
  VARIANTS_URL: 'https://promptspark.azurewebsites.net/api/variants',
  
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
 * Zod Schema for Chat Message
 */
export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  variant_id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  timestamp: z.number().int().positive(),
  streaming: z.boolean().optional(),
  error: z.string().optional(),
});

/**
 * Type inference from Zod schema
 */
export type ChatMessageSchemaType = z.infer<typeof ChatMessageSchema>;

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
  HUB_URL: 'https://promptspark.azurewebsites.net/chat-hub',
  
  /** Connection retry delays (exponential backoff) */
  RETRY_DELAYS: [0, 2000, 10000, 30000], // 0s, 2s, 10s, 30s, then give up
  
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
 * SignalR Hub Message (Client → Server)
 */
export interface SignalRSendMessage {
  /** User's display name */
  userName: string;
  
  /** AI variant ID to chat with */
  variantId: string;
  
  /** Message content */
  message: string;
}

/**
 * SignalR Hub Message (Server → Client)
 */
export interface SignalRReceiveMessage {
  /** Message ID */
  id: string;
  
  /** AI variant ID */
  variantId: string;
  
  /** Message role */
  role: ChatMessageRole;
  
  /** Message content */
  content: string;
  
  /** Timestamp */
  timestamp: number;
}

/**
 * SignalR Streaming Chunk (Server → Client)
 */
export interface SignalRStreamChunk {
  /** Message ID being streamed */
  messageId: string;
  
  /** Content chunk */
  chunk: string;
  
  /** Is this the final chunk? */
  isFinal: boolean;
}

/**
 * SignalR Error Message (Server → Client)
 */
export interface SignalRError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Additional error details */
  details?: string;
}

/**
 * Chat Session State
 */
export interface ChatSessionState {
  /** Selected AI variant */
  variant: AIVariant | null;
  
  /** Connection status */
  connectionStatus: SignalRConnectionStatus;
  
  /** Chat messages */
  messages: ChatMessage[];
  
  /** Current input text */
  inputText: string;
  
  /** Is assistant currently typing/streaming? */
  isAssistantTyping: boolean;
  
  /** Connection error message */
  connectionError?: string;
}

/**
 * AI Variant Filters
 */
export interface AIVariantFilters {
  searchTerm?: string;
  category?: AIVariantCategory;
  featured?: boolean;
  tags?: string[];
}

/**
 * Featured Variants Configuration
 */
export const FEATURED_VARIANTS_CONFIG = {
  /** Maximum number of featured variants to display */
  MAX_FEATURED: 3,
  
  /** Display featured section */
  SHOW_FEATURED_SECTION: true,
} as const;

/**
 * Chat Message Helpers
 */

/**
 * Create user message
 */
export function createUserMessage(
  variantId: string,
  content: string
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    variant_id: variantId,
    role: 'user',
    content,
    timestamp: Date.now(),
  };
}

/**
 * Create assistant message (initial, before streaming)
 */
export function createAssistantMessage(
  variantId: string,
  messageId?: string
): ChatMessage {
  return {
    id: messageId || crypto.randomUUID(),
    variant_id: variantId,
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
    streaming: true,
  };
}

/**
 * Sanitize message content to prevent XSS
 */
export function sanitizeMessageContent(content: string): string {
  // Basic sanitization - ReactMarkdown will handle full sanitization
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Validate message length
 */
export function isMessageValid(content: string): boolean {
  const trimmed = content.trim();
  return (
    trimmed.length > 0 &&
    trimmed.length <= SIGNALR_CONFIG.MAX_MESSAGE_LENGTH
  );
}

/**
 * Format message timestamp for display
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

/**
 * SignalR Transport Type
 */
export enum SignalRTransportType {
  WebSockets = 1,
  ServerSentEvents = 2,
  LongPolling = 4,
}

/**
 * SignalR Connection Options
 */
export interface SignalRConnectionOptions {
  /** Transport types to use (fallback order) */
  transport?: SignalRTransportType;
  
  /** Logging level */
  logLevel?: 'trace' | 'debug' | 'information' | 'warning' | 'error' | 'none';
  
  /** Automatic reconnection */
  withAutomaticReconnect?: boolean | number[];
  
  /** Skip negotiation (WebSocket only) */
  skipNegotiation?: boolean;
}

/**
 * Default SignalR Connection Options
 */
export const DEFAULT_SIGNALR_OPTIONS: SignalRConnectionOptions = {
  transport:
    SignalRTransportType.WebSockets |
    SignalRTransportType.ServerSentEvents |
    SignalRTransportType.LongPolling,
  logLevel: 'information',
  withAutomaticReconnect: SIGNALR_CONFIG.RETRY_DELAYS,
  skipNegotiation: false,
};
