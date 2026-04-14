import type { ThemePreference } from '../types/theme';
import { createThemePreference, resolveInitialThemePreference } from './themeStorage';

/**
 * Applies a theme preference to the root document element.
 *
 * @param preference - Theme preference to apply.
 * @param documentRef - Document whose root element will be updated.
 * @returns The normalized preference that was applied.
 */
export const applyThemeToDocument = (
  preference: ThemePreference,
  documentRef: Document = document
): ThemePreference => {
  const resolvedPreference = createThemePreference(preference);
  const rootElement = documentRef.documentElement;

  rootElement.dataset.theme = resolvedPreference.themeId;
  rootElement.dataset.themeMode = resolvedPreference.mode;
  rootElement.classList.toggle('dark', resolvedPreference.mode === 'dark');
  rootElement.style.colorScheme = resolvedPreference.mode;

  return resolvedPreference;
};

/**
 * Reads the active theme state from the root document element.
 *
 * @param documentRef - Document whose root element will be inspected.
 * @returns The resolved document theme preference.
 */
export const readThemeFromDocument = (documentRef: Document = document): ThemePreference => {
  const rootElement = documentRef.documentElement;

  return createThemePreference({
    themeId: rootElement.dataset.theme,
    mode: rootElement.dataset.themeMode as ThemePreference['mode'] | undefined,
    source: 'stored',
  });
};

/**
 * Resolves and applies the initial theme before React mounts.
 *
 * @param documentRef - Document whose root element will be updated.
 * @returns The applied initial theme preference.
 */
export const initializeThemeBoot = (documentRef: Document = document): ThemePreference => {
  const initialPreference = resolveInitialThemePreference();
  return applyThemeToDocument(initialPreference, documentRef);
};
