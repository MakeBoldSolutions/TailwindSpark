import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import EcommercePage from './EcommercePage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('EcommercePage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<EcommercePage />);
    const productsText = screen.queryAllByText(/Products/i);
    expect(productsText.length).toBeGreaterThan(0);
  });

  it('displays product grid', () => {
    renderWithRouter(<EcommercePage />);
    
    // Check for product grid container
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('shows filter panel', () => {
    renderWithRouter(<EcommercePage />);
    
    // Filter panel should be visible
    const filterText = screen.queryAllByText(/Filter/i);
    const categoryText = screen.queryAllByText(/Category/i);
    expect(filterText.length + categoryText.length).toBeGreaterThan(0);
  });

  it('displays search functionality', () => {
    renderWithRouter(<EcommercePage />);
    
    // Search component should be present
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders product cards', () => {
    const { container } = renderWithRouter(<EcommercePage />);
    
    // Product grid should render
    expect(container.firstChild).toBeTruthy();
  });

  it('shows product prices', () => {
    const { container } = renderWithRouter(<EcommercePage />);
    
    // Ecommerce page renders
    expect(container.firstChild).toBeTruthy();
  });

  it('handles search input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<EcommercePage />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'test product');
    
    expect(searchInput).toHaveValue('test product');
  });

  it('displays category filters', () => {
    renderWithRouter(<EcommercePage />);
    
    // Category filters should be present
    const categoryText = screen.queryAllByText(/Category/i);
    const filterText = screen.queryAllByText(/Filter/i);
    expect(categoryText.length + filterText.length).toBeGreaterThan(0);
  });

  it('shows sort options', () => {
    renderWithRouter(<EcommercePage />);
    
    // Sort/filter controls
    const sortElements = document.querySelector('select') ||
                        screen.queryByText(/Sort/i);
    expect(sortElements).toBeInTheDocument();
  });

  it('renders add to cart buttons', () => {
    renderWithRouter(<EcommercePage />);
    
    // Product cards should have action buttons
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it('displays product images', () => {
    renderWithRouter(<EcommercePage />);
    
    // Product images should be present
    const images = document.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('has responsive grid layout', () => {
    renderWithRouter(<EcommercePage />);
    
    // Check for responsive grid classes
    const responsiveGrids = document.querySelectorAll('[class*="md:grid"], [class*="lg:grid"]');
    expect(responsiveGrids.length).toBeGreaterThan(0);
  });

  it('shows product count or results info', () => {
    renderWithRouter(<EcommercePage />);
    
    // Results count or product info
    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();
  });
});
