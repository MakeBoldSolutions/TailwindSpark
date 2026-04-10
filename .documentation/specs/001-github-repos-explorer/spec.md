# Feature Specification: GitHub Repositories Explorer

**Feature Branch**: `001-github-repos-explorer`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "Create a new app for demo, this one is for the markhazleton git repositories, use build using the repositories.json from [github-stats-spark](https://github.com/markhazleton/github-stats-spark)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse All Repositories (Priority: P1)

A visitor arrives at the GitHub Repositories Explorer page and sees a visually organized listing of all 33 public repositories belonging to Mark Hazleton. Each repository card displays the name, description, primary language, star count, fork count, and composite score ranking. The visitor can quickly scan the collection to understand the breadth and depth of Mark's open-source work.

**Why this priority**: This is the foundational view — without a browsable listing, no other feature has context. It delivers immediate value by showcasing the full portfolio at a glance.

**Independent Test**: Can be fully tested by loading the page and verifying all repositories render with correct metadata. Delivers a complete portfolio overview as a standalone MVP.

**Acceptance Scenarios**:

1. **Given** the explorer page loads, **When** repository data is available, **Then** all repositories display as cards/rows with name, description, primary language, stars, forks, and rank
2. **Given** the explorer page loads, **When** a repository has no description, **Then** the AI-generated summary text is shown instead
3. **Given** the explorer page loads, **When** repositories render, **Then** they are sorted by composite score (highest first) by default

---

### User Story 2 - Filter and Sort Repositories (Priority: P2)

