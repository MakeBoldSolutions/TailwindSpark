import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Modal, ModalContent, ModalFooter, ModalHeader } from './Modal';

// Mock the animate-scale-in class for testing
beforeEach(() => {
  document.body.style.overflow = '';
});

afterEach(() => {
  document.body.style.overflow = '';
  vi.clearAllMocks();
});

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toHaveClass('text-lg', 'font-semibold');
  });

  it('renders close button by default', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('does not render close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} showCloseButton={false}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when Escape key is pressed and closeOnEscape is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={false}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    // Click on the overlay (the flex container, not the modal content)
    const overlay = screen.getByText('Modal content').closest('.flex');
    if (overlay) {
      fireEvent.click(overlay);
    }
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
        <div>Modal content</div>
      </Modal>
    );
    
    const overlay = screen.getByText('Modal content').closest('.flex');
    if (overlay) {
      fireEvent.click(overlay);
    }
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByText('Modal content'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="sm">
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal content').closest('.relative')).toHaveClass('max-w-md');
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="lg">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Modal content').closest('.relative')).toHaveClass('max-w-2xl');
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="xl">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Modal content').closest('.relative')).toHaveClass('max-w-4xl');
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="full">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Modal content').closest('.relative')).toHaveClass('max-w-full');
  });

  it('applies default md size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal content').closest('.relative')).toHaveClass('max-w-lg');
  });

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-modal-class">
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal content').closest('.relative')).toHaveClass('custom-modal-class');
  });

  it('sets body overflow to hidden when open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('resets body overflow when closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('cleans up event listeners and body overflow on unmount', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('ignores other key presses', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.keyDown(document, { key: 'Space' });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders with z-50 class for proper layering', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal content').closest('.fixed')).toHaveClass('z-50');
  });

  it('renders backdrop with proper styling', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    const backdrop = document.querySelector('[class*="bg-[color:var(--modal-overlay)]"]');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass('fixed', 'inset-0');
  });
});

describe('ModalHeader Component', () => {
  it('renders with title only', () => {
    render(<ModalHeader title="Header Title" />);
    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByText('Header Title')).toHaveClass('text-lg', 'font-semibold');
  });

  it('renders with subtitle only', () => {
    render(<ModalHeader subtitle="Header subtitle" />);
    expect(screen.getByText('Header subtitle')).toBeInTheDocument();
    expect(screen.getByText('Header subtitle')).toHaveClass('text-sm');
  });

  it('renders with both title and subtitle', () => {
    render(<ModalHeader title="Main Title" subtitle="Secondary text" />);
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Secondary text')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <ModalHeader>
        <div>Custom header content</div>
      </ModalHeader>
    );
    expect(screen.getByText('Custom header content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ModalHeader className="custom-header" title="Test" />);
    expect(screen.getByText('Test').closest('div')).toHaveClass('custom-header');
  });

  it('applies default mb-4 class', () => {
    render(<ModalHeader title="Test" />);
    expect(screen.getByText('Test').closest('div')).toHaveClass('mb-4');
  });

  it('forwards additional props', () => {
    render(<ModalHeader title="Test" data-testid="modal-header" />);
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
  });

  it('renders with title, subtitle, and children combined', () => {
    render(
      <ModalHeader title="Main Title" subtitle="Subtitle text">
        <button>Action Button</button>
      </ModalHeader>
    );
    
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });
});

describe('ModalContent Component', () => {
  it('renders children', () => {
    render(
      <ModalContent>
        <div>Content goes here</div>
      </ModalContent>
    );
    expect(screen.getByText('Content goes here')).toBeInTheDocument();
  });

  it('applies default mb-6 class', () => {
    render(
      <ModalContent>
        <div>Content</div>
      </ModalContent>
    );
    expect(screen.getByText('Content').parentElement).toHaveClass('mb-6');
  });

  it('applies custom className', () => {
    render(
      <ModalContent className="custom-content">
        <div>Content</div>
      </ModalContent>
    );
    expect(screen.getByText('Content').parentElement).toHaveClass('custom-content');
  });

  it('forwards additional props', () => {
    render(
      <ModalContent data-testid="modal-content">
        <div>Content</div>
      </ModalContent>
    );
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('renders complex content structures', () => {
    render(
      <ModalContent>
        <h4>Section Title</h4>
        <p>Paragraph content</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </ModalContent>
    );
    
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
  });
});

describe('ModalFooter Component', () => {
  it('renders children', () => {
    render(
      <ModalFooter>
        <button>Cancel</button>
        <button>Save</button>
      </ModalFooter>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies default responsive flex classes', () => {
    render(
      <ModalFooter>
        <button>Button</button>
      </ModalFooter>
    );
    
    const footer = screen.getByText('Button').closest('div');
    expect(footer).toHaveClass(
      'flex',
      'flex-col-reverse',
      'space-y-2',
      'space-y-reverse',
      'sm:flex-row',
      'sm:justify-end',
      'sm:space-x-2',
      'sm:space-y-0'
    );
  });

  it('applies custom className', () => {
    render(
      <ModalFooter className="custom-footer">
        <button>Button</button>
      </ModalFooter>
    );
    expect(screen.getByText('Button').closest('div')).toHaveClass('custom-footer');
  });

  it('forwards additional props', () => {
    render(
      <ModalFooter data-testid="modal-footer">
        <button>Button</button>
      </ModalFooter>
    );
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
  });

  it('renders multiple action buttons', () => {
    render(
      <ModalFooter>
        <button>Cancel</button>
        <button>Delete</button>
        <button>Save</button>
      </ModalFooter>
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders with form elements', () => {
    render(
      <ModalFooter>
        <input type="checkbox" id="agree" />
        <label htmlFor="agree">I agree</label>
        <button>Submit</button>
      </ModalFooter>
    );
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('I agree')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});

describe('X Icon Component (Internal)', () => {
  it('renders close button with proper SVG structure', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    const svg = closeButton.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '2');
  });

  it('renders proper X paths in SVG', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    const paths = closeButton.querySelectorAll('path');
    
    expect(paths).toHaveLength(2);
    expect(paths[0]).toHaveAttribute('d', 'm18 6-12 12');
    expect(paths[1]).toHaveAttribute('d', 'm6 6 12 12');
  });
});