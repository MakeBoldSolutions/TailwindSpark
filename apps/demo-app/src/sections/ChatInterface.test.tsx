import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AIVariant } from '../types/chat-api';
import ChatInterface from './ChatInterface';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const mockSendMessage = vi.fn();
const mockClearMessages = vi.fn();

vi.mock('../hooks/useSignalR', () => ({
  useSignalR: () => ({
    messages: [
      { id: '1', role: 'user', content: 'Hello', timestamp: Date.now(), streaming: false },
      { id: '2', role: 'assistant', content: 'Hi there!', timestamp: Date.now(), streaming: false },
    ],
    connectionStatus: 'connected' as const,
    isAssistantTyping: false,
    connectionError: null,
    sendMessage: mockSendMessage,
    clearMessages: mockClearMessages,
  }),
}));

vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <span>{children}</span>,
}));

const mockVariant: AIVariant = {
  definitionId: 1,
  name: 'Test Bot',
  description: 'A test bot',
  created: '2025-01-01T00:00:00.000Z',
  definitionType: 'Test',
  definitionTypes: ['Test'],
  updated: '2025-01-01T00:00:00.000Z',
  urlEncodedName: 'Test%20Bot',
  outputType: 1,
  prompt: 'You are a test bot',
  promptHash: 'hash',
  role: 1,
  model: 'gpt-4o-mini',
  temperature: '0.7',
  definitionResponses: [],
  conversationId: '11111111-1111-1111-1111-111111111111',
  slug: 'test-bot',
};

describe('ChatInterface', () => {
  beforeEach(() => {
    // localStorage is mocked in setup.ts with vi.fn() - configure getItem to return a name
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === 'chat_user_name') return 'TestUser';
      return null;
    });
    // jsdom doesn't support scrollIntoView
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.mocked(localStorage.getItem).mockReset();
  });

  it('renders variant name in header', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByText('Test Bot')).toBeTruthy();
  });

  it('renders messages', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('Hi there!')).toBeTruthy();
  });

  it('renders connection status', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByText('connected')).toBeTruthy();
  });

  it('has back button', () => {
    const onBack = vi.fn();
    render(<ChatInterface variant={mockVariant} onBack={onBack} />);
    expect(screen.getByLabelText('Back to variant selection')).toBeTruthy();
  });

  it('calls onBack when back button clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<ChatInterface variant={mockVariant} onBack={onBack} />);
    await user.click(screen.getByLabelText('Back to variant selection'));
    expect(onBack).toHaveBeenCalled();
  });

  it('has chat input field', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByLabelText('Chat message')).toBeTruthy();
  });

  it('has Send button', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
  });

  it('has Clear button', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeTruthy();
  });

  it('shows name prompt when no user name is set', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByText('Welcome to AI Chat')).toBeTruthy();
    expect(screen.getByLabelText('Your display name')).toBeTruthy();
  });

  it.each(themeMatrix)('keeps chat interface content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);

    expect(screen.getByText('Test Bot')).toBeTruthy();
    expect(screen.getByLabelText('Chat message')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
  });
});
