const THEME_RUNTIME_VERSION_SUFFIX_PATTERN = /-v[^-]+$/;

/**
 * Resolves the stable namespace shared by all cache buckets for a theme runtime.
 *
 * @param runtimeVersion - Version string used by the theme runtime.
 * @returns Namespace prefix shared by old and new cache versions.
 */
export const getThemeRuntimeNamespace = (runtimeVersion: string): string => {
  return runtimeVersion.replace(THEME_RUNTIME_VERSION_SUFFIX_PATTERN, '');
};

/**
 * Builds the cache prefixes owned by TailwindSpark for the given runtime namespace.
 *
 * @param runtimeVersion - Version string used by the theme runtime.
 * @returns Cache-name prefixes that belong to the TailwindSpark app.
 */
export const getThemeRuntimeCachePrefixes = (runtimeVersion: string): string[] => {
  const namespace = getThemeRuntimeNamespace(runtimeVersion);

  return [
    `tailwindspark-${namespace}-`,
    `static-${namespace}-`,
    `runtime-${namespace}-`,
    `images-${namespace}-`,
  ];
};

/**
 * Filters cache storage names down to the buckets owned by TailwindSpark.
 *
 * @param cacheNames - All cache names currently registered for the origin.
 * @param runtimeVersion - Version string used by the theme runtime.
 * @returns Cache names safe for TailwindSpark to delete.
 */
export const getTailwindSparkCacheNames = (
  cacheNames: string[],
  runtimeVersion: string
): string[] => {
  const prefixes = getThemeRuntimeCachePrefixes(runtimeVersion);

  return cacheNames.filter(cacheName => prefixes.some(prefix => cacheName.startsWith(prefix)));
};