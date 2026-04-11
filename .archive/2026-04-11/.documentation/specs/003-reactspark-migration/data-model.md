# Data Model: ReactSparkPortfolio Migration

**Feature**: ReactSparkPortfolio Migration to TailwindSpark  
**Date**: March 2, 2026  
**Purpose**: Define all data entities, relationships, validation rules, and state management for the mini-application architecture

---

## Entity Definitions

### 1. Project

**Purpose**: Represents a portfolio project showcased in the Projects mini-app

**Source**: External API (`https://markhazleton.com/projects.json`) with localStorage fallback

**Schema**:
```typescript
interface Project {
  id: number;                    // Unique identifier
  name: string;                  // Project name (e.g., "FrogsFolly Golf Course")
  description: string;           // Short description (1-2 sentences)
  image_url: string;             // Absolute URL to project screenshot/logo
  project_url: string;           // Absolute URL to live project or GitHub repo
  status: 'Active' | 'Completed' | 'Archived';  // Project status
  technologies?: string[];       // Tech stack (e.g., ["React", "TypeScript"])
  featured?: boolean;            // Display in featured section
  created_date?: string;         // ISO 8601 date string
  updated_date?: string;         // ISO 8601 date string
}
```

**Validation Rules**:
- `id`: Required, positive integer
- `name`: Required, non-empty string, max 100 chars
- `description`: Required, non-empty string, max 500 chars
- `image_url`: Required, valid URL
- `project_url`: Required, valid URL
- `status`: Required, one of enum values
- `technologies`: Optional array of strings
- `featured`: Optional boolean, defaults to false
- `created_date`, `updated_date`: Optional ISO 8601 strings

**Zod Schema** (see `contracts/projects-api.ts`):
```typescript
const ProjectSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  image_url: z.string().url(),
  project_url: z.string().url(),
  status: z.enum(['Active', 'Completed', 'Archived']),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  created_date: z.string().datetime().optional(),
  updated_date: z.string().datetime().optional(),
});
```

**State Transitions**: N/A (read-only from API)

**Relationships**:
- None (standalone entity)

**Cache Key**: `projects_v1`

**Lifecycle**:
1. Fetch from API on page load
2. Validate with Zod schema
3. Cache in localStorage with version + timestamp
4. Display in ProjectsPage with search/filter/pagination
5. Refresh cache on manual "Refresh Cache" button or version change

---

### 2. Article

**Purpose**: Represents a blog article from RSS feed displayed in Articles mini-app

**Source**: External RSS XML feed (`https://reactspark.com/rss.xml`) with localStorage fallback

**Schema**:
```typescript
interface Article {
  id: string;                    // Unique identifier (GUID from RSS)
  title: string;                 // Article title
  description: string;           // Article excerpt/summary
  link: string;                  // Absolute URL to full article
  category: string;              // Article category (e.g., "ReactSpark", "Technology")
  pub_date: string;              // Publication date (ISO 8601)
  author?: string;               // Article author
  image_url?: string;            // Featured image URL
  tags?: string[];               // Article tags/keywords
}
```

**Validation Rules**:
- `id`: Required, non-empty string (RSS GUID)
- `title`: Required, non-empty string, max 200 chars
- `description`: Required, non-empty string, max 1000 chars
- `link`: Required, valid URL
- `category`: Required, non-empty string
- `pub_date`: Required, ISO 8601 date string
- `author`: Optional string, max 100 chars
- `image_url`: Optional, valid URL if present
- `tags`: Optional array of strings

**Zod Schema** (see `contracts/rss-api.ts`):
```typescript
const ArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  link: z.string().url(),
  category: z.string().min(1),
  pub_date: z.string().datetime(),
  author: z.string().max(100).optional(),
  image_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});
```

**State Transitions**: N/A (read-only from RSS)

**Relationships**:
- None (standalone entity)
- **Special Case**: About page displays recent "ReactSpark" category articles (filter applied)

