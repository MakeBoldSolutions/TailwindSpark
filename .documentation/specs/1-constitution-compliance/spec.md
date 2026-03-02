# Feature Specification: Constitution Compliance Remediation

**Feature Branch**: `1-constitution-compliance`  
**Created**: 2026-03-01  
**Status**: Draft  
**Input**: User description: "create a spec to address findings from site audit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Design System Color Compliance (Priority: P1)

**As a** developer or designer  
**I want** all UI components to use semantic design tokens instead of raw Tailwind color classes  
**So that** the application maintains consistent theming, dark mode support works correctly, and the design system is enforceable across the codebase.

**Why this priority**: This is the most critical violation affecting user experience. The 50+ instances of raw color usage break dark mode functionality, create visual inconsistencies, and directly violate the constitution's Principle III (CRITICAL severity). It undermines the project's stated purpose as an educational example of Tailwind CSS best practices.

**Independent Test**: Can be fully tested by running ESLint `no-raw-primary-class` rule, manually toggling dark mode on affected pages (AnimationShowcase, AnalyticsPage), and verifying no visual breaks or hard-coded colors appear. Delivers immediate value through restored dark mode and design consistency.

**Acceptance Scenarios**:

1. **Given** a developer views AnimationShowcase.tsx, **When** they inspect the component code, **Then** all color classes use semantic tokens (`bg-brand`, `text-success`, etc.) instead of raw values (`bg-blue-500`, `text-green-600`)
2. **Given** a user toggles dark mode on the Analytics page, **When** they view charts and data visualizations, **Then** all colors adapt correctly to dark theme using semantic token values
3. **Given** the ESLint `no-raw-primary-class` rule runs, **When** it scans AnimationShowcase.tsx and AnalyticsPage.tsx, **Then** zero violations are reported
4. **Given** a developer opens the design tokens package, **When** they review available semantic colors, **Then** they find a complete data visualization color palette for charts and graphs
5. **Given** pre-commit hooks are configured, **When** a developer attempts to commit code with raw color classes, **Then** the commit is blocked with a helpful error message

---

### User Story 2 - Comprehensive Code Documentation (Priority: P2)

**As a** developer (new or existing contributor)  
**I want** all exported components, functions, and interfaces to have JSDoc documentation  
**So that** I can understand component APIs, see usage examples in IDE tooltips, and maintain code without reading entire implementations.

**Why this priority**: Currently 95% of exports lack JSDoc (~70+ missing), severely degrading developer experience and violating Principle V (CRITICAL severity). This is the second-highest impact issue because it blocks effective onboarding, reduces code maintainability, and contradicts the project's educational mission. IDE IntelliSense is nearly useless without this documentation.

**Independent Test**: Can be tested by checking JSDoc coverage percentage, verifying IntelliSense displays helpful documentation for all exports in `packages/ui-components`, and confirming ESLint `require-jsdoc` rule passes. Delivers value through improved developer productivity and code understanding.

**Acceptance Scenarios**:

1. **Given** a developer imports the Button component from `packages/ui-components`, **When** they hover over `ButtonProps` in their IDE, **Then** they see comprehensive JSDoc with description, parameter details, and usage examples
2. **Given** a developer views `packages/design-tokens/tokens/index.ts`, **When** they inspect the `colors` object, **Then** each color token has JSDoc explaining its semantic purpose and usage guidelines
3. **Given** an ESLint rule enforcing JSDoc on exports, **When** it scans the codebase, **Then** all components in `packages/ui-components` pass validation (100% coverage)
4. **Given** a new contributor explores the Form components, **When** they read JSDoc for Input, Textarea, Select, Checkbox, Radio, **Then** they understand how to use each component without reading source code
5. **Given** a developer uses the Modal component suite, **When** they access JSDoc, **Then** they see documented usage examples for Modal, ModalHeader, ModalContent, and ModalFooter

---

### User Story 3 - Test Coverage Requirements (Priority: P3)

**As a** project maintainer  
**I want** test coverage for all components and pages to meet the 80% constitutional minimum  
**So that** code changes can be made confidently without breaking existing functionality, regressions are caught early, and code quality standards are enforced.

**Why this priority**: Current test coverage is only 24% (16 of 66 files tested), with 0% page coverage and 0% section coverage, violating Principle II (CRITICAL severity). While lower priority than design system and documentation (which directly affect users and developers daily), adequate testing is essential for long-term maintainability and preventing production bugs.

**Independent Test**: Can be tested by running coverage reports with `vitest --coverage`, verifying coverage thresholds are enforced in CI/CD, and confirming all pages render without errors. Delivers value through regression prevention and code quality confidence.

**Acceptance Scenarios**:

