import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import AIChatPage from '../pages/apps/AIChatPage';
import ArticlesPage from '../pages/apps/ArticlesPage';
import JokePage from '../pages/apps/JokePage';
import ProjectsPage from '../pages/apps/ProjectsPage';
import WeatherPage from '../pages/apps/WeatherPage';

vi.mock('../contexts/SEOContext', async importOriginal => {
  const actual = await importOriginal<typeof import('../contexts/SEOContext')>();
  return {
    ...actual,
    useSEO: () => ({ seo: { title: 'Test', description: 'Test description' }, setSEO: vi.fn() }),
  };
});

vi.mock('../hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [
      {
        id: 1,
        name: 'Example Project',
        description: 'Project description',
        image_url: 'https://example.com/image.png',
        project_url: 'https://example.com/project',
        status: 'Active',
        technologies: ['React'],
      },
    ],
    loading: false,
    error: null,
    refreshCache: vi.fn(),
  }),
}));

vi.mock('../hooks/useArticles', () => ({
  useArticles: () => ({
    articles: [
      {
        id: '1',
        title: 'Example Article',
        description: 'Article description',
        link: 'https://example.com/article',
        category: 'Technology',
        pub_date: '2026-03-01T00:00:00.000Z',
        author: 'Mark',
      },
    ],
    loading: false,
    error: null,
    refreshCache: vi.fn(),
  }),
}));

vi.mock('../hooks/useJokes', () => ({
  useJokes: () => ({
    currentJoke: {
      id: 1,
      type: 'single',
      joke: 'Why do programmers prefer dark mode? Because light attracts bugs.',
      category: 'Programming',
      safe: true,
      flags: { nsfw: false, religious: false, political: false, racist: false, sexist: false, explicit: false },
    },
    savedJokes: [],
    likedJokeIds: [],
    history: [],
    loading: false,
    error: null,
    fetchNewJoke: vi.fn(),
    handleSave: vi.fn(),
    handleDelete: vi.fn(),
    handleLike: vi.fn(),
  }),
}));

vi.mock('../hooks/useWeather', () => ({
  useWeather: () => ({
    weatherResults: [
      {
        city_name: 'Dallas',
        country_code: 'US',
        coordinates: { lat: 32.7767, lon: -96.797 },
        temperature: 72,
        feels_like: 70,
        humidity: 40,
        wind_speed: 10,
        clouds: 20,
        weather: { id: 1, main: 'Clear', description: 'clear sky', icon: '01d' },
        timestamp: Date.now(),
      },
    ],
    recentSearches: [{ city_name: 'Dallas', timestamp: Date.now() }],
    loading: false,
    error: null,
    searchCity: vi.fn(),
  }),
}));

vi.mock('../hooks/useVariants', () => ({
  useVariants: () => ({
    variants: [
      {
        definitionId: 1,
        name: 'Helper Bot',
        description: 'Helpful assistant',
        created: '2026-03-01T00:00:00.000Z',
        updated: '2026-03-01T00:00:00.000Z',
        urlEncodedName: 'Helper%20Bot',
        outputType: 1,
        prompt: 'Be helpful',
        promptHash: 'hash',
        definitionType: 'General',
        definitionTypes: ['General'],
        role: 1,
        model: 'gpt-4o-mini',
        temperature: '0.7',
        definitionResponses: [],
        conversationId: '11111111-1111-1111-1111-111111111111',
        slug: 'helper-bot',
      },
    ],
    categories: ['General'],
    loading: false,
    error: null,
    filterByCategory: vi.fn(),
    searchVariants: vi.fn(),
    filteredVariants: [
      {
        definitionId: 1,
        name: 'Helper Bot',
        description: 'Helpful assistant',
        created: '2026-03-01T00:00:00.000Z',
        updated: '2026-03-01T00:00:00.000Z',
        urlEncodedName: 'Helper%20Bot',
        outputType: 1,
        prompt: 'Be helpful',
        promptHash: 'hash',
        definitionType: 'General',
        definitionTypes: ['General'],
        role: 1,
        model: 'gpt-4o-mini',
        temperature: '0.7',
        definitionResponses: [],
        conversationId: '11111111-1111-1111-1111-111111111111',
        slug: 'helper-bot',
      },
    ],
  }),
}));

vi.mock('../hooks/useSignalR', () => ({
  useSignalR: () => ({
    messages: [],
    connectionStatus: 'connected',
    isAssistantTyping: false,
    connectionError: null,
    sendMessage: vi.fn(),
    clearMessages: vi.fn(),
  }),
}));

vi.mock('../sections/WeatherMap', () => ({
  WeatherMap: () => <div aria-label="Weather map">Map</div>,
}));

describe('accessibility audit', () => {
  it('renders the app shell without critical axe violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the projects page without critical axe violations', async () => {
    const { container } = render(<ProjectsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the articles page without critical axe violations', async () => {
    const { container } = render(<ArticlesPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the joke page without critical axe violations', async () => {
    const { container } = render(<JokePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the weather page without critical axe violations', async () => {
    const { container } = render(<WeatherPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the ai chat page without critical axe violations', async () => {
    const { container } = render(<AIChatPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});