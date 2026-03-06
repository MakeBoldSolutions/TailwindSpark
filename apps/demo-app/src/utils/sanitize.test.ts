import { describe, expect, it } from 'vitest';
import { sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
  it('returns normal text unchanged', () => {
    expect(sanitizeInput('Hello World')).toBe('Hello World');
  });

  it('removes angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
  });

  it('removes javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
  });

  it('removes inline event handlers', () => {
    expect(sanitizeInput('onerror=alert(1)')).toBe('alert(1)');
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
