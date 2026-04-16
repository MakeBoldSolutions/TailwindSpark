# Changelog

All notable changes to this project are documented in this file.

## [v1.0.0] - 2026-04-16

### Added

- **Multi-Theme Design System Platform**: Introduced named material, minimal, and brutalist themes with light and dark variants, persistent user selection, first-paint theme bootstrapping, semantic token layering, and cross-surface parity across the demo application and shared component library.

### Changed

- **Theme Runtime Model**: Replaced the prior boolean dark-mode flow with a named theme-and-mode runtime that preserves `.dark` compatibility while enabling interchangeable design systems.
- **Shared UI Recipes**: Standardized shared Button, Card, Form, and Modal primitives around semantic component tokens rather than palette-specific styling.
- **Rollout Resilience**: Added service-worker version coordination and stale-asset recovery so theme runtime changes remain coherent after deployment.

### Fixed

- No standalone quickfix artifacts were released in this baseline window.

### Architectural Decisions

- **ADR-001**: Named theme activation via `data-theme` with `.dark` compatibility.
- **ADR-002**: CSS-first layered semantic token contract for multi-theme support.
- **ADR-003**: Pre-paint theme bootstrap and cache-safe rollout coordination.

### Contributors

- Copilot
- dependabot[bot]
- Mark Hazleton