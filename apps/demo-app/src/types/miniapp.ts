/**
 * Describes a mini-app entry shown in the apps hub.
 */
export interface MiniApp {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
}

/**
 * Static metadata for the demo app mini-app navigation.
 */
export const miniAppsData: MiniApp[] = [
  {
    id: 'projects',
    name: 'Projects',
    description: 'Explore portfolio projects with search, filter, and pagination.',
    route: '/apps/projects',
    icon: '📁',
  },
  {
    id: 'articles',
    name: 'Articles',
    description: 'Browse blog articles from the RSS feed with category filtering.',
    route: '/apps/articles',
    icon: '📰',
  },
  {
    id: 'joke',
    name: 'Joke Generator',
    description: 'Get random programming jokes. Like, save, and share your favorites.',
    route: '/apps/joke',
    icon: '😂',
  },
  {
    id: 'weather',
    name: 'Weather Forecast',
    description: 'Search weather by city with interactive maps and recent searches.',
    route: '/apps/weather',
    icon: '🌤️',
  },
  {
    id: 'ai-chat',
    name: 'AI Chat',
    description: 'Chat with AI variants powered by PromptSpark in real-time.',
    route: '/apps/ai-chat',
    icon: '🤖',
  },
  {
    id: 'repos',
    name: 'Repositories',
    description: 'Explore Mark Hazleton GitHub repositories with search, filtering, and detailed analytics.',
    route: '/apps/repos',
    icon: '📊',
  },
];
