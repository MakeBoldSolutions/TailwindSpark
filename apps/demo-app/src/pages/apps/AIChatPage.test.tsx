import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../../contexts/SEOContext';
import AIChatPage from './AIChatPage';

const mockVariants = [
  {
    definitionId: '1',
    name: 'Creative Writer',
    description: 'Generates creative text',
    definitionType: 'Writing',
    systemMessage: 'You are a creative writer.',
    promptOverride: '',
    responseControl: '',
    updated: '2025-01-15',
    tags: ['creative'],
  },
  {
    definitionId: '2',
    name: 'Code Helper',
    description: 'Helps with code',
    definitionType: 'Coding',
    systemMessage: 'You are a code helper.',
    promptOverride: '',
    responseControl: '',
    updated: '2025-01-10',
    tags: ['code'],
  },
];

const mockFilterByCategory = vi.fn();
const mockSearchVariants = vi.fn();

vi.mock('../../hooks/useVariants', () => ({
  useVariants: () => ({
    categories: ['Writing', 'Coding'],
    loading: false,
    error: null,
    filterByCategory: mockFilterByCategory,
    searchVariants: mockSearchVariants,
    filteredVariants: mockVariants,
  }),
}));

vi.mock('../../sections/ChatInterface', () => ({
  default: ({ variant, onBack }: { variant: { name: string }; onBack: () => void }) => (
    <div>
      <span>Chat with {variant.name}</span>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('../../sections/VariantCard', () => ({
  default: ({ variant, onSelect }: { variant: { name: string; definitionId: string }; onSelect: (v: unknown) => void }) => (
    <button onClick={() => onSelect(variant)} data-testid={`variant-${variant.definitionId}`}>
      {variant.name}
    </button>
  ),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <AIChatPage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('AIChatPage', () => {
  it('renders heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /AI Chat/i })).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderPage();
    expect(screen.getByLabelText('Search AI variants')).toBeInTheDocument();
  });

  it('renders category filter', () => {
    renderPage();
    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument();
  });

  it('renders variant names', () => {
    renderPage();
    expect(screen.getByText('Creative Writer')).toBeInTheDocument();
    expect(screen.getByText('Code Helper')).toBeInTheDocument();
  });

  it('opens chat on variant selection', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId('variant-1'));
    expect(screen.getByText('Chat with Creative Writer')).toBeInTheDocument();
  });

  it('goes back from chat to variant list', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId('variant-1'));
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { level: 1, name: /AI Chat/i })).toBeInTheDocument();
  });
});
