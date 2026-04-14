/**
 * Required semantic token groups for every shipped theme.
 */
export const requiredTokenGroups = [
  'color',
  'typography',
  'spacing',
  'radius',
  'elevation',
  'motion',
  'layout',
  'components',
] as const;

/**
 * Required named themes supported by the platform.
 */
export const requiredThemeIds = ['material', 'minimal', 'brutalist'] as const;

/**
 * Required theme modes supported by the platform.
 */
export const requiredThemeModes = ['light', 'dark'] as const;

/**
 * Fallback metadata used when a theme omits descriptive fields.
 */
export const fallbackThemeMetadata = {
  density: 'comfortable',
  typography: 'system',
  motion: 'smooth',
  shape: 'rounded',
} as const;

/**
 * Tests whether a theme identifier belongs to the shipped set.
 *
 * @param themeId - Candidate theme identifier.
 * @returns True when the theme identifier is shipped.
 */
export const isRequiredThemeId = (themeId: string): boolean =>
  requiredThemeIds.includes(themeId as (typeof requiredThemeIds)[number]);

/**
 * Tests whether a theme mode belongs to the shipped set.
 *
 * @param mode - Candidate theme mode.
 * @returns True when the mode is supported.
 */
export const isRequiredThemeMode = (mode: string): boolean =>
  requiredThemeModes.includes(mode as (typeof requiredThemeModes)[number]);

/**
 * Validates that a token group collection contains every required platform group.
 *
 * @param tokenGroups - Token group names to validate.
 * @returns Missing required token group names.
 */
export const getMissingTokenGroups = (tokenGroups: readonly string[]): string[] =>
  requiredTokenGroups.filter(tokenGroup => !tokenGroups.includes(tokenGroup));
