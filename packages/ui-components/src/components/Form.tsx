import { clsx } from 'clsx';
import * as React from 'react';

/**
 * Input component properties.
 * 
 * Extends standard HTML input attributes with label, error handling, and icon support.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'error' | 'success';
}

const inputVariants = {
  default: 'border-[color:var(--field-border)] focus:border-focus-ring focus:ring-focus-ring',
  error: 'border-error-300 focus:border-error-500 focus:ring-error-500',
  success: 'border-success-300 focus:border-success-500 focus:ring-success-500',
};

/**
 * Accessible text input component with label, error states, and icon support.
 * 
 * Provides consistent styling, error handling, and helper text display.
 * Supports left and right icons for enhanced UX. Automatically generates IDs for accessibility.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email Address"
 *   type="email"
 *   error="Please enter a valid email"
 *   helperText="We'll never share your email"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, variant = 'default', id, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    const descriptionId = `${inputId}-description`;
    const actualVariant = error ? 'error' : variant;
    const hasDescription = !!(error || helperText);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-text block text-sm font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <div className="text-text-muted h-5 w-5">{leftIcon}</div>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={hasDescription ? descriptionId : undefined}
            className={clsx(
              'text-text block w-full rounded-control border bg-[var(--field-bg)] px-3 py-2 placeholder-text-muted',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-surface-alt disabled:text-text-muted disabled:cursor-not-allowed',
              inputVariants[actualVariant],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="text-text-muted h-5 w-5">{rightIcon}</div>
            </div>
          )}
        </div>
        {hasDescription && (
          <p
            id={descriptionId}
            role={error ? 'alert' : undefined}
            className={clsx(
              'text-sm',
              error
                ? 'text-error-600 dark:text-error-400'
                : 'text-text-muted'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea component properties.
 * 
 * Extends standard HTML textarea attributes with label and error handling.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error' | 'success';
}

/**
 * Accessible multi-line text input component with label and error states.
 * 
 * Provides vertically resizable text area with consistent styling and error handling.
 * Automatically generates IDs for accessibility.
 * 
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   rows={4}
 *   error="Description is required"
 *   placeholder="Enter description..."
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, variant = 'default', id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || `textarea-${generatedId}`;
    const descriptionId = `${textareaId}-description`;
    const actualVariant = error ? 'error' : variant;
    const hasDescription = !!(error || helperText);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-text block text-sm font-medium"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={clsx(
            'text-text block w-full rounded-control border bg-[var(--field-bg)] px-3 py-2 placeholder-text-muted',
            'resize-vertical transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-surface-alt disabled:text-text-muted disabled:cursor-not-allowed',
            inputVariants[actualVariant],
            className
          )}
          {...props}
        />
        {hasDescription && (
          <p
            id={descriptionId}
            role={error ? 'alert' : undefined}
            className={clsx(
              'text-sm',
              error
                ? 'text-error-600 dark:text-error-400'
                : 'text-text-muted'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * Select dropdown component properties.
 * 
 * Extends standard HTML select attributes with label, error handling, and options.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error' | 'success';
  options: { value: string; label: string }[];
}

/**
 * Accessible select dropdown component with label and error states.
 * 
 * Renders a native select element with options from an array of value/label pairs.
 * Provides consistent styling and error handling. Automatically generates IDs for accessibility.
 * 
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 *   error="Please select a country"
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, variant = 'default', options, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId}`;
    const descriptionId = `${selectId}-description`;
    const actualVariant = error ? 'error' : variant;
    const hasDescription = !!(error || helperText);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="text-text block text-sm font-medium"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={clsx(
            'text-text block w-full rounded-control border bg-[var(--field-bg)] px-3 py-2',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-surface-alt disabled:text-text-muted disabled:cursor-not-allowed',
            inputVariants[actualVariant],
            className
          )}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hasDescription && (
          <p
            id={descriptionId}
            role={error ? 'alert' : undefined}
            className={clsx(
              'text-sm',
              error
                ? 'text-error-600 dark:text-error-400'
                : 'text-text-muted'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

/**
 * Checkbox component properties.
 * 
 * Extends standard HTML input attributes (excludes type) with label and error handling.
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Accessible checkbox component with label and error states.
 * 
 * Provides consistent styling for checkbox inputs with optional label and helper text.
 * Automatically generates IDs for proper label association.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="I agree to the terms and conditions"
 *   error="You must agree to continue"
 *   checked={agreed}
 *   onChange={handleChange}
 * />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || `checkbox-${generatedId}`;
    const descriptionId = `${checkboxId}-description`;
    const hasDescription = !!(error || helperText);

    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            aria-invalid={!!error}
            aria-describedby={hasDescription ? descriptionId : undefined}
            className={clsx(
              'h-4 w-4 rounded border-[color:var(--field-border-strong)] text-brand focus:ring-brand focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-text ml-2 block text-sm"
            >
              {label}
            </label>
          )}
        </div>
        {hasDescription && (
          <p
            id={descriptionId}
            role={error ? 'alert' : undefined}
            className={clsx(
              'text-sm',
              error
                ? 'text-error-600 dark:text-error-400'
                : 'text-text-muted'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/**
 * Radio button component properties.
 * 
 * Extends standard HTML input attributes (excludes type) with label support.
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/**
 * Accessible radio button component with label.
 * 
 * Provides consistent styling for radio button inputs as part of a radio group.
 * Automatically generates IDs for proper label association.
 * 
 * @example
 * ```tsx
 * <div>
 *   <Radio name="plan" value="free" label="Free Plan" />
 *   <Radio name="plan" value="pro" label="Pro Plan" />
 * </div>
 * ```
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id || `radio-${generatedId}`;

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className={clsx(
            'h-4 w-4 border-[color:var(--field-border-strong)] text-brand focus:ring-brand focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className="text-text ml-2 block text-sm"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
