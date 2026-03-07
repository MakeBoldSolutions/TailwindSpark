const MULTIPLE_WHITESPACE_PATTERN = /\s+/g;

function isControlCharacter(char: string): boolean {
  const codePoint = char.charCodeAt(0);
  return (codePoint >= 0 && codePoint <= 31) || (codePoint >= 127 && codePoint <= 159);
}

/**
 * Normalizes free-form text before it is stored, filtered, or rendered through
 * React text nodes. This keeps user input predictable without attempting to
 * parse or strip HTML with fragile regular expressions.
 *
 * @param input - User-provided text to normalize
 * @returns Text with control characters removed and whitespace collapsed
 */
export function normalizeUserText(input: string): string {
  return input
    .split('')
    .map(char => (isControlCharacter(char) ? ' ' : char))
    .join('')
    .replace(MULTIPLE_WHITESPACE_PATTERN, ' ')
    .trim();
}

/**
 * Normalizes user input for search and filter operations.
 *
 * @param input - User-provided text to sanitize
 * @returns Normalized text safe for client-side use
 */
export function sanitizeInput(input: string): string {
  return normalizeUserText(input);
}
