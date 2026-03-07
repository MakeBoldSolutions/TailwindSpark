import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ChatInterface from './ChatInterface';

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

const mockVariant = {
  definitionId: '1',
  name: 'Test Bot',
  description: 'A test bot',
  definitionType: 'Test',
  systemMessage: 'You are a test bot',
  promptOverride: '',
  responseControl: '',
  updated: '2025-01-01',
  tags: [],
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
    expect(screen.getByText('Test Bot')).toBeInTheDocument();
  });

  it('renders messages', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('renders connection status', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByText('connected')).toBeInTheDocument();
  });

  it('has back button', () => {
    const onBack = vi.fn();
    render(<ChatInterface variant={mockVariant} onBack={onBack} />);
    expect(screen.getByLabelText('Back to variant selection')).toBeInTheDocument();
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
    expect(screen.getByLabelText('Chat message')).toBeInTheDocument();
  });

  it('has Send button', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('has Clear button', () => {
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('shows name prompt when no user name is set', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    render(<ChatInterface variant={mockVariant} onBack={vi.fn()} />);
    expect(screen.getByText('Welcome to AI Chat')).toBeInTheDocument();
    expect(screen.getByLabelText('Your display name')).toBeInTheDocument();
  });
});
