import {
  DEFAULT_THEME_ID,
  THEME_IDS,
  type ThemeId,
  type ThemeProfile,
} from '../types/theme';

/**
 * Shipped theme profiles available in the demo app.
 */
export const THEME_PROFILES: readonly ThemeProfile[] = [
  {
    id: 'material',
    label: 'Material',
    description: 'Rounded, layered, and motion-forward defaults.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark'],
    metadata: {
      density: 'comfortable',
      typography: 'system',
      motion: 'smooth',
      shape: 'rounded',
    },
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Quiet surfaces, tighter rhythm, and restrained motion.',
    defaultMode: 'light',
    supportedModes: ['light', 'dark'],
    metadata: {
      density: 'compact',
      typography: 'editorial',
      motion: 'minimal',
      shape: 'soft',
    },
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    description: 'High-contrast blocks, sharp edges, and punchy emphasis.',
    defaultMode: 'dark',
    supportedModes: ['light', 'dark'],
    metadata: {
      density: 'roomy',
      typography: 'display',
      motion: 'snappy',
      shape: 'sharp',
    },
  },
] as const;

const themeProfileById = new Map<ThemeId, ThemeProfile>(
  THEME_PROFILES.map(themeProfile => [themeProfile.id, themeProfile])
);

/**
 * Returns all shipped theme profiles.
 *
 * @returns Available shipped theme profiles.
 */
export const getThemeProfiles = (): readonly ThemeProfile[] => THEME_PROFILES;

/**
 * Determines whether a string is a valid shipped theme identifier.
 *
 * @param value - Candidate theme identifier.
 * @returns True when the identifier matches a shipped theme.
 */
export const isThemeId = (value: string): value is ThemeId =>
  THEME_IDS.includes(value as ThemeId);

/**
 * Resolves a theme identifier to a safe shipped theme value.
 *
 * @param value - Candidate theme identifier.
 * @returns A shipped theme identifier, defaulting when invalid.
 */
export const resolveThemeId = (value?: string | null): ThemeId =>
  value && isThemeId(value) ? value : DEFAULT_THEME_ID;

/**
 * Looks up a shipped theme profile.
 *
 * @param themeId - Theme identifier to resolve.
 * @returns The matching shipped theme profile.
 */
export const getThemeProfile = (themeId: ThemeId): ThemeProfile =>
  themeProfileById.get(themeId) ?? THEME_PROFILES[0];
