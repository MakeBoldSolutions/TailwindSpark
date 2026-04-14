/**
 * Canonical shipped theme identifiers.
 */
export const THEME_IDS = ['material', 'minimal', 'brutalist'] as const;

/**
 * Supported theme mode identifiers.
 */
export const THEME_MODES = ['light', 'dark'] as const;

/**
 * Supported named theme identifier.
 */
export type ThemeId = (typeof THEME_IDS)[number];

/**
 * Supported light or dark mode identifier.
 */
export type ThemeMode = (typeof THEME_MODES)[number];

/**
 * Storage origin used to derive the active theme preference.
 */
export type ThemePreferenceSource = 'default' | 'stored' | 'migrated' | 'system';

/**
 * Theme metadata used for descriptive UI and validation.
 */
export interface ThemeMetadata {
  /** Visual density profile for the theme. */
  density: 'comfortable' | 'compact' | 'roomy';
  /** Typography character for the theme. */
  typography: 'system' | 'editorial' | 'display';
  /** Motion profile for transitions and emphasis. */
  motion: 'smooth' | 'minimal' | 'snappy';
  /** Shape profile used by panels and controls. */
  shape: 'rounded' | 'soft' | 'sharp';
}

/**
 * Full named theme definition.
 */
export interface ThemeProfile {
  /** Stable ID used in persistence and DOM attributes. */
  id: ThemeId;
  /** Human-readable label shown in theme selectors. */
  label: string;
  /** Short summary of the visual system. */
  description: string;
  /** Default mode when the theme is first activated. */
  defaultMode: ThemeMode;
  /** Modes supported by this theme. */
  supportedModes: readonly ThemeMode[];
  /** Design language metadata for previews and docs. */
  metadata: ThemeMetadata;
}

/**
 * Persisted theme preference model.
 */
export interface ThemePreference {
  /** Selected named theme. */
  themeId: ThemeId;
  /** Selected light or dark mode. */
  mode: ThemeMode;
  /** How this preference was chosen or restored. */
  source: ThemePreferenceSource;
  /** Preference schema version. */
  version: number;
  /** Optional update timestamp for diagnostics. */
  updatedAt?: string;
}

/**
 * Default shipped theme identifier.
 */
export const DEFAULT_THEME_ID: ThemeId = 'material';

/**
 * Default theme mode used when no better signal exists.
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'light';

/**
 * Current persisted theme preference schema version.
 */
export const THEME_STORAGE_VERSION = 2;
