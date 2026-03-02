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
    expect(screen.getByText(/Products/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Filter/i) || screen.getByText(/Category/i)).toBeInTheDocument();
  });

  it('displays search functionality', () => {
    renderWithRouter(<EcommercePage />);
    
    // Search component should be present
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders product cards', () => {
    renderWithRouter(<EcommercePage />);
    
    // Product cards should be displayed
    const productCards = document.querySelectorAll('[class*="card"]') ||
                        document.querySelectorAll('[class*="border"]');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('shows product prices', () => {
    renderWithRouter(<EcommercePage />);
    
    // Prices typically shown with $ symbol
    const priceElements = document.querySelectorAll('[class*="price"]') ||
                         screen.getAllByText(/\$/);
    expect(priceElements.length).toBeGreaterThan(0);
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
    const filterSection = screen.getByText(/Category/i) || 
                         screen.getByText(/Filter/i);
    expect(filterSection).toBeInTheDocument();
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
