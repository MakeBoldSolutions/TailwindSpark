# Feature Specification: ReactSparkPortfolio Migration to TailwindSpark

**Feature Branch**: `003-reactspark-migration`  
**Created**: March 2, 2026  
**Status**: Complete  
**Input**: User description: "Migrate ReactSparkPortfolio features to TailwindSpark with Tailwind CSS"

## Clarifications

### Session 2026-03-02

- Q: What URL structure should mini-applications use when accessed through the "Apps" navigation? → A: Option B - `/apps/{mini-app-name}` routes with dedicated Apps hub
- Q: Should the Apps hub page (`/apps`) display a grid of mini-app cards with descriptions and quick-launch buttons? → A: Yes - Grid layout with app cards showing icon, name, description, and "Launch" button
- Q: How should the top navigation "Apps" menu behave when clicked? → A: Option A - Dropdown menu listing all mini-apps (Projects, Articles, Joke, Weather, AI Chat) with direct navigation
- Q: Should the primary navigation still include "Home" and "About" as separate top-level links, or should everything except "Home" be under "Apps"? → A: Option A - Top nav: Home, About, Apps (dropdown) - keeps content separate from applications
- Q: Should mini-applications share global state (theme, user preferences) or operate as fully isolated modules? → A: Option A - Shared global state - ThemeContext, SEOContext, and service layer shared across all mini-apps

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Portfolio Project Showcase (Priority: P1)

As a portfolio visitor, I want to browse showcase projects with search and filtering capabilities so I can quickly find relevant work examples.

**Why this priority**: Core functionality that demonstrates professional work - the primary purpose of the portfolio site.

**Independent Test**: Can be fully tested by loading the Projects page, searching for a project name, sorting by different criteria, and paginating through results. Delivers immediate value by showcasing portfolio work.

**Acceptance Scenarios**:

1. **Given** I am on the Projects page, **When** I view the initial load, **Then** I see 6 projects per page with images, titles, descriptions, and links
2. **Given** I search for "Frogsfolly", **When** I type in the search box, **Then** the project list filters in real-time to show matching projects
3. **Given** I am viewing project results, **When** I click sort by name ascending, **Then** projects reorder alphabetically A-Z
4. **Given** I have more than 6 projects, **When** I click pagination controls, **Then** I can navigate between pages while maintaining search/sort state
5. **Given** the API fails to load projects, **When** the page loads, **Then** I see a fallback to local projects.json with appropriate error messaging
6. **Given** I click "Refresh Cache", **When** the button is clicked, **Then** the cache is cleared and fresh data is fetched from the API

---

### User Story 2 - Blog Articles Display with RSS (Priority: P1)

As a blog reader, I want to view articles fetched from an RSS feed with category filtering and date sorting so I can find content relevant to my interests.

**Why this priority**: Essential content delivery mechanism for demonstrating technical writing and thought leadership.

**Independent Test**: Can be fully tested by loading the Articles page, filtering by category, sorting by date, and verifying RSS feed parsing. Delivers value by showcasing technical content.

**Acceptance Scenarios**:

1. **Given** I am on the Articles page, **When** the page loads, **Then** I see articles with title, date, category badge, description, and link
2. **Given** I see multiple article categories, **When** I select "ReactSpark" category, **Then** only articles in that category are displayed
3. **Given** I am viewing articles, **When** I toggle sort from newest to oldest, **Then** articles reorder by publication date
4. **Given** I have more than 6 articles, **When** I navigate pages, **Then** filtering and sorting state are preserved across pagination
5. **Given** the RSS feed is unavailable, **When** the page loads, **Then** I see a fallback to local rss.xml file

---

### User Story 3 - Interactive Joke Feature with AI (Priority: P2)

As a site visitor, I want to get random programming jokes with the ability to like, save, share, and get AI explanations so I can enjoy humor and understand context.

**Why this priority**: Demonstrates API integration, localStorage usage, and SignalR chat - valuable for technical demonstration but secondary to core content.

**Independent Test**: Can be fully tested by fetching jokes, liking/saving them, sharing via Web Share API, and opening the AI explainer modal. Demonstrates real-time communication capabilities.

**Acceptance Scenarios**:

