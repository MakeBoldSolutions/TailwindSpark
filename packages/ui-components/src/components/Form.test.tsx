import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, Input, Radio, Select, Textarea } from './Form';

describe('Input Component', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Input label="Email" error="Invalid email format" />);
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveClass('border-error-300');
  });

  it('renders with helper text', () => {
    render(<Input label="Password" helperText="Must be at least 8 characters" />);
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    render(<Input leftIcon={leftIcon} placeholder="Search..." />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toHaveClass('pl-10');
  });

  it('renders with right icon', () => {
    const rightIcon = <span data-testid="right-icon">✓</span>;
    render(<Input rightIcon={rightIcon} placeholder="Enter text" />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('pr-10');
  });

  it('applies success variant correctly', () => {
    render(<Input variant="success" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('border-success-300');
  });

  it('prioritizes error over variant', () => {
    render(<Input variant="success" error="Something went wrong" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('border-error-300');
  });

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText('Disabled input')).toBeDisabled();
  });

  it('generates unique id when not provided', () => {
    render(<Input label="Test Input" />);
    const input = screen.getByLabelText('Test Input');
    expect(input).toHaveAttribute('id');
    expect(input.id).toMatch(/^input-/);
  });

  it('uses provided id', () => {
    render(<Input id="custom-input" label="Custom Input" />);
    expect(screen.getByLabelText('Custom Input')).toHaveAttribute('id', 'custom-input');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} placeholder="Test input" />);
    expect(ref).toHaveBeenCalled();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Test input" />);
    
    const input = screen.getByPlaceholderText('Test input');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });
});

describe('Textarea Component', () => {
  it('renders basic textarea', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Textarea label="Description" placeholder="Enter description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Textarea label="Comments" error="Field is required" />);
    expect(screen.getByText('Field is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Comments')).toHaveClass('border-error-300');
  });

  it('renders with helper text', () => {
    render(<Textarea label="Bio" helperText="Max 500 characters" />);
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('applies success variant correctly', () => {
    render(<Textarea variant="success" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('border-success-300');
  });

  it('prioritizes error over variant', () => {
    render(<Textarea variant="success" error="Something went wrong" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('border-error-300');
  });

  it('handles disabled state', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    expect(screen.getByPlaceholderText('Disabled textarea')).toBeDisabled();
  });

  it('generates unique id when not provided', () => {
    render(<Textarea label="Test Textarea" />);
    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).toHaveAttribute('id');
    expect(textarea.id).toMatch(/^textarea-/);
  });

  it('uses provided id', () => {
    render(<Textarea id="custom-textarea" label="Custom Textarea" />);
    expect(screen.getByLabelText('Custom Textarea')).toHaveAttribute('id', 'custom-textarea');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} placeholder="Test textarea" />);
    expect(ref).toHaveBeenCalled();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} placeholder="Test textarea" />);
    
    const textarea = screen.getByPlaceholderText('Test textarea');
    fireEvent.change(textarea, { target: { value: 'new description' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies resize-vertical class', () => {
    render(<Textarea placeholder="Resizable textarea" />);
    expect(screen.getByPlaceholderText('Resizable textarea')).toHaveClass('resize-vertical');
  });
});

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders basic select with options', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Select label="Choose option" options={mockOptions} />);
    expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Select label="Country" options={mockOptions} error="Please select a country" />);
    expect(screen.getByText('Please select a country')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toHaveClass('border-error-300');
  });

  it('renders with helper text', () => {
    render(<Select label="Priority" options={mockOptions} helperText="Select task priority" />);
    expect(screen.getByText('Select task priority')).toBeInTheDocument();
  });

  it('applies success variant correctly', () => {
    render(<Select variant="success" options={mockOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('border-success-300');
  });

  it('prioritizes error over variant', () => {
    render(<Select variant="success" error="Something went wrong" options={mockOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('border-error-300');
  });

  it('handles disabled state', () => {
    render(<Select disabled options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('generates unique id when not provided', () => {
    render(<Select label="Test Select" options={mockOptions} />);
    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveAttribute('id');
    expect(select.id).toMatch(/^select-/);
  });

  it('uses provided id', () => {
    render(<Select id="custom-select" label="Custom Select" options={mockOptions} />);
    expect(screen.getByLabelText('Custom Select')).toHaveAttribute('id', 'custom-select');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Select ref={ref} options={mockOptions} />);
    expect(ref).toHaveBeenCalled();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Select onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders empty options array', () => {
    render(<Select options={[]} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('combobox').children).toHaveLength(0);
  });
});

describe('Checkbox Component', () => {
  it('renders basic checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Checkbox label="I agree to terms" />);
    expect(screen.getByLabelText('I agree to terms')).toBeInTheDocument();
    expect(screen.getByText('I agree to terms')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Checkbox label="Subscribe" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Checkbox label="Newsletter" helperText="We'll send weekly updates" />);
    expect(screen.getByText("We'll send weekly updates")).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Checkbox disabled label="Disabled checkbox" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('generates unique id when not provided', () => {
    render(<Checkbox label="Test Checkbox" />);
    const checkbox = screen.getByLabelText('Test Checkbox');
    expect(checkbox).toHaveAttribute('id');
    expect(checkbox.id).toMatch(/^checkbox-/);
  });

  it('uses provided id', () => {
    render(<Checkbox id="custom-checkbox" label="Custom Checkbox" />);
    expect(screen.getByLabelText('Custom Checkbox')).toHaveAttribute('id', 'custom-checkbox');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Checkbox ref={ref} label="Test checkbox" />);
    expect(ref).toHaveBeenCalled();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} label="Test checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be checked and unchecked', () => {
    render(<Checkbox label="Toggle me" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    
    expect(checkbox.checked).toBe(false);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('accepts checked prop', () => {
    render(<Checkbox checked readOnly label="Pre-checked" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

describe('Radio Component', () => {
  it('renders basic radio button', () => {
    render(<Radio name="test" value="option1" />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Radio label="Option A" name="test" value="optionA" />);
    expect(screen.getByLabelText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Radio disabled label="Disabled radio" name="test" value="disabled" />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('generates unique id when not provided', () => {
    render(<Radio label="Test Radio" name="test" value="test" />);
    const radio = screen.getByLabelText('Test Radio');
    expect(radio).toHaveAttribute('id');
    expect(radio.id).toMatch(/^radio-/);
  });

  it('uses provided id', () => {
    render(<Radio id="custom-radio" label="Custom Radio" name="test" value="custom" />);
    expect(screen.getByLabelText('Custom Radio')).toHaveAttribute('id', 'custom-radio');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Radio ref={ref} label="Test radio" name="test" value="test" />);
    expect(ref).toHaveBeenCalled();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Radio onChange={handleChange} label="Test radio" name="test" value="test" />);
    
    const radio = screen.getByRole('radio');
    fireEvent.click(radio);
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be selected', () => {
    render(<Radio label="Select me" name="test" value="select" />);
    const radio = screen.getByRole('radio') as HTMLInputElement;
    
    expect(radio.checked).toBe(false);
    
    fireEvent.click(radio);
    expect(radio.checked).toBe(true);
  });

  it('accepts checked prop', () => {
    render(<Radio checked readOnly label="Pre-selected" name="test" value="selected" />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('works in radio group', () => {
    render(
      <div>
        <Radio label="Option 1" name="group1" value="option1" />
        <Radio label="Option 2" name="group1" value="option2" />
        <Radio label="Option 3" name="group1" value="option3" />
      </div>
    );
    
    const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
    const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;
    
    fireEvent.click(radio1);
    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);
    
    fireEvent.click(radio2);
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
  });
});