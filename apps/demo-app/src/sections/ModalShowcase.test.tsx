import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalShowcase } from './ModalShowcase';

describe('ModalShowcase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ModalShowcase />);
    expect(screen.getByText(/Modal Components/i)).toBeInTheDocument();
  });

  it('displays modal components heading', () => {
    render(<ModalShowcase />);
    const heading = screen.getByRole('heading', { level: 2, name: /Modal Components/i });
    expect(heading).toBeInTheDocument();
  });

  it('shows modal trigger buttons', () => {
    render(<ModalShowcase />);
    expect(screen.getByRole('button', { name: /Basic Modal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmation Modal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Alert Modal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Form Modal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Large Modal/i })).toBeInTheDocument();
  });

  it('opens basic modal on button click', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    const basicButton = screen.getByRole('button', { name: /Basic Modal/i });
    await user.click(basicButton);
    
    // Modal should be visible
    expect(screen.getByText(/This is a basic modal/i)).toBeInTheDocument();
  });

  it('displays basic modal with features list', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Basic Modal/i }));
    
    expect(screen.getByText(/Keyboard navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Click outside to close/i)).toBeInTheDocument();
    expect(screen.getByText(/Focus management/i)).toBeInTheDocument();
  });

  it('opens confirmation modal', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Confirmation Modal/i }));
    
    expect(screen.getByText(/Confirm Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this item\?/i)).toBeInTheDocument();
  });

  it('displays delete button in confirmation modal', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Confirmation Modal/i }));
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('opens alert modal', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Alert Modal/i }));
    
    expect(screen.getByText(/Success!/i)).toBeInTheDocument();
    expect(screen.getByText(/Your changes have been saved successfully/i)).toBeInTheDocument();
  });

  it('opens form modal', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Form Modal/i }));
    
    expect(screen.getByText(/Create New Project/i)).toBeInTheDocument();
  });

  it('opens large modal', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Large Modal/i }));
    
    // Large modal should be open (check for modal overlay/content)
    const modalContent = document.querySelector('[role="dialog"]');
    expect(modalContent).toBeInTheDocument();
  });

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Basic Modal/i }));
    
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);
    
    // Modal should be closed
    expect(screen.queryByText(/This is a basic modal/i)).not.toBeInTheDocument();
  });

  it('supports keyboard navigation (ESC key)', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Basic Modal/i }));
    
    // Press ESC key
    await user.keyboard('{Escape}');
    
    // Modal should be closed
    expect(screen.queryByText(/This is a basic modal/i)).not.toBeInTheDocument();
  });

  it('displays modal footer with action buttons', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Basic Modal/i }));
    
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Got it/i })).toBeInTheDocument();
  });

  it('displays icons in modals', async () => {
    const user = userEvent.setup();
    render(<ModalShowcase />);
    
    await user.click(screen.getByRole('button', { name: /Confirmation Modal/i }));
    
    // Icons should be present
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
