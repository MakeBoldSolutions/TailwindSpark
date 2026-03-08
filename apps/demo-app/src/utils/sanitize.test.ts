import { describe, expect, it } from 'vitest';
import { normalizeUserText, sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
  it('returns normal text unchanged', () => {
    expect(sanitizeInput('Hello World')).toBe('Hello World');
  });

  it('preserves printable characters without trying to strip markup', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('<script>alert("xss")</script>');
  });

  it('preserves protocol-like text for search terms', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('javascript:alert(1)');
  });

  it('preserves event-like text for search terms', () => {
    expect(sanitizeInput('onerror=alert(1)')).toBe('onerror=alert(1)');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('preserves normal search terms', () => {
    expect(sanitizeInput('React TypeScript')).toBe('React TypeScript');
  });
});

describe('normalizeUserText', () => {
  it('removes control characters', () => {
    expect(normalizeUserText('hello\u0000world\u001F!')).toBe('hello world !');
  });

  it('collapses repeated whitespace', () => {
    expect(normalizeUserText('React\n\nTypeScript\tTailwind')).toBe('React TypeScript Tailwind');
  });
});
