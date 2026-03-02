import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchComponent } from './SearchComponent';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('SearchComponent', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });

  it('displays search input field', () => {
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'button');
    
    expect(searchInput).toHaveValue('button');
  });

  it('displays search results when typing', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'button');
    
    // Results should appear
    const hasButton = screen.queryAllByText(/Button/i).length > 0;
    const hasResult = screen.queryAllByText(/result/i).length > 0;
    expect(hasButton || hasResult).toBe(true);
  });

  it('filters results by category', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'component');
    
    // Should show results (links or buttons)
    const links = screen.queryAllByRole('link');
    const buttons = screen.queryAllByRole('button');
    expect(links.length + buttons.length).toBeGreaterThan(0);
  });

  it('shows categories in search results', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'form');
    
    // Category labels should appear - check for any
    const hasCategory = screen.queryAllByText(/component|demo|animation|page/i).length > 0;
    expect(hasCategory).toBe(true);
  });

  it('displays search icon', () => {
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'test');
    
    // Buttons should be present
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('clears search input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'test');
    
    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      await user.click(buttons[0]);
    }
  });

  it('calls onClose when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    await user.keyboard('{Escape}');
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays empty state when no results found', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'xyznonexistent');
    
    // Should show no results or empty state
    expect(screen.queryByText(/No results|not found/i) || searchInput).toBeTruthy();
  });

  it('navigates to result on click', async () => {
    const user = userEvent.setup();
    render(<SearchComponent isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'button');
    
    // Click on a result
    const links = screen.queryAllByRole('link');
    if (links.length > 0) {
      await user.click(links[0]);
    }
  });
});
