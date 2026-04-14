import {
  DEFAULT_THEME_ID,
  DEFAULT_THEME_MODE,
  THEME_MODES,
  THEME_STORAGE_VERSION,
  type ThemeMode,
  type ThemePreference,
  type ThemePreferenceSource,
} from '../types/theme';
import { getThemeProfile, resolveThemeId } from './themeRegistry';

/**
 * Canonical localStorage key for persisted theme preferences.
 */
export const THEME_STORAGE_KEY = 'tailwindspark:theme-preference';

/**
 * Legacy localStorage key from the original light/dark implementation.
 */
export const LEGACY_THEME_STORAGE_KEY = 'theme';

const isThemeMode = (value: string): value is ThemeMode =>
  THEME_MODES.includes(value as ThemeMode);

const supportsMode = (themeId: string, mode: ThemeMode): boolean =>
  getThemeProfile(resolveThemeId(themeId)).supportedModes.includes(mode);

/**
 * Resolves the current system color-scheme preference.
 *
 * @returns The preferred light or dark mode for the current browser context.
 */
export const resolveSystemThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return DEFAULT_THEME_MODE;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Creates a normalized theme preference object.
 *
 * @param overrides - Partial overrides applied on top of the default preference.
 * @returns A normalized theme preference object.
 */
export const createThemePreference = (
  overrides: Partial<ThemePreference> = {}
): ThemePreference => {
  const themeId = resolveThemeId(overrides.themeId);
  const requestedMode = overrides.mode ?? getThemeProfile(themeId).defaultMode ?? DEFAULT_THEME_MODE;
  const mode = supportsMode(themeId, requestedMode) ? requestedMode : getThemeProfile(themeId).defaultMode;

  return {
    themeId,
    mode,
    source: overrides.source ?? 'default',
    version: THEME_STORAGE_VERSION,
    updatedAt: overrides.updatedAt ?? new Date().toISOString(),
  };
};

/**
 * Returns the default theme preference using the current browser mode signal.
 *
 * @param source - Preference source to tag onto the result.
 * @returns The default theme preference.
 */
export const getDefaultThemePreference = (
  source: ThemePreferenceSource = 'default'
): ThemePreference =>
  createThemePreference({ themeId: DEFAULT_THEME_ID, mode: resolveSystemThemeMode(), source });

/**
 * Attempts to migrate the legacy light/dark-only preference key.
 *
 * @returns A migrated theme preference when the legacy key is present and valid.
 */
export const migrateLegacyThemePreference = (): ThemePreference | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const legacyValue = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  if (!legacyValue || !isThemeMode(legacyValue)) {
    return null;
  }

  const migratedPreference = createThemePreference({
    themeId: DEFAULT_THEME_ID,
    mode: legacyValue,
    source: 'migrated',
  });

  writeThemePreference(migratedPreference);
  return migratedPreference;
};

/**
 * Reads the stored theme preference from localStorage.
 *
 * @returns A valid stored theme preference when available.
 */
export const readStoredThemePreference = (): ThemePreference | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (!rawPreference) {
    return null;
  }

  try {
    const parsedPreference = JSON.parse(rawPreference) as Partial<ThemePreference>;
    if (!parsedPreference.themeId || !parsedPreference.mode) {
      return null;
    }

    if (!isThemeMode(parsedPreference.mode)) {
      return null;
    }

    return createThemePreference({
      themeId: parsedPreference.themeId,
      mode: parsedPreference.mode,
      source: parsedPreference.source ?? 'stored',
      updatedAt: parsedPreference.updatedAt,
    });
  } catch {
    return null;
  }
};

/**
 * Resolves the initial theme preference, including migration from the legacy key.
 *
 * @returns The best available theme preference for the current browser context.
 */
export const resolveInitialThemePreference = (): ThemePreference =>
  readStoredThemePreference() ?? migrateLegacyThemePreference() ?? getDefaultThemePreference('system');

/**
 * Persists a theme preference in localStorage.
 *
 * @param preference - Theme preference to persist.
 */
export const writeThemePreference = (preference: ThemePreference): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const nextPreference = createThemePreference({
    ...preference,
    source: preference.source === 'default' ? 'stored' : preference.source,
  });

  window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextPreference));
  window.localStorage.setItem(LEGACY_THEME_STORAGE_KEY, nextPreference.mode);
};

/**
 * Clears both the current and legacy persisted theme keys.
 */
export const clearThemePreference = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(THEME_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
};
