import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SEOProvider, useSEO } from './SEOContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SEOProvider>{children}</SEOProvider>
);

describe('SEOContext', () => {
  it('provides default title', () => {
    const { result } = renderHook(() => useSEO(), { wrapper });
    expect(result.current.seo.title).toBe('TailwindSpark');
  });

  it('provides default description', () => {
    const { result } = renderHook(() => useSEO(), { wrapper });
    expect(result.current.seo.description).toBe(
      'Interactive showcase of Tailwind CSS components and design system',
    );
  });

  it('updates title via setSEO', () => {
    const { result } = renderHook(() => useSEO(), { wrapper });
    act(() => {
      result.current.setSEO({ title: 'New Title' });
    });
    expect(result.current.seo.title).toBe('New Title');
  });

  it('updates document.title', () => {
    const { result } = renderHook(() => useSEO(), { wrapper });
    act(() => {
      result.current.setSEO({ title: 'Doc Title Test' });
    });
    expect(document.title).toBe('Doc Title Test');
  });

  it('merges partial updates', () => {
    const { result } = renderHook(() => useSEO(), { wrapper });
    act(() => {
      result.current.setSEO({ title: 'Title A', keywords: 'react' });
    });
    act(() => {
      result.current.setSEO({ description: 'Desc B' });
    });
    expect(result.current.seo.title).toBe('Title A');
    expect(result.current.seo.description).toBe('Desc B');
    expect(result.current.seo.keywords).toBe('react');
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useSEO());
    }).toThrow('useSEO must be used within a SEOProvider');
  });
});
