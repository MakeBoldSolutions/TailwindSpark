/**
 * Sanitizes user input by removing potentially dangerous characters
 * while preserving normal text for search/filter operations.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets (XSS vectors)
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
    .trim();
}