1. **Given** the vitest configuration file, **When** coverage thresholds are checked, **Then** they are set to 80% for statements, branches, functions, and lines
2. **Given** all 11 page components, **When** test suites run, **Then** each page has at least one test file covering rendering and basic interactions
3. **Given** the 5 showcase section components, **When** tests execute, **Then** critical user interactions (form validation, modal accessibility, animation examples) are tested
4. **Given** CI/CD pipeline runs on pull requests, **When** code coverage is below 80%, **Then** the build fails with a clear error message
5. **Given** a developer runs `npm test -- --coverage`, **When** the report generates, **Then** components/, pages/, and sections/ all show >= 80% coverage

---

### User Story 4 - Code Quality Standards (Priority: P4)

**As a** code reviewer  
**I want** all code to pass quality checks (proper logging, no debug statements)  
**So that** production code is clean, debugging output doesn't clutter user consoles, and quality standards are consistently enforced.

**Why this priority**: Lowest priority as it involves only 3 minor violations (`console.log` usage), but still necessary to achieve full constitution compliance. These issues don't affect end users directly but impact code professionalism and maintainability.

**Independent Test**: Can be tested by running ESLint checks for console usage, verifying no `console.log` statements exist in production builds, and confirming structured logging patterns are used. Delivers value through cleaner production code.

**Acceptance Scenarios**:

1. **Given** memoryMonitor.ts and MemoryMonitorDisplay.tsx, **When** ESLint scans for console usage, **Then** all `console.log` statements are replaced with `console.info()` or conditional debug logging
2. **Given** production build configuration, **When** the build runs, **Then** debug console statements are stripped from output bundles
3. **Given** utility functions need to log information, **When** they execute, **Then** they use appropriate log levels (`console.info`, `console.warn`, `console.error`) based on message severity

---

### Edge Cases

- What happens when a developer adds a new component without JSDoc? → Pre-commit ESLint hook should block the commit with a helpful error
- How does the system handle existing components that mix semantic and raw colors during migration? → Clear migration guide should be provided, with tools to find remaining violations
- What if test coverage drops below 80% after a large refactor? → CI/CD should fail with specific instructions on which files need tests
- How do we ensure data visualization colors (charts/graphs) work in dark mode? → New semantic data-viz color palette should be created with tested dark mode variants
- What happens if a developer is unfamiliar with semantic token naming conventions? → JSDoc in design-tokens should provide clear examples and usage guidelines

## Requirements *(mandatory)*

### Functional Requirements

#### Design System Compliance (P1)

- **FR-001**: System MUST replace all 50+ instances of raw Tailwind color classes (`bg-blue-500`, `text-gray-900`, etc.) with semantic design tokens (`bg-brand`, `text-surface`, etc.)
- **FR-002**: Design tokens package MUST include a complete data visualization color palette for charts and graphs used in AnalyticsPage.tsx
- **FR-003**: All semantic color tokens MUST have corresponding dark mode variants defined in CSS custom properties
- **FR-004**: ESLint `no-raw-primary-class` rule MUST be strengthened to catch all raw color patterns and enforce semantic token usage
- **FR-005**: Pre-commit hooks MUST prevent committing code with raw Tailwind color classes
- **FR-006**: A migration guide document MUST be created explaining how to convert raw colors to semantic tokens

#### Code Documentation (P2)

- **FR-007**: All exported components in `packages/ui-components` (Button, Card, Form components, Modal) MUST have comprehensive JSDoc with descriptions, parameter docs, and usage examples (12+ exports)
- **FR-008**: All design token exports in `packages/design-tokens` MUST have JSDoc explaining semantic meaning and usage guidelines (6+ token categories)
- **FR-009**: All page components in `apps/demo-app/src/pages` MUST have JSDoc describing page purpose and key features (11 pages)
- **FR-010**: All section showcase components MUST have JSDoc with usage examples (5 sections)
- **FR-011**: ESLint rule `require-jsdoc` (from eslint-plugin-jsdoc) MUST be configured to enforce JSDoc on all exports
- **FR-012**: JSDoc templates/examples MUST be created for team consistency

#### Test Coverage (P3)

- **FR-013**: Vitest configuration MUST define coverage thresholds of 80% for statements, branches, functions, and lines
- **FR-014**: All 11 page components MUST have test files covering rendering and basic user interactions
- **FR-015**: All 5 showcase section components MUST have tests covering critical functionality (form validation, modal accessibility, animation examples)
- **FR-016**: At least 12 untested components in `apps/demo-app/src/components` MUST have basic test coverage added
- **FR-017**: CI/CD pipeline MUST fail builds when test coverage drops below 80%
- **FR-018**: Coverage reports MUST be generated in HTML format and stored as build artifacts

#### Code Quality (P4)

