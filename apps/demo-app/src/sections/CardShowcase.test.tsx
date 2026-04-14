import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardShowcase } from './CardShowcase';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

describe('CardShowcase', () => {
  it('renders without crashing', () => {
    render(<CardShowcase />);
    expect(screen.getByText(/Card Components/i)).toBeInTheDocument();
  });

  it('displays card components heading', () => {
    render(<CardShowcase />);
    const heading = screen.getByRole('heading', { level: 2, name: /Card Components/i });
    expect(heading).toBeInTheDocument();
  });

  it('shows all card variants', () => {
    render(<CardShowcase />);
    expect(screen.getByText(/Default Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Bordered Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Elevated Card/i)).toBeInTheDocument();
  });

  it('displays card variant descriptions', () => {
    render(<CardShowcase />);
    expect(screen.getByText(/A simple card with default styling/i)).toBeInTheDocument();
    expect(screen.getByText(/A card with visible borders/i)).toBeInTheDocument();
    expect(screen.getByText(/A card with shadow for a floating appearance/i)).toBeInTheDocument();
  });

  it('renders profile cards section', () => {
    render(<CardShowcase />);
    expect(screen.getByRole('heading', { level: 3, name: /Profile Cards/i })).toBeInTheDocument();
  });

  it('displays profile card with name', () => {
    render(<CardShowcase />);
    expect(screen.getByText(/Sarah Johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/Senior Frontend Developer/i)).toBeInTheDocument();
  });

  it('shows profile card details with icons', () => {
    render(<CardShowcase />);
    expect(screen.getByText(/San Francisco, CA/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined March 2022/i)).toBeInTheDocument();
    expect(screen.getByText(/4.9 rating/i)).toBeInTheDocument();
  });

  it('renders multiple profile cards', () => {
    render(<CardShowcase />);
    expect(screen.getByText(/Sarah Johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/Alex Chen/i)).toBeInTheDocument();
  });

  it('displays view profile buttons', () => {
    render(<CardShowcase />);
    const viewProfileButtons = screen.getAllByRole('button', { name: /View Profile/i });
    expect(viewProfileButtons.length).toBeGreaterThan(0);
  });

  it('shows card headers with titles and subtitles', () => {
    render(<CardShowcase />);
    
    // CardHeader with title and subtitle
    expect(screen.getByText(/Sarah Johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/Senior Frontend Developer/i)).toBeInTheDocument();
  });

  it('renders card content sections', () => {
    render(<CardShowcase />);
    
    // Card content with information
    const cardContent = document.querySelectorAll('[class*="space-y"]');
    expect(cardContent.length).toBeGreaterThan(0);
  });

  it('displays card footers with actions', () => {
    render(<CardShowcase />);
    
    // Footer buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders cards in grid layout', () => {
    render(<CardShowcase />);
    
    // Grid layout for cards
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('shows responsive grid classes', () => {
    render(<CardShowcase />);
    
    // Responsive grid (md:grid-cols-3, etc.)
    const responsiveGrids = document.querySelectorAll('[class*="md:grid-cols"], [class*="lg:grid-cols"]');
    expect(responsiveGrids.length).toBeGreaterThan(0);
  });

  it('displays icons within cards', () => {
    render(<CardShowcase />);
    
    // Icons (MapPin, Calendar, Star, User)
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('renders card badges or status indicators', () => {
    render(<CardShowcase />);
    
    // Status or rating badges
    expect(screen.getByText(/4.9 rating/i)).toBeInTheDocument();
  });

  it('shows proper card spacing', () => {
    render(<CardShowcase />);
    
    // Cards should have gap/space classes
    const spacedElements = document.querySelectorAll('[class*="gap"]');
    expect(spacedElements.length).toBeGreaterThan(0);
  });

  it.each(themeMatrix)('keeps card showcase content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    render(<CardShowcase />);

    expect(screen.getByRole('heading', { level: 2, name: /Card Components/i })).toBeInTheDocument();
    expect(screen.getByText(/Default Card/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Profile Cards/i })).toBeInTheDocument();
  });
});
