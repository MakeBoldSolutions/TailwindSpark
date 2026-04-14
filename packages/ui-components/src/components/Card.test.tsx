import { render, screen } from '@testing-library/react';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders basic card with children', () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default variant and padding classes', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass(
      'rounded-panel',
      'transition-all',
      'duration-200',
      'bg-[var(--card-bg)]',
      'p-6'
    );
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Card variant="bordered" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('border', 'border-[color:var(--card-border)]');

    rerender(<Card variant="elevated" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('shadow-card');

    rerender(<Card variant="default" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('bg-[var(--card-bg)]');
  });

  it('applies padding classes correctly', () => {
    const { rerender } = render(<Card padding="sm" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('p-4');

    rerender(<Card padding="lg" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('p-8');

    rerender(<Card padding="none" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).not.toHaveClass('p-4', 'p-6', 'p-8');
  });

  it('renders header when provided', () => {
    render(<Card header="Test Header">Content</Card>);
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer="Test Footer">Content</Card>);
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });

  it('renders both header and footer', () => {
    render(
      <Card header="Test Header" footer="Test Footer">
        Content
      </Card>
    );
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('spreads additional props to the div element', () => {
    render(<Card data-custom="test" aria-label="test card">Content</Card>);
    const card = screen.getByLabelText('test card');
    expect(card).toHaveAttribute('data-custom', 'test');
  });

  it('applies custom className alongside default classes', () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class', 'rounded-panel', 'bg-[var(--card-bg)]');
  });
});

describe('CardHeader', () => {
  it('renders with title and subtitle', () => {
    render(<CardHeader title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders with only title', () => {
    render(<CardHeader title="Only Title" />);
    expect(screen.getByText('Only Title')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(<CardHeader>Custom Header Content</CardHeader>);
    expect(screen.getByText('Custom Header Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>);
    expect(screen.getByTestId('header')).toHaveClass('custom-header');
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Card content here</CardContent>);
    expect(screen.getByText('Card content here')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);
    expect(screen.getByTestId('content')).toHaveClass('custom-content');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});