**Cache Key**: `articles_v1`

**Lifecycle**:
1. Fetch RSS XML from API
2. Parse XML → JSON objects
3. Validate each article with Zod schema
4. Cache in localStorage
5. Filter by category in ArticlesPage UI
6. Sort by pub_date (newest/oldest)
7. Paginate results (6 per page)

---

### 3. Joke

**Purpose**: Represents a programming joke from JokeAPI displayed in Joke mini-app

**Source**: External API (`https://v2.jokeapi.dev/joke/Programming`)

**Schema**:
```typescript
type JokeType = 'single' | 'twopart';

interface Joke {
  id: number;                    // Unique joke ID from API
  type: JokeType;                // Single-line or two-part joke
  joke?: string;                 // Full joke text (if type=single)
  setup?: string;                // Joke setup (if type=twopart)
  delivery?: string;             // Joke punchline (if type=twopart)
  category: string;              // Always "Programming"
  safe: boolean;                 // Content safety flag
  flags: {                       // Content flags
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
}
```

**Validation Rules**:
- `id`: Required, positive integer
- `type`: Required, 'single' or 'twopart'
- `joke`: Required if type='single', non-empty string
- `setup`, `delivery`: Required if type='twopart', non-empty strings
- `category`: Required, string
- `safe`: Required, boolean
- `flags`: Required, object with boolean fields

**Zod Schema** (see `contracts/joke-api.ts`):
```typescript
const JokeSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.number().int().positive(),
    type: z.literal('single'),
    joke: z.string().min(1),
    category: z.string(),
    safe: z.boolean(),
    flags: z.object({
      nsfw: z.boolean(),
      religious: z.boolean(),
      political: z.boolean(),
      racist: z.boolean(),
      sexist: z.boolean(),
      explicit: z.boolean(),
    }),
  }),
  z.object({
    id: z.number().int().positive(),
    type: z.literal('twopart'),
    setup: z.string().min(1),
    delivery: z.string().min(1),
    category: z.string(),
    safe: z.boolean(),
    flags: z.object({
      nsfw: z.boolean(),
      religious: z.boolean(),
      political: z.boolean(),
      racist: z.boolean(),
      sexist: z.boolean(),
      explicit: z.boolean(),
    }),
  }),
]);
```

**State Transitions**:
```
[Fetched] → [Displayed]
   ↓
[User Likes] → [Liked Jokes List] (localStorage)
   ↓
[User Saves] → [Saved Jokes List] (localStorage)
   ↓
[User Deletes] → [Removed from Saved]
```

**Relationships**:
- **Saved Jokes**: User-managed collection in localStorage (`saved_jokes` key)
- **Liked Jokes**: User-managed collection in localStorage (`liked_jokes` key)

**Cache/Storage Keys**:
- Current joke: Not cached (fetched fresh each time)
- Saved jokes: `saved_jokes` (array of Joke objects)
- Liked jokes: `liked_jokes` (array of joke IDs)

**Lifecycle**:
1. Fetch random joke from JokeAPI
2. Validate with Zod discriminated union schema
3. Display in JokePage
4. User can like (add ID to liked_jokes array)
5. User can save (add full Joke to saved_jokes array)
6. User can delete saved joke (remove from array)
7. User can share via Web Share API

---

### 4. WeatherData

**Purpose**: Represents current weather conditions for a geographic location

**Source**: External API (OpenWeatherMap API, called directly from client)

**Schema**:
```typescript
interface WeatherData {
  city_name: string;             // City name
  country_code: string;          // ISO 3166 country code (e.g., "US")
  coordinates: {
    lat: number;                 // Latitude (-90 to 90)
    lon: number;                 // Longitude (-180 to 180)
  };
  temperature: number;           // Temperature in Fahrenheit
  feels_like: number;            // "Feels like" temperature
  humidity: number;              // Humidity percentage (0-100)
  wind_speed: number;            // Wind speed in mph
  clouds: number;                // Cloud coverage percentage (0-100)
  weather: {
    id: number;                  // Weather condition ID
    main: string;                // Weather main category (e.g., "Clear", "Rain")
    description: string;         // Detailed description (e.g., "light rain")
    icon: string;                // Icon code (e.g., "10d")
  };
  timestamp: number;             // Unix timestamp
}
```

