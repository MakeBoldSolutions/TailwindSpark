import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AIVariant } from '../types/chat-api';
import VariantCard from './VariantCard';

const mockVariant: AIVariant = {
  definitionId: 1,
  name: 'Test Variant',
  description: 'A test AI variant for unit testing.',
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-15T00:00:00Z',
  urlEncodedName: 'test-variant',
  outputType: 1,
  prompt: 'You are a test assistant.',
  promptHash: 'abc123',
  definitionType: 'Conversational',
  definitionTypes: ['Conversational'],
  role: 1,
  model: 'gpt-4o',
  temperature: '0.7',
  definitionResponses: [],
  conversationId: '00000000-0000-0000-0000-000000000001',
  slug: 'test-variant',
};

const defaultProps = {
  variant: mockVariant,
  isSelected: false,
  onSelect: vi.fn(),
};

describe('VariantCard', () => {
  it('renders variant name', () => {
    render(<VariantCard {...defaultProps} />);
    expect(screen.getByText('Test Variant')).toBeInTheDocument();
  });

  it('renders variant description', () => {
    render(<VariantCard {...defaultProps} />);
    expect(screen.getByText(/test AI variant/i)).toBeInTheDocument();
  });

  it('renders definitionType badge', () => {
    render(<VariantCard {...defaultProps} />);
    expect(screen.getByText('Conversational')).toBeInTheDocument();
  });

  it('renders model badge', () => {
    render(<VariantCard {...defaultProps} />);
    expect(screen.getByText('gpt-4o')).toBeInTheDocument();
  });

  it('renders temperature indicator', () => {
    render(<VariantCard {...defaultProps} />);
    expect(screen.getByTitle('Temperature')).toBeInTheDocument();
  });

  it('renders featured badge when isFeatured is true', () => {
    render(<VariantCard {...defaultProps} isFeatured />);
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
  });

  it('does not render featured badge by default', () => {
    render(<VariantCard {...defaultProps} />);
    expect(screen.queryByText(/Featured/i)).not.toBeInTheDocument();
  });

  it('calls onSelect when Start Chat clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<VariantCard {...defaultProps} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: /Start Chat with Test Variant/i }));
    expect(onSelect).toHaveBeenCalledWith(mockVariant);
  });

  it('shows selected styling when isSelected is true', () => {
    const { container } = render(<VariantCard {...defaultProps} isSelected />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-brand');
  });
});
