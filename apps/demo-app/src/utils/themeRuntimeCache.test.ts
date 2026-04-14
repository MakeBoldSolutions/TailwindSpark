import { describe, expect, it } from 'vitest';
import {
    getTailwindSparkCacheNames,
    getThemeRuntimeCachePrefixes,
    getThemeRuntimeNamespace,
} from './themeRuntimeCache';

describe('getThemeRuntimeNamespace', () => {
  it('removes the trailing version segment from the runtime version', () => {
    expect(getThemeRuntimeNamespace('theme-platform-v1')).toBe('theme-platform');
  });
});

describe('getThemeRuntimeCachePrefixes', () => {
  it('returns TailwindSpark-owned cache prefixes for the runtime namespace', () => {
    expect(getThemeRuntimeCachePrefixes('theme-platform-v1')).toEqual([
      'tailwindspark-theme-platform-',
      'static-theme-platform-',
      'runtime-theme-platform-',
      'images-theme-platform-',
    ]);
  });
});

describe('getTailwindSparkCacheNames', () => {
  it('keeps only TailwindSpark cache buckets for the active runtime namespace', () => {
    const cacheNames = [
      'static-theme-platform-v1',
      'runtime-theme-platform-v2',
      'images-theme-platform-v3',
      'tailwindspark-theme-platform-v1',
      'shared-assets-v1',
      'other-app-runtime-v5',
    ];

    expect(getTailwindSparkCacheNames(cacheNames, 'theme-platform-v1')).toEqual([
      'static-theme-platform-v1',
      'runtime-theme-platform-v2',
      'images-theme-platform-v3',
      'tailwindspark-theme-platform-v1',
    ]);
  });
});