**Validation Rules**:
- `city_name`: Required, non-empty string
- `country_code`: Required, 2-char ISO code
- `coordinates.lat`: Required, -90 to 90
- `coordinates.lon`: Required, -180 to 180
- `temperature`: Required, number
- `feels_like`: Required, number
- `humidity`: Required, 0-100
- `wind_speed`: Required, non-negative number
- `clouds`: Required, 0-100
- `weather`: Required object with all fields
- `timestamp`: Required, positive integer

**Zod Schema** (see `contracts/weather-api.ts`):
```typescript
const WeatherDataSchema = z.object({
  city_name: z.string().min(1),
  country_code: z.string().length(2),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
  temperature: z.number(),
  feels_like: z.number(),
  humidity: z.number().min(0).max(100),
  wind_speed: z.number().nonnegative(),
  clouds: z.number().min(0).max(100),
  weather: z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
  timestamp: z.number().int().positive(),
});
```

**State Transitions**: N/A (stateless queries)

**Relationships**:
- **Recent Searches**: User's search history stored in localStorage

**Cache/Storage Keys**:
- Weather data: `weather_${city_name}` (TTL: 1 hour prod, 5 min dev)
- Recent searches: `weather_recent_searches` (array of city names, max 5)

**Lifecycle**:
1. User searches for city name
2. Fetch weather from OpenWeatherMap API
3. Validate with Zod schema
4. Cache weather data with city-specific key
5. Cache city name in recent searches (FIFO, max 5)
6. Display weather card + Leaflet map
7. User can click recent search to reload

---

### 5. AIVariant

**Purpose**: Represents an AI assistant variant/persona from PromptSpark

**Source**: External API (PromptSpark variants endpoint)

**Schema**:
```typescript
interface AIVariant {
  id: string;                    // Unique variant ID (UUID)
  name: string;                  // Variant display name
  description: string;           // Variant description/purpose
  category: 'GPT Models' | 'Development' | 'Creative' | 'Data Analysis' | 'General';
  model: string;                 // Underlying model (e.g., "gpt-4", "gpt-3.5-turbo")
  temperature: number;           // Model temperature (0.0-2.0)
  system_prompt: string;         // System prompt/instructions
  featured: boolean;             // Display in featured section
  icon?: string;                 // Icon identifier or URL
  tags?: string[];               // Searchable tags
}
```

**Validation Rules**:
- `id`: Required, non-empty string (UUID format)
- `name`: Required, non-empty string, max 100 chars
- `description`: Required, non-empty string, max 500 chars
- `category`: Required, one of enum values
- `model`: Required, non-empty string
- `temperature`: Required, 0.0 to 2.0
- `system_prompt`: Required, non-empty string
- `featured`: Required, boolean
- `icon`: Optional string
- `tags`: Optional array of strings

**Zod Schema** (see `contracts/chat-api.ts`):
```typescript
const AIVariantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: z.enum(['GPT Models', 'Development', 'Creative', 'Data Analysis', 'General']),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  system_prompt: z.string().min(1),
  featured: z.boolean(),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
```

**State Transitions**: N/A (read-only from API)

**Relationships**:
- **Chat Messages**: One variant can have multiple chat messages (one-to-many)

**Cache Key**: `ai_variants_v1`

**Lifecycle**:
1. Fetch variants from PromptSpark API on AIChatPage load
2. Validate with Zod schema
3. Cache in localStorage
4. Display categorized variant cards
5. Filter by category or search term
6. User selects variant → Open chat modal with selected variant

---

### 6. ChatMessage

**Purpose**: Represents a single message in AI chat conversation

