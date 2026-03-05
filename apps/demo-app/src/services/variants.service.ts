import type { AIVariant } from '../types/chat-api';
import { AIVariantsResponseSchema, AI_VARIANTS_API_CONFIG } from '../types/chat-api';

function getCached(): AIVariant[] | null {
  try {
    const raw = localStorage.getItem(AI_VARIANTS_API_CONFIG.CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    const ttl = import.meta.env.DEV
      ? AI_VARIANTS_API_CONFIG.CACHE_TTL.DEV
      : AI_VARIANTS_API_CONFIG.CACHE_TTL.PROD;
    if (Date.now() - ts > ttl) return null;
    return AIVariantsResponseSchema.parse(data);
  } catch {
    return null;
  }
}

function setCache(data: AIVariant[]): void {
  try {
    localStorage.setItem(
      AI_VARIANTS_API_CONFIG.CACHE_KEY,
      JSON.stringify({ data, ts: Date.now() }),
    );
  } catch {
    // quota exceeded
  }
}

export async function getVariants(): Promise<AIVariant[]> {
  const cached = getCached();
  if (cached) return cached;

  const res = await fetch(AI_VARIANTS_API_CONFIG.VARIANTS_URL);
  if (!res.ok) throw new Error(`Variants API error: ${res.status}`);
  const json = await res.json();
  const data = AIVariantsResponseSchema.parse(json);
  setCache(data);
  return data;
}
