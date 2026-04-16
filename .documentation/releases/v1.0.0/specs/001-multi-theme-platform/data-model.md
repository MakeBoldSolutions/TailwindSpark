# Data Model: Multi-Theme Design System Platform

## ThemeProfile

**Purpose**: Represents a selectable named design system such as material, minimal, or brutalist.

**Fields**:

- `id`: stable unique identifier used in DOM attributes and persistence.
- `label`: human-readable name shown in theme selection UI.
- `description`: short explanation of the theme’s design language.
- `defaultMode`: default luminance variant for the theme.
- `supportedModes`: list of supported variants such as light and dark.
- `tokenSet`: semantic token values or references resolved for this theme.
- `componentRecipes`: component-specific semantic values for shared primitives and app surfaces.
- `metadata`: optional descriptors such as density profile, typography family, or motion profile.

**Validation Rules**:

- `id` must be unique and safe for use in `data-theme`.
- Every `ThemeProfile` must provide the required semantic token contract.
- Every shipped theme must define values or inherited fallbacks for color, typography, spacing, radius, elevation, motion, and layout density.

**Relationships**:

- One `ThemeProfile` can own multiple `ThemeModeProfile` entries.
- One `ThemeProfile` can be referenced by many `ThemePreference` records over time.

## ThemeModeProfile

**Purpose**: Represents a luminance or appearance variant within a theme, such as light or dark.

**Fields**:

- `mode`: variant identifier.
- `isDarkCompatible`: whether `.dark` should be active for this mode.
- `colorScheme`: browser color-scheme hint.
- `tokenOverrides`: values that differ from the parent theme baseline.

**Validation Rules**:

- A `ThemeProfile` must have at least one `ThemeModeProfile`.
- Any mode marked dark-compatible must keep readable text, visible focus states, and accessible contrast.

**Relationships**:

- Belongs to one `ThemeProfile`.

## ThemePreference

**Purpose**: Stores the user’s selected theme state in the browser context.

**Fields**:

- `themeId`: selected `ThemeProfile` identifier.
- `mode`: selected or resolved mode.
- `source`: whether the selection is explicit or derived from a default.
- `updatedAt`: optional timestamp for diagnostics or migrations.

**Validation Rules**:

- `themeId` must resolve to a known theme or be discarded in favor of the default.
- Invalid or outdated preferences must not prevent the app from loading with a safe theme.

**State Transitions**:

- `unset` -> `defaulted` when no prior preference exists.
- `defaulted` -> `explicitly-selected` when the user chooses a theme.
- `explicitly-selected` -> `fallback-applied` when a stored theme becomes invalid.

## TokenContract

**Purpose**: Defines the required semantic token categories that every theme must provide.

**Fields**:

- `colorTokens`: primary, secondary, surface, background, text, border, focus, and status semantics.
- `typographyTokens`: font families, font scale, weight, line-height, and tracking semantics.
- `spacingTokens`: shared spacing scale and density-sensitive adjustments.
- `radiusTokens`: shape and corner semantics.
- `elevationTokens`: shadows, outlines, or equivalent surface-depth semantics.
- `motionTokens`: durations, easing curves, and transition intensity semantics.
- `layoutTokens`: compact, default, or spacious density semantics and layout rhythm values.
- `componentTokens`: semantic recipe values for buttons, cards, inputs, navigation, overlays, and lists.

**Validation Rules**:

- Missing token categories must fall back to the baseline contract.
- Themes must not bypass the contract by binding components directly to raw palette values.

## ThemeableSurface

**Purpose**: Represents any reusable UI area that consumes the shared presentation contract.

**Fields**:

- `surfaceId`: stable semantic identifier.
- `surfaceType`: global layout, control, content container, overlay, list, or app-specific surface.
- `requiredRecipes`: semantic recipes needed to render the surface correctly.
- `accessibilityExpectations`: readability, focus, and interaction requirements.

**Relationships**:

- Each `ThemeableSurface` depends on one `TokenContract`.
- Multiple components can implement the same `surfaceType` using shared recipes.

## Notes on Scope

- This model is conceptual and implementation-agnostic.
- The main purpose is to ensure theme state, token coverage, and UI surface behavior are explicit before coding begins.