**Source**: Real-time SignalR messages (bidirectional)

**Schema**:
```typescript
interface ChatMessage {
  id: string;                    // Unique message ID (UUID)
  variant_id: string;            // AIVariant ID this chat is with
  role: 'user' | 'assistant';    // Message sender
  content: string;               // Message text (Markdown for assistant)
  timestamp: number;             // Unix timestamp
  streaming?: boolean;           // True if message is still streaming
}
```

**Validation Rules**:
- `id`: Required, non-empty string (UUID)
- `variant_id`: Required, UUID matching AIVariant.id
- `role`: Required, 'user' or 'assistant'
- `content`: Required, non-empty string
- `timestamp`: Required, positive integer
- `streaming`: Optional boolean, defaults to false

**Zod Schema** (see `contracts/chat-api.ts`):
```typescript
const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  variant_id: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  timestamp: z.number().int().positive(),
  streaming: z.boolean().optional(),
});
```

**State Transitions**:
```
[User Types] → [User Sends] → [Message Created (role=user)]
                                      ↓
                              [Sent to SignalR Hub]
                                      ↓
                        [Assistant Responds (role=assistant)]
                                      ↓
                        [Streaming=true] → [Content Updates] → [Streaming=false]
```

**Relationships**:
- **AIVariant**: Many-to-one (many messages belong to one variant conversation)

**Storage**: Ephemeral (only in React state during chat session, not persisted)

**Lifecycle**:
1. User sends message → Create ChatMessage with role='user'
2. Emit message to SignalR hub
3. Hub responds with assistant message → Create ChatMessage with role='assistant', streaming=true
4. Hub streams content updates → Update message content
5. Hub signals completion → Set streaming=false
6. Render assistant messages as Markdown via ReactMarkdown
7. Sanitize all content to prevent XSS

---

### 7. MiniApp

**Purpose**: Metadata describing a mini-application for Apps hub discovery page

**Source**: Hardcoded configuration (could be JSON in future)

**Schema**:
```typescript
interface MiniApp {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Display name
  description: string;           // Short description
  route: string;                 // React Router path (e.g., "/apps/projects")
  icon: string;                  // Icon identifier or component name
  category?: string;             // Grouping category (future use)
  featured: boolean;             // Display prominently
}
```

**Validation Rules**:
- `id`: Required, kebab-case string (e.g., "projects")
- `name`: Required, non-empty string, max 50 chars
- `description`: Required, non-empty string, max 200 chars
- `route`: Required, starts with "/apps/"
- `icon`: Required, non-empty string
- `category`: Optional string
- `featured`: Required, boolean

**Hardcoded Data**:
```typescript
const miniApps: MiniApp[] = [
  {
    id: 'projects',
    name: 'Projects',
    description: 'Browse my portfolio of web development projects with search and filtering.',
    route: '/apps/projects',
    icon: 'FolderIcon',
    featured: true,
  },
  {
    id: 'articles',
    name: 'Articles',
    description: 'Read my latest blog articles on React, web development, and technology.',
    route: '/apps/articles',
    icon: 'DocumentTextIcon',
    featured: true,
  },
  {
    id: 'joke',
    name: 'Joke Generator',
    description: 'Get random programming jokes with AI explanations and save your favorites.',
    route: '/apps/joke',
    icon: 'FaceSmileIcon',
    featured: false,
  },
  {
    id: 'weather',
    name: 'Weather Forecast',
    description: 'Search for city weather with interactive maps and recent search history.',
    route: '/apps/weather',
    icon: 'CloudIcon',
    featured: false,
  },
  {
    id: 'ai-chat',
    name: 'AI Chat',
    description: 'Chat with AI assistants using various models and specialized personas.',
    route: '/apps/ai-chat',
    icon: 'ChatBubbleLeftRightIcon',
    featured: true,
  },
];
```

**State Transitions**: N/A (static configuration)

**Relationships**: None (descriptive metadata only)