1. **Given** I am on the Joke page, **When** the page loads, **Then** I see a random joke fetched from the JokeAPI
2. **Given** I see a joke, **When** I click the heart icon, **Then** the joke is added to my liked jokes (persisted in localStorage)
3. **Given** I see a joke, **When** I click the bookmark icon, **Then** the joke is saved to my saved jokes list
4. **Given** I have saved jokes, **When** I view my saved jokes section, **Then** I see all previously saved jokes with delete functionality
5. **Given** I want to understand a joke, **When** I click "Explain", **Then** a modal opens with a chat interface to get AI explanation
6. **Given** I want to share a joke, **When** I click share, **Then** the Web Share API is invoked (if supported)
7. **Given** I see a two-part joke, **When** it displays, **Then** I see the setup and delivery formatted distinctly

---

### User Story 4 - Weather Forecast with Maps (Priority: P2)

As a site visitor, I want to search for weather by city name and see results on an interactive map so I can view current conditions for different locations.

**Why this priority**: Demonstrates external API integration, map visualization with Leaflet, and multi-source data handling.

**Independent Test**: Can be fully tested by searching for a city, viewing weather data, interacting with the map, and managing recent searches.

**Acceptance Scenarios**:

1. **Given** I am on the Weather page, **When** I search for "Dallas", **Then** I see current temperature, humidity, wind speed, cloud cover, and feels-like temperature
2. **Given** I see weather results, **When** the page displays, **Then** I see an interactive Leaflet map centered on the city with a marker
3. **Given** I have searched for cities, **When** I view recent searches, **Then** I see my last 5 searches and can click to reload
4. **Given** the weather API is rate-limited, **When** I exceed limits, **Then** I see a user-friendly error message explaining the issue
5. **Given** I load the page initially, **When** no search is performed, **Then** I see default weather for Dallas and Wichita

---

### User Story 5 - AI Chat with Variant Selection (Priority: P2)

As a site visitor, I want to browse available AI assistant variants and start real-time chat conversations so I can interact with different AI personalities.

**Why this priority**: Showcases real-time SignalR communication, dynamic variant loading, and chat interface - important technical demonstration.

**Independent Test**: Can be fully tested by loading variants, filtering by category, selecting a variant, and sending chat messages with real-time responses.

**Acceptance Scenarios**:

1. **Given** I am on the AI Chat page, **When** the page loads, **Then** I see variants categorized (GPT Models, Development, Creative, Data Analysis, General)
2. **Given** I see featured variants, **When** the page loads, **Then** the top 3 featured variants are highlighted prominently
3. **Given** I want to filter variants, **When** I select a category, **Then** only variants in that category are displayed
4. **Given** I want to start chatting, **When** I click "Start Chat" on a variant, **Then** a modal opens with the chat interface
5. **Given** I am in a chat, **When** I send a message, **Then** I see my message displayed and receive streaming responses from the AI
6. **Given** I am chatting, **When** the connection is lost, **Then** automatic reconnection is attempted with status indicators
7. **Given** I am a first-time chat user, **When** I open chat, **Then** I am prompted to enter my name (persisted to localStorage)

---

### User Story 6 - Theme Switching (Priority: P1)

As a site visitor, I want to toggle between light and dark themes so I can view the site comfortably in different lighting conditions.

**Why this priority**: Accessibility and user preference - affects the entire site experience.

**Independent Test**: Can be fully tested by clicking the theme toggle button and verifying all pages render correctly in both themes.

**Acceptance Scenarios**:

1. **Given** I visit the site for the first time, **When** the page loads, **Then** the theme matches my system preference (light/dark)
2. **Given** I am using the site, **When** I click the theme toggle button in the header, **Then** the theme switches immediately across all pages
3. **Given** I have set a theme preference, **When** I return to the site, **Then** my preference is loaded from localStorage
4. **Given** I switch themes, **When** I navigate to different pages, **Then** the theme persists across all routes

---

### User Story 7 - Hero/About Pages (Priority: P1)

As a portfolio visitor, I want to see professional profile information, technology stack, and recent ReactSpark articles so I can learn about the developer and their work.