A visitor wants to find repositories matching specific criteria. They can type keywords into a search box to filter by repository name, description, or AI summary. They can also filter by primary language (e.g., TypeScript, Python, C#), activity status (active, stale, archived), and whether the repo has tests, CI/CD, or documentation. They can sort by composite score, stars, recent commits, age, or name. The view updates instantly as search terms, filters, or sort options change.

**Why this priority**: With 33 repositories, browsing alone becomes unwieldy. Filtering and sorting let visitors quickly zero in on what interests them — essential for a useful explorer experience.

**Independent Test**: Can be tested by selecting different filter combinations and sort options, then verifying the displayed list updates correctly and matches the criteria.

**Acceptance Scenarios**:

1. **Given** the full repository listing is shown, **When** the visitor types "spark" into the search box, **Then** only repositories with "spark" in their name, description, or AI summary are displayed
2. **Given** the full repository listing is shown, **When** the visitor selects "Python" from the language filter, **Then** only repositories with Python as the primary language are displayed
3. **Given** repositories are sorted by composite score, **When** the visitor changes sort to "Most Stars", **Then** the list reorders with highest-starred repositories first
4. **Given** the visitor applies multiple filters or search terms, **When** no repositories match, **Then** a friendly empty state message is shown with a way to clear filters
5. **Given** filters or search are active, **When** the visitor clears all filters and search, **Then** the full listing is restored

---

### User Story 3 - View Repository Detail (Priority: P3)

A visitor clicks on a repository card and it expands inline (accordion style) to reveal rich detail information: the AI-generated summary, commit history patterns, activity metrics (90/180/365-day windows), language breakdown, dependency health, attention score with component breakdowns, contributor stats, and links to the live repository and homepage (if available). Only one card is expanded at a time — clicking another card collapses the previous one.

**Why this priority**: The detail view transforms the explorer from a simple listing into a rich analytical tool, but requires the listing (P1) and discoverability (P2) to be valuable.

**Independent Test**: Can be tested by clicking any repository card and verifying all detail sections render with correct data from the JSON source. Delivers deep per-repository insight.

**Acceptance Scenarios**:

1. **Given** the repository listing is displayed, **When** the visitor clicks a repository card, **Then** the card expands inline to show comprehensive repository detail below the card header
2. **Given** a repository card is expanded, **When** the visitor clicks a different card, **Then** the previously expanded card collapses and the newly clicked card expands
3. **Given** the detail view is open, **When** the repository has an AI-generated summary, **Then** the summary text is prominently displayed
4. **Given** the detail view is open, **When** the repository has commit history data, **Then** activity patterns and commit metrics are presented visually
5. **Given** the detail view is open, **When** the visitor clicks the repository URL, **Then** they are navigated to the GitHub repository page

---

### User Story 4 - View Portfolio Summary Statistics (Priority: P4)

A visitor sees a summary header/dashboard area showing aggregate statistics across all repositories: total repositories, total commits, total stars, total forks, most-used languages distribution, and overall activity trends. This provides immediate context about the portfolio's scale and focus areas.

**Why this priority**: Summary statistics add polish and context but are supplementary to the core browsing and detail experiences.

**Independent Test**: Can be tested by loading the page and verifying aggregate calculations match the sum of individual repository data values.

**Acceptance Scenarios**:

1. **Given** the explorer page loads, **When** repository data is available, **Then** a summary section displays total repositories, total commits, total stars, and total forks
2. **Given** the summary section renders, **When** language data is aggregated, **Then** a visual breakdown of language distribution across all repositories is displayed
3. **Given** the summary section renders, **When** activity data is aggregated, **Then** an overall activity indicator is displayed

---

### Edge Cases

- What happens when the repositories.json fetch fails or returns empty data? The app displays a clear error/empty state with guidance.
- How does the system handle repositories with null or missing optional fields (e.g., no `ai_summary`, no `tech_stack`, no `homepage`)? Gracefully omit those sections or show sensible defaults.
- What happens when a repository has zero commits or zero stars? Display zero values rather than hiding the fields.
- How does the app behave when `is_archived` is true? Archived repositories are visually distinguished (e.g., dimmed or badged).
- What happens if the JSON schema version changes? The app handles missing or extra fields gracefully without crashing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch and parse the `repositories.json` data file from the GitHub Stats Spark data source at build time
- **FR-002**: System MUST display all non-private repositories as browsable cards/rows with: name, description (or AI summary fallback), primary language, stars, forks, and composite score rank
- **FR-003**: System MUST sort repositories by composite score (descending) as the default ordering
- **FR-004**: System MUST provide a text search box that filters repositories by matching keywords against name, description, and AI summary (case-insensitive)
- **FR-005**: System MUST provide filtering by primary programming language with all distinct languages available as options
- **FR-006**: System MUST provide filtering by repository status: active (pushed within 90 days), stale (no push in 90+ days), and archived
- **FR-007**: System MUST provide sorting by: composite score, stars, forks, total commits, recent activity (90-day commits), repository age, and name (alphabetical)
- **FR-008**: System MUST display an inline expandable detail view (accordion style) for each repository showing: AI summary, commit history patterns, activity metrics across time windows, language breakdown, attention score components, and external links. Only one card expanded at a time.
- **FR-009**: System MUST display aggregate portfolio statistics: total repositories, total commits, total stars, total forks, and language distribution
- **FR-010**: System MUST visually distinguish archived repositories from active ones
- **FR-011**: System MUST handle missing or null optional fields gracefully without display errors
- **FR-012**: System MUST provide direct links to each repository's GitHub page and homepage (when available)
- **FR-013**: System MUST be responsive and usable on both desktop and mobile screen sizes
- **FR-014**: System MUST be registered as a new demo application within the TailwindSpark project

### Key Entities

- **Repository**: A GitHub repository with metadata including name, description, language, activity metrics, composite score, and attention metrics. Central entity with ~33 instances.
- **Commit History**: Activity data for a repository across time windows (90d, 180d, 365d) with patterns, frequency, and consistency scoring.
- **Attention Metrics**: Composite health indicator for a repository comprising pull request backlog, security alerts, staleness, and dependency drift components.
- **Tech Stack**: Dependency and framework information for a repository including language breakdown, dependency counts, and currency scoring.
- **Portfolio Summary**: Aggregated statistics across all repositories representing the overall profile.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can browse the complete repository portfolio and identify any specific repository within 15 seconds
- **SC-002**: Visitors can filter repositories by language and find all matching results in under 5 seconds
- **SC-003**: Visitors can view comprehensive details for any repository within 2 clicks from the main listing
- **SC-004**: The page loads and displays all repository data within 3 seconds on standard broadband connections
- **SC-005**: All aggregate statistics (totals, language distribution) are mathematically accurate against the source data
- **SC-006**: The explorer is fully usable on screens from 320px to 2560px width without horizontal scrolling or overlapping content
- **SC-007**: 100% of repository cards display without errors regardless of missing optional data fields

## Clarifications

### Session 2026-04-09

- Q: What interaction pattern should the repository detail view use? → A: Inline expandable panel (accordion style) — clicking a card expands it in place within the listing
- Q: Should the explorer include free-text keyword search? → A: Yes — a search box that filters repositories by matching name, description, or AI summary

## Assumptions

- The `repositories.json` data is fetched at build time (static generation), not at runtime, since it is a publicly available static file that changes infrequently
- The data source URL remains stable and publicly accessible without authentication
- The JSON schema follows version 2.2.0 structure as documented by the github-stats-spark project
- No user authentication is required — this is a public-facing read-only demo
- The app will follow TailwindSpark's existing component library patterns and Tailwind CSS styling conventions
- Repository screenshots (when available via the `screenshot` field) may be used in the detail view but are not a core requirement