**Lifecycle**:
1. Import miniApps configuration in AppsHubPage
2. Render MiniAppCard for each app in grid layout
3. User clicks "Launch" → Navigate to app.route

---

### 8. UserPreferences

**Purpose**: User-specific preferences and settings persisted across sessions

**Source**: localStorage

**Schema**:
```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';  // Theme preference
  chat_user_name?: string;             // User's name for chat
  saved_jokes: Joke[];                 // Saved joke collection
  liked_jokes: number[];               // Liked joke IDs
  weather_recent_searches: string[];   // Recent weather city searches (max 5)
}
```

**Validation Rules**:
- `theme`: Required, one of enum values
- `chat_user_name`: Optional string, max 50 chars
- `saved_jokes`: Array of Joke objects (validated individually)
- `liked_jokes`: Array of positive integers
- `weather_recent_searches`: Array of strings, max length 5

**Storage Keys**:
- `theme`
- `chat_user_name`
- `saved_jokes`
- `liked_jokes`
- `weather_recent_searches`

**State Transitions**:
```
[First Visit] → Detect system preference → Set theme
[User Changes Theme] → Update localStorage + DOM class
[User Sets Name] → Save to localStorage
[User Saves Joke] → Append to saved_jokes array
[User Deletes Joke] → Remove from saved_jokes array
[User Likes Joke] → Add ID to liked_jokes array
[User Searches Weather] → Prepend city to recent_searches (pop last if > 5)
```

**Relationships**:
- **Jokes**: Contains array of saved Joke entities
- **MiniApps**: Preferences used across multiple mini-apps (shared via context)

**Lifecycle**:
1. Load preferences from localStorage on app initialization
2. Provide via ThemeContext and custom hooks
3. Update localStorage on preference changes
4. Clear all except theme/name on cache clear (version updates)

---

## Entity Relationships Diagram

```
┌─────────────────┐
│  UserPreferences│
└────────┬────────┘
         │
         ├── saved_jokes ──────> [Joke]
         ├── liked_jokes ──────> [Joke.id]
         └── weather_recent_searches ──> [WeatherData.city_name]

┌─────────────────┐
│    MiniApp      │  (metadata only, no foreign keys)
└─────────────────┘

┌─────────────────┐
│    Project      │  (standalone, no relationships)
└─────────────────┘

┌─────────────────┐
│    Article      │  (standalone, no relationships)
└─────────────────┘

┌─────────────────┐
│      Joke       │  (standalone, referenced by UserPreferences)
└─────────────────┘

┌─────────────────┐
│  WeatherData    │  (standalone, city_name referenced by UserPreferences)
└─────────────────┘

┌─────────────────┐     1:N     ┌──────────────────┐
│   AIVariant     │─────────────→│  ChatMessage     │
└─────────────────┘              └──────────────────┘
   (variant_id)                      (variant_id FK)
```

**Relationship Types**:
- **One-to-Many**: AIVariant → ChatMessage (one variant can have many messages in a conversation)
- **Reference**: UserPreferences references Joke entities (saved_jokes array)
- **Reference**: UserPreferences references Joke IDs (liked_jokes array)
- **Reference**: UserPreferences references city names (weather_recent_searches array)
- **Standalone**: Project, Article, MiniApp have no relationships

---

## State Management Strategy

### Global State (React Context)

