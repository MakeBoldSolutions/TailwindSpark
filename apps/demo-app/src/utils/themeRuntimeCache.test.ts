import { describe, expect, it } from 'vitest';
import {
    getTailwindSparkCacheNames,
    getThemeRuntimeCachePrefixes,
    getThemeRuntimeNamespace,
  isTailwindSparkCacheName,
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

describe('isTailwindSparkCacheName', () => {
  it('returns true only for TailwindSpark-owned caches in the same runtime namespace', () => {
    expect(isTailwindSparkCacheName('static-theme-platform-v1', 'theme-platform-v1')).toBe(true);
    expect(isTailwindSparkCacheName('runtime-theme-platform-v7', 'theme-platform-v1')).toBe(true);
    expect(isTailwindSparkCacheName('tailwindspark-theme-platform-v3', 'theme-platform-v1')).toBe(true);
    expect(isTailwindSparkCacheName('shared-assets-v1', 'theme-platform-v1')).toBe(false);
    expect(isTailwindSparkCacheName('other-app-runtime-v2', 'theme-platform-v1')).toBe(false);
  });
});