**Why this priority**: First impression and professional branding - essential for portfolio effectiveness.

**Independent Test**: Can be fully tested by loading the Hero and About pages and verifying all content displays correctly.

**Acceptance Scenarios**:

1. **Given** I visit the homepage, **When** the page loads, **Then** I see profile name, profession, introduction, CTA buttons, and technology stack icons
2. **Given** I am on the About page, **When** the page loads, **Then** I see profile details and recent ReactSpark articles (filtered from RSS)
3. **Given** I see technology stack, **When** displayed, **Then** I see icons for React, Vite, TypeScript, Tailwind CSS, and other technologies
4. **Given** I see CTA buttons, **When** I click them, **Then** I am directed to external links (GitHub, WebSpark)

---

### User Story 8 - Responsive Navigation with Apps Menu (Priority: P1)

As a site visitor on any device, I want to navigate between pages using a responsive navigation bar with an Apps dropdown menu so I can access all features easily.

**Why this priority**: Core UX requirement - affects accessibility to all features with new mini-app architecture.

**Independent Test**: Can be fully tested by navigating between pages, testing responsive menu on mobile, using Apps dropdown, and verifying active state indicators.

**Acceptance Scenarios**:

1. **Given** I am on any page, **When** I view the navigation, **Then** I see top-level links to Home, About, and Apps (dropdown)
2. **Given** I hover over or click "Apps" in the navigation, **When** the dropdown opens, **Then** I see all mini-apps listed (Projects, Articles, Joke, Weather, AI Chat)
3. **Given** I am on a specific mini-app, **When** I view the navigation, **Then** the Apps menu and the current mini-app are visually indicated as active
4. **Given** I am on mobile, **When** I view the navigation, **Then** I see a hamburger menu that expands to show all navigation including Apps submenu
5. **Given** the navigation is sticky, **When** I scroll, **Then** the header remains visible at the top of the viewport
6. **Given** I see the header, **When** displayed, **Then** I see the theme toggle button and skip-to-content link (accessibility)
7. **Given** I click a mini-app from the Apps dropdown, **When** the link is clicked, **Then** I navigate directly to that mini-app (e.g., `/apps/projects`)

---

### User Story 9 - Apps Hub Discovery Page (Priority: P1)

As a site visitor, I want to view all available mini-apps on an Apps hub page so I can discover and understand what each app does before launching it.

**Why this priority**: Provides discoverability and overview of site capabilities - essential for new users to understand available tools.

**Independent Test**: Can be fully tested by navigating to `/apps`, viewing the grid of app cards, reading descriptions, and clicking launch buttons.

**Acceptance Scenarios**:

1. **Given** I navigate to `/apps`, **When** the page loads, **Then** I see a grid layout of all mini-app cards
2. **Given** I view an app card, **When** displayed, **Then** I see an icon, application name, description, and "Launch" button
3. **Given** I see the app cards, **When** displayed, **Then** all 5 mini-apps are shown (Projects, Articles, Joke, Weather, AI Chat)
4. **Given** I click "Launch" on any app card, **When** the button is clicked, **Then** I navigate to that mini-app's route (e.g., `/apps/projects`)
5. **Given** I am on the Apps hub, **When** I view the page, **Then** the "Apps" navigation item is highlighted as active
6. **Given** I view the Apps hub on mobile, **When** displayed, **Then** the app cards stack vertically in a single column

---

### Edge Cases

- What happens when external APIs (projects.json, rss.xml, JokeAPI, Weather API) are unavailable?
  - System falls back to local cached data or local fallback files
  - User-friendly error messages are displayed
  - Cache expiration logic prevents stale data from persisting indefinitely

- How does the system handle rate limiting from external APIs?
  - Weather API: Display rate limit exceeded message with retry guidance
  - JokeAPI: Falls back to hardcoded joke, displays error toast

- What happens when SignalR connection fails or disconnects?
  - Automatic reconnection with exponential backoff
  - Connection status indicators shown to user
  - Fallback transport methods (WebSocket → SSE → LongPolling)

- How does the system handle invalid user inputs?
  - Search inputs: Trim whitespace, sanitize for XSS
  - Weather searches: Validate city name format, display "city not found" errors
  - Chat inputs: Sanitize messages, prevent empty messages