**ThemeContext**:
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}
```
- Manages current theme state
- Persists to localStorage
- Updates DOM `<html>` class for Tailwind `.dark` strategy

**SEOContext**:
```typescript
interface SEOContextType {
  metadata: SEOMetadata;
  setMetadata: (meta: Partial<SEOMetadata>) => void;
}
```
- Manages per-route meta tags
- Updates document title, meta description, OG tags
- No persistence needed (ephemeral)

**ServicesContext**:
```typescript
interface ServicesContextType {
  projectsService: ProjectsService;
  articlesService: ArticlesService;
  jokeService: JokeService;
  weatherService: WeatherService;
  chatsService: ChatService;
}
```
- Provides singleton service instances
- Enables shared caching across mini-apps
- Supports testability through provider mocking

---

### Local State (Component State)

**Mini-App Pages** (useState for UI state):
- ProjectsPage: `searchTerm`, `sortBy`, `currentPage`, `projects`, `loading`, `error`
- ArticlesPage: `selectedCategory`, `sortOrder`, `currentPage`, `articles`, `loading`, `error`
- JokePage: `currentJoke`, `loading`, `savedJokes`, `likedJokes`
- WeatherPage: `searchInput`, `weatherData`, `recentSearches`, `loading`, `error`
- AIChatPage: `selectedVariant`, `chatMessages`, `inputText`, `connectionStatus`

**Shared Components** (useState for internal state):
- AppsDropdown: `isOpen`
- Modal: `isOpen`
- Pagination: `currentPage`

---

### Persistent State (localStorage)

**Cache Keys**:
- `projects_v1`: Cached Project[] with version + timestamp
- `articles_v1`: Cached Article[] with version + timestamp
- `weather_${city}`: Cached WeatherData per city
- `ai_variants_v1`: Cached AIVariant[]

**User Preferences**:
- `theme`: 'light' | 'dark'
- `chat_user_name`: string
- `saved_jokes`: Joke[]
- `liked_jokes`: number[]
- `weather_recent_searches`: string[]

**Cache Invalidation**:
- Version change: Clear all cache keys with version mismatch
- TTL expiration: Clear cache keys older than TTL (5min dev, 1hr prod)
- Manual "Refresh Cache" button: Clear specific cache key, re-fetch

---

### Transient State (Session Only)

**Not Persisted**:
- ChatMessage[]: Only exists during chat session, cleared on modal close
- Connection status (SignalR): Ephemeral, reconnects on page reload
- Search results: Re-filtered on each user input
- Pagination state: Resets on page load

---

## Data Flow Diagrams

### Projects Mini-App Data Flow

```
[User] → [ProjectsPage Component]
            ↓
    [useProjects Hook]
            ↓
    [ProjectsService.getProjects()]
            ↓
    Check localStorage cache (projects_v1)
            ↓
    Cache Hit?
    ├─ YES → Return cached Project[]
    │         ↓
    │    [Validate with Zod]
    │         ↓
    │    [Render ProjectCard components]
    │
    └─ NO → Fetch from API (https://markhazleton.com/projects.json)
              ↓
        [Validate with Zod ProjectSchema]
              ↓
        [Cache in localStorage]
              ↓
        [Return Project[]]
              ↓
        [Render ProjectCard components]
              ↓
        [User Searches] → Filter Project[] → Re-render
        [User Sorts] → Sort Project[] → Re-render
        [User Paginates] → Slice Project[] → Re-render
```

---

### Articles Mini-App Data Flow

```
[User] → [Articles Page Component]
            ↓
    [useArticles Hook]
            ↓
    [ArticlesService.getArticles()]
            ↓
    Check localStorage cache (articles_v1)
            ↓
    Cache Hit?
    ├─ YES → Return cached Article[]
    │
    └─ NO → Fetch RSS XML (https://reactspark.com/rss.xml)
              ↓
        [Parse XML to JSON]
              ↓
        [Validate with Zod ArticleSchema]
              ↓
        [Cache in localStorage]
              ↓
        [Return Article[]]
              ↓
        [Filter by category] → Re-render
        [Sort by pub_date] → Re-render
        [Paginate (6 per page)] → Re-render
```

---

### Joke Mini-App Data Flow

```
[User] → [JokePage Component]
            ↓
    Load saved_jokes from localStorage
    Load liked_jokes from localStorage
            ↓
    [useJokes Hook]
            ↓
    [JokeService.getRandomJoke()]
            ↓
    Fetch from JokeAPI (https://v2.jokeapi.dev/joke/Programming)
            ↓
    [Validate with Zod JokeSchema (discriminated union)]
            ↓
    [Display JokeCard]
            ↓
    User Actions:
    ├─ [Like] → Add joke.id to liked_jokes → Save to localStorage
    ├─ [Save] → Add joke to saved_jokes → Save to localStorage
    ├─ [Share] → Web Share API
    └─ [Explain] → Open Modal → SignalR chat (separate flow)

[View Saved Jokes]
    ↓
Load saved_jokes from localStorage
    ↓
Display list of JokeCard components
    ↓
[User Deletes] → Remove from saved_jokes → Save to localStorage
```

---

### Weather Mini-App Data Flow

```
[User] → [WeatherPage Component]
            ↓
    Load weather_recent_searches from localStorage
            ↓
    Display default weather (Dallas, Wichita) on initial load
            ↓
    [User Searches City]
            ↓
    [useWeather Hook]
            ↓
    [WeatherService.getWeather(cityName)]
            ↓
    Check cache (weather_${city})
    ├─ Cache Hit → Return WeatherData
    │
    └─ Cache Miss → Fetch OpenWeatherMap API
                      ↓
                [Validate with Zod WeatherDataSchema]
                      ↓
                [Cache in localStorage]
                      ↓
                [Update recent_searches (FIFO max 5)]
                      ↓
                [Return WeatherData]
                      ↓
                [Render WeatherCard]
                      ↓
                [Render Leaflet Map with marker at coordinates]
                      ↓
    [User Clicks Recent Search] → Load cached weather → Re-render
```

---

### AI Chat Mini-App Data Flow

```
[User] → [AIChatPage Component]
            ↓
    [useVariants Hook]
            ↓
    [VariantsService.getVariants()]
            ↓
    Check cache (ai_variants_v1)
    ├─ Cache Hit → Return AIVariant[]
    │
    └─ Cache Miss → Fetch PromptSpark API
                      ↓
                [Validate with Zod AIVariantSchema]
                      ↓
                [Cache in localStorage]
                      ↓
                [Return AIVariant[]]
                      ↓
    [Display VariantCard grid, categorized]
            ↓
    [User Filters by Category] → Filter AIVariant[] → Re-render
    [User Searches] → Filter by name/description → Re-render
            ↓
    [User Clicks "Start Chat"]
            ↓
    [Open Modal with ChatInterface]
            ↓
    [useSignalR Hook]
            ↓
    [Establish SignalR Connection]
            ↓
    Connection States:
    ├─ Connecting → Show loading spinner
    ├─ Connected → Enable chat input
    ├─ Reconnecting → Show warning
    └─ Disconnected → Show error, retry button
            ↓
    [User Sends Message]
            ↓
    Create ChatMessage (role=user)
    Add to messages array (local state)
    Emit to SignalR hub
            ↓
    [Hub Responds]
            ↓
    Create ChatMessage (role=assistant, streaming=true)
    Add to messages array
            ↓
    [Hub Streams Content]
            ↓
    Update message.content on each chunk
            ↓
    [Hub Signals Complete]
            ↓
    Set streaming=false
            ↓
    [Render Messages with ReactMarkdown]
    [Sanitize assistant content to prevent XSS]
            ↓
    [User Closes Modal] → Disconnect SignalR → Clear messages
```

---

## Summary

This data model defines **8 core entities** with comprehensive schemas, validation rules (Zod), and lifecycle flows for the ReactSparkPortfolio migration. Key characteristics:

- **Type Safety**: All entities have TypeScript interfaces + Zod schemas for runtime validation
- **Caching Strategy**: Version-based, TTL-aware caching in localStorage for performance
- **Shared State**: Singleton services, global contexts (Theme, SEO, Services) across mini-apps
- **Relationships**: Minimal coupling - only AIVariant → ChatMessage and UserPreferences references
- **State Management**: Clear separation of global (Context), local (useState), persistent (localStorage), and transient (session-only) state

**Next Phase**: Generate API contracts (Phase 1 continued).