- **FR-019**: All 3 instances of `console.log` in memoryMonitor.ts and MemoryMonitorDisplay.tsx MUST be replaced with appropriate log levels (`console.info`, `console.warn`, or conditional debug logging)
- **FR-020**: Production build configuration MUST strip debug console statements from output bundles
- **FR-021**: ESLint rules MUST enforce proper logging patterns (no `console.log` in production code)

### Key Entities *(include if feature involves data)*

- **Design Token**: Semantic color, spacing, or styling value defined in `packages/design-tokens/theme.css` with CSS custom properties for light/dark modes
- **Component Export**: A React component, interface, or type exported from a package that developers import and use
- **Test Suite**: A collection of Vitest test cases for a specific component, page, or section that validates rendering, behavior, and accessibility
- **Coverage Threshold**: Minimum percentage requirement (80%) for code coverage metrics (statements, branches, functions, lines)
- **Semantic Color**: A design token with a meaningful name representing purpose (e.g., `brand`, `success`, `error`) rather than appearance (e.g., `blue-500`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### Design System Compliance

- **SC-001**: ESLint `no-raw-primary-class` rule reports zero violations across entire codebase
- **SC-002**: Dark mode toggle on all pages shows no visual breaks, color inconsistencies, or hard-coded colors (100% dark mode compatibility)
- **SC-003**: All 50+ raw color violations identified in audit are resolved (100% semantic token usage)
- **SC-004**: Design tokens package includes minimum 8 semantic colors for data visualization (charts, graphs)

#### Code Documentation

- **SC-005**: JSDoc coverage reaches 100% for all exports in `packages/ui-components` (from current ~0%)
- **SC-006**: JSDoc coverage reaches 100% for all token exports in `packages/design-tokens` (from current ~0%)
- **SC-007**: 95% or higher developer satisfaction with IDE IntelliSense helpfulness (measured via 3-question Likert scale survey: IntelliSense discoverability, documentation clarity, example usefulness; 3-5 developers, conducted post-PR merge)
- **SC-008**: New contributors can understand component APIs without reading implementation code (measured via structured onboarding interviews: 3 developers attempt component integration tasks, record time-to-understanding <10 minutes per component)

#### Test Coverage

- **SC-009**: Total test coverage reaches 80% or higher across all metrics (statements, branches, functions, lines)
- **SC-010**: Page component test coverage increases from 0% to 80%+ (11 of 11 pages tested)
- **SC-011**: Section component test coverage increases from 0% to 80%+ (5 of 5 sections tested)
- **SC-012**: CI/CD pipeline enforces 80% coverage threshold and fails builds when threshold is not met

#### Code Quality

- **SC-013**: Zero instances of `console.log` in production code (down from 3 violations)
- **SC-014**: All logging uses appropriate severity levels (`console.info`, `console.warn`, `console.error`)
- **SC-015**: Production bundle size does not contain debug logging statements

#### Overall Project Health

- **SC-016**: Constitution compliance score improves from 42% to 95%+ (all CRITICAL violations resolved)
- **SC-017**: All CRITICAL severity findings from 2026-03-01 audit are resolved (no remaining critical issues)
- **SC-018**: Project serves as a credible educational example of Tailwind CSS and React best practices

## Assumptions

- The ESLint `no-raw-primary-class` custom rule exists and is functional, but may need strengthening to catch all patterns
- The `packages/design-tokens` package structure supports adding new semantic color tokens without breaking changes
- Developers have access to Vitest and testing utilities already configured in the monorepo
- CI/CD pipeline (GitHub Actions) can be updated to enforce coverage thresholds
- The project uses standard JSDoc syntax compatible with TypeScript IntelliSense
- Dark mode implementation uses `.dark` class strategy with CSS custom properties as documented
- Pre-commit hooks can be added via husky or similar tools (this may need investigation)
- The existing accessibility test utilities in `packages/ui-components/src/test/a11y-utils.ts` can be reused for component testing

## Dependencies

- Completion of this feature does not block other work, but other features should adopt these standards going forward
- This work should be coordinated with any ongoing component development to avoid merge conflicts
- Documentation updates should be completed before announcing this remediation to ensure new contributors follow corrected patterns
- Familiarity with the project constitution (`.documentation/constitution.md`) is required to understand compliance requirements

## Out of Scope

- Creating new components or features (this is purely remediation work)
- Redesigning the color palette or adding new brand colors (only semantic naming layer is in scope)
- Refactoring large files like MarketingPage.tsx (553 lines) into smaller components (separate technical debt ticket)
- Adding E2E tests or integration tests (focus is on unit test coverage only)
- Implementing automated visual regression testing for dark mode
- Performance optimization unrelated to constitution compliance
- Migration to different testing framework or tools