- What happens when localStorage is full or disabled?
  - Cache functionality degrades gracefully
  - Features still work but without persistence
  - No critical functionality breaks

- How are images handled when they fail to load?
  - Project images: Display placeholder image
  - Cache buster appended to prevent stale images

- What happens during version updates?
  - UpdateNotification component detects version mismatch
  - User sees toast with "Update" and "Dismiss" options
  - Clicking "Update" performs hard refresh and clears all caches

- How does pagination handle edge cases?
  - Empty search results: Display "No results found"
  - Single page of results: Hide pagination controls
  - Page number exceeds max: Reset to last valid page

## Requirements *(mandatory)*

### Functional Requirements

#### Core UI Framework
- **FR-001**: System MUST use Tailwind CSS for all styling (replacing Bootstrap 5)
- **FR-002**: System MUST maintain responsive design across mobile, tablet, and desktop viewports
- **FR-003**: System MUST support dark and light themes with class-based strategy
- **FR-004**: System MUST persist theme preference to localStorage
- **FR-005**: System MUST detect system theme preference on first visit

#### Navigation & Routing
- **FR-006**: System MUST implement client-side routing with React Router for all pages and mini-apps
- **FR-007**: System MUST provide sticky navigation header with active state indicators for current page/app
- **FR-008**: System MUST implement Apps dropdown menu in navigation showing all mini-apps with direct navigation links
- **FR-009**: System MUST provide top-level navigation links for Home, About, and Apps (dropdown)
- **FR-010**: System MUST implement Apps hub page at `/apps` route showing grid of mini-app cards
- **FR-011**: System MUST route all mini-apps under `/apps` namespace (e.g., `/apps/projects`, `/apps/articles`)
- **FR-012**: System MUST implement responsive mobile navigation with hamburger menu including Apps submenu
- **FR-013**: System MUST lazy-load route components for performance
- **FR-014**: System MUST handle 404 errors with user-friendly NotFound page
- **FR-015**: System MUST preserve mini-app state when navigating between apps (via shared global context)

#### Project Showcase Mini-App
- **FR-016**: System MUST implement Projects mini-app accessible at `/apps/projects` route
- **FR-017**: System MUST fetch project data from external API (https://markhazleton.com/projects.json)
- **FR-018**: System MUST implement caching with version-based invalidation
- **FR-019**: System MUST provide search functionality filtering on project name and description
- **FR-020**: System MUST provide sort functionality (name asc/desc, id asc/desc)
- **FR-021**: System MUST implement pagination with 6 projects per page
- **FR-022**: System MUST transform relative image URLs to absolute CDN paths
- **FR-023**: System MUST append cache busters to image URLs
- **FR-024**: System MUST fallback to local projects.json if API fails
- **FR-025**: System MUST provide manual cache refresh functionality
- **FR-026**: System MUST display cache metadata (source, count, last updated)

#### Blog Articles Mini-App (RSS)
- **FR-027**: System MUST implement Articles mini-app accessible at `/apps/articles` route
- **FR-028**: System MUST fetch and parse XML RSS feed from external API
- **FR-029**: System MUST extract title, link, pubDate, category, description, and thumbnail from RSS items
- **FR-030**: System MUST implement search filtering on article titles
- **FR-031**: System MUST provide category-based filtering (extracted from RSS)
- **FR-032**: System MUST provide date-based sorting (newest/oldest)
- **FR-033**: System MUST implement pagination with 6 articles per page
- **FR-034**: System MUST format dates using Intl.DateTimeFormat for locale-aware display
- **FR-035**: System MUST cache RSS data with 30-minute TTL
- **FR-036**: System MUST fallback to local rss.xml if API fails

#### Joke Mini-App
- **FR-037**: System MUST implement Joke mini-app accessible at `/apps/joke` route
- **FR-038**: System MUST fetch jokes from JokeAPI (v2.jokeapi.dev)
- **FR-039**: System MUST support both single-line and two-part joke formats
- **FR-040**: System MUST persist liked jokes to localStorage with 'liked_jokes' key
- **FR-041**: System MUST persist saved jokes to localStorage with 'saved_jokes' key
- **FR-042**: System MUST maintain joke history (last 10 jokes) in localStorage with 'joke_history' key
- **FR-043**: System MUST provide Web Share API integration for joke sharing
- **FR-044**: System MUST provide copy-to-clipboard functionality
- **FR-045**: System MUST integrate AI chat modal for joke explanations
- **FR-046**: System MUST display toast notifications for user actions
- **FR-047**: System MUST fallback to hardcoded joke if API fails

#### Weather Forecast Mini-App
- **FR-048**: System MUST implement Weather mini-app accessible at `/apps/weather` route
- **FR-049**: System MUST fetch weather data from OpenWeatherMap API (api.openweathermap.org)
- **FR-050**: System MUST display temperature, feels-like, humidity, wind speed, visibility, and cloud cover
- **FR-051**: System MUST integrate Leaflet maps for location visualization
- **FR-052**: System MUST persist recent searches to localStorage (max 5)
- **FR-053**: System MUST load default cities (Dallas, Wichita) on initial page load
- **FR-054**: System MUST handle rate limiting errors with user-friendly messages
- **FR-055**: System MUST display weather icons based on conditions

#### AI Chat & Variants Mini-App
- **FR-056**: System MUST implement AI Chat mini-app accessible at `/apps/ai-chat` route
- **FR-057**: System MUST fetch AI variant list from PromptSpark API
- **FR-058**: System MUST categorize variants (GPT Models, Development, Creative, Data Analysis, General)
- **FR-059**: System MUST highlight featured variants (top 3)
- **FR-060**: System MUST provide category-based filtering
- **FR-061**: System MUST provide search functionality on variant name/description
- **FR-062**: System MUST establish SignalR connection to chat hub
- **FR-063**: System MUST implement bidirectional real-time messaging
- **FR-064**: System MUST support message streaming with typing indicators
- **FR-065**: System MUST persist user name to localStorage
- **FR-066**: System MUST render bot messages as Markdown (ReactMarkdown)
- **FR-067**: System MUST sanitize all user inputs to prevent XSS
- **FR-068**: System MUST implement automatic reconnection on connection loss
- **FR-069**: System MUST support WebSocket, SSE, and LongPolling transports
- **FR-070**: System MUST display connection status indicators

#### Service Layer & Caching
- **FR-071**: System MUST implement singleton pattern for all API services shared across mini-apps
- **FR-072**: System MUST validate all API responses with Zod schemas
- **FR-073**: System MUST invalidate caches on app_version changes
- **FR-074**: System MUST use different cache TTLs for dev (5 min) and prod (1 hour)
- **FR-075**: System MUST call external APIs directly from the client (no server-side proxy required)
- **FR-076**: System MUST use Vite dev proxy for API calls in development to avoid CORS issues
- **FR-077**: System MUST share service layer instances across all mini-apps via global context

#### SEO & Meta Tags
- **FR-078**: System MUST update document title per route (including mini-apps)
- **FR-079**: System MUST update meta description per route (including mini-apps)
- **FR-080**: System MUST provide Open Graph meta tags
- **FR-081**: System MUST provide canonical URL management
- **FR-082**: System MUST generate sitemap.xml pre-build including all mini-app routes
- **FR-083**: System MUST generate robots.txt pre-build
- **FR-084**: System MUST implement JSON-LD structured data

#### Error Handling & Resilience
- **FR-085**: System MUST implement ErrorBoundary to catch React component errors across all mini-apps
- **FR-086**: System MUST display user-friendly error messages for all failure scenarios
- **FR-087**: System MUST log errors to console for debugging
- **FR-088**: System MUST provide recovery options (e.g., "Go Home" or "Go to Apps" button)
- **FR-089**: System MUST handle network failures gracefully with fallbacks

#### Version Management & Updates
- **FR-090**: System MUST detect version changes by comparing VITE_APP_VERSION from import.meta.env against cached version
- **FR-091**: System MUST display UpdateNotification component when new version is available
- **FR-092**: System MUST provide "Update" (reload page) and "Dismiss" (hide notification) actions in UpdateNotification
- **FR-093**: System MUST clear all caches on hard refresh (Ctrl+F5)
- **FR-094**: System MUST check for updates every 60 seconds via polling timer

#### Accessibility
- **FR-095**: System MUST provide skip-to-content link in header
- **FR-096**: System MUST include proper ARIA attributes on interactive elements (including Apps dropdown)
- **FR-097**: System MUST support keyboard navigation for all features (including Apps dropdown and hub)
- **FR-098**: System MUST maintain WCAG 2.1 AA color contrast ratios
- **FR-099**: System MUST use semantic HTML elements
- **FR-100**: System MUST provide alternative text for all images

#### Performance
- **FR-101**: System MUST implement code splitting for route components (including mini-apps)
- **FR-102**: System MUST lazy-load images with placeholders
- **FR-103**: System MUST minimize bundle size through tree-shaking
- **FR-104**: System MUST serve assets with cache headers (max-age)
- **FR-105**: System MUST inline assets < 4kb
- **FR-106**: System MUST minify JavaScript and CSS in production
- **FR-107**: System MUST remove console.log statements in production builds

#### Security
- **FR-108**: System MUST implement Content Security Policy (CSP) headers
- **FR-109**: System MUST sanitize all user inputs before rendering across all mini-apps
- **FR-110**: System MUST configure CORS properly for all API endpoints
- **FR-111**: System MUST NOT expose sensitive credentials in client code
- **FR-112**: System MUST use HTTPS for all external API calls
- **FR-113**: System MUST validate SSL certificates on backend connections

### Key Entities *(data models)*

- **MiniApp**: Mini-app descriptor with id, name, icon, description, route, category (optional), featured flag
- **JokeHistory**: Array of last 10 Joke objects viewed by user, persisted to localStorage
- **Project**: Portfolio showcase item with id (number), image (URL), title (p), description (d), and link (h)
- **RssArticle**: Blog article with title, link (URL), pubDate (ISO string), category (optional), description (optional), thumbnail (optional)
- **Joke**: Humor content with type ("single" | "twopart"), joke/setup/delivery (text), category, and id (number)
- **WeatherData**: Weather information with location (name, latitude, longitude) and currentConditions (temperature, feelsLike, humidity, windSpeed, visibility, cloudCover, conditionsDescription)
- **Variant**: AI assistant with id, name, description, systemPrompt, temperature, category (enhanced), and featured flag
- **Message**: Chat message with id, user (sender name), content (text), timestamp, and isStreaming flag
- **CacheInfo**: Cache metadata with source ("remote" | "cache" | "local"), count, lastUpdated (timestamp), version

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### Feature Parity & Functionality
- **SC-001**: All 5 mini-apps (Projects, Articles, Joke, Weather, AI Chat) are implemented at `/apps/*` routes and functional in TailwindSpark
- **SC-002**: Apps hub page at `/apps` displays grid of all mini-apps with launch functionality
- **SC-003**: Top navigation includes Home, About, and Apps dropdown menu with all mini-apps listed
- **SC-004**: 100% of Bootstrap UI components are successfully converted to Tailwind CSS equivalents
- **SC-005**: All external API integrations (Projects, RSS, Joke, Weather, PromptSpark, SignalR) function identically to ReactSparkPortfolio
- **SC-006**: Theme switching between light and dark modes works across all pages and mini-apps with preference persistence
- **SC-007**: Shared global state (ThemeContext, SEOContext, service layer) works consistently across all mini-apps

#### User Experience
- **SC-008**: Users can discover all available mini-apps from the Apps hub page within 3 seconds of landing
- **SC-009**: Users can access any mini-app via Apps dropdown in under 2 clicks from any page
- **SC-010**: Users can find a specific project by searching in under 5 seconds
- **SC-011**: Users can filter blog articles by category and see results in under 2 seconds
- **SC-012**: Joke mini-app displays a new joke within 2 seconds of clicking "New Joke" button
- **SC-013**: Weather search returns results and displays map within 3 seconds for valid city names
- **SC-014**: AI chat messages stream responses with visible typing indicators within 1 second of sending
- **SC-015**: Navigation between any two mini-apps completes in under 1 second (lazy-loaded routes)
- **SC-016**: First-time visitors see appropriate theme (matching system preference) on initial load across all pages

#### Performance
- **SC-017**: Initial page load (FCP - First Contentful Paint) occurs in under 1.5 seconds on 3G connection
- **SC-018**: Lighthouse Performance score achieves 90+ on all pages including Apps hub
- **SC-019**: Total bundle size is under 500KB (gzipped) for initial load
- **SC-020**: Each lazy-loaded mini-app chunk is under 100KB (gzipped)
- **SC-021**: Images load with progressive enhancement (placeholders → full images)
- **SC-022**: Cache hit rate for API data exceeds 80% during typical browsing sessions
- **SC-023**: Version check completes within 500ms

#### Reliability & Error Handling
- **SC-024**: System successfully falls back to local data when API calls fail (100% of failure scenarios)
- **SC-025**: No unhandled errors crash the application (all errors caught by ErrorBoundary across mini-apps)
- **SC-026**: SignalR reconnection succeeds within 10 seconds after connection loss in 95% of disconnect events
- **SC-027**: Cache invalidation on version updates works correctly (100% of deployments)
- **SC-028**: Rate limit errors display user-friendly messages (100% of rate-limit scenarios)

#### Accessibility
- **SC-029**: WCAG 2.1 AA compliance verified across all pages including Apps hub and mini-apps
- **SC-030**: All interactive elements are keyboard accessible (tab navigation works 100% including Apps dropdown)
- **SC-031**: Screen reader announces page changes and dynamic content updates across mini-apps
- **SC-032**: Color contrast ratios meet 4.5:1 minimum for normal text, 3:1 for large text
- **SC-033**: Skip-to-content link allows keyboard users to bypass navigation

#### SEO
- **SC-034**: Each route including all mini-apps has unique, descriptive title and meta description
- **SC-035**: Open Graph tags generate proper previews on social media platforms
- **SC-036**: sitemap.xml includes all routes (Home, About, /apps, /apps/*) and is accessible at /sitemap.xml
- **SC-037**: robots.txt allows search engine crawling and references sitemap
- **SC-038**: Lighthouse SEO score achieves 95+ on all pages including Apps hub

#### Data Integrity & Validation
- **SC-039**: All API responses pass Zod schema validation (100% of successful responses)
- **SC-040**: Invalid API data is rejected and triggers fallback logic
- **SC-041**: User inputs are sanitized to prevent XSS attacks (100% of input fields across mini-apps)
- **SC-042**: localStorage operations handle quota exceeded errors gracefully

#### Security
- **SC-043**: Content Security Policy (CSP) headers prevent unauthorized script execution
- **SC-044**: All external API calls use HTTPS (no mixed content warnings)
- **SC-045**: No credentials or API keys are exposed in client-side code
- **SC-046**: CORS configuration allows only whitelisted origins in production

#### Cross-Browser & Device Compatibility
- **SC-047**: Site functions correctly on Chrome, Firefox, Safari, and Edge (latest 2 versions)
- **SC-048**: Mobile responsive design works on devices from 320px to 2560px width
- **SC-049**: Touch interactions work correctly on mobile devices (tap, swipe) including Apps dropdown
- **SC-050**: Site operates offline with cached data when service worker is active

#### Developer Experience
- **SC-051**: Development server starts in under 10 seconds
- **SC-052**: Hot Module Replacement (HMR) reflects changes in under 1 second for all mini-apps
- **SC-053**: Build process completes in under 60 seconds
- **SC-054**: TypeScript compilation produces zero errors
- **SC-055**: ESLint produces zero errors in production builds

### Business Outcomes

- **BO-001**: TailwindSpark demonstrates modern React best practices for portfolio showcasing with mini-app architecture
- **BO-002**: Site serves as a reusable template for future Tailwind + React projects with modular application structure
- **BO-003**: Technical documentation is comprehensive enough for other developers to extend features and add new mini-apps
- **BO-004**: Deployment pipeline (GitHub Pages) is automated and reliable
- **BO-005**: Site demonstrates proficiency in React, TypeScript, Tailwind CSS, SignalR, API integration, and modular architecture
- **BO-006**: Mini-app architecture showcases scalable pattern for organizing complex SPAs
