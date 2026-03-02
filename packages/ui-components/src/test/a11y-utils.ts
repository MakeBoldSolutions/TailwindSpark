import { render, RenderResult } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReactElement } from 'react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Renders a component and automatically runs accessibility tests
 * @param component - React component to test
 * @param options - Additional axe options
 * @returns Render result from React Testing Library
 */
export const renderWithA11yTest = async (
  component: ReactElement,
  options?: Record<string, unknown>
): Promise<RenderResult> => {
  const renderResult = render(component);
  const results = await axe(renderResult.container, options);
  expect(results).toHaveNoViolations();
  return renderResult;
};

/**
 * Tests accessibility of a specific DOM element
 * @param element - HTML element to test
 * @param options - Additional axe options
 */
export const testA11y = async (
  element: HTMLElement,
  options?: Record<string, unknown>
): Promise<void> => {
  const results = await axe(element, options);
  expect(results).toHaveNoViolations();
};

/**
 * Runs accessibility tests with specific rules enabled/disabled
 * @param element - HTML element to test
 * @param rules - Object specifying which rules to enable/disable
 */
export const testA11yWithRules = async (
  element: HTMLElement,
  rules: Record<string, { enabled: boolean }>
): Promise<void> => {
  const results = await axe(element, {
    rules,
  });
  expect(results).toHaveNoViolations();
};

/**
 * Common accessibility test configuration presets
 */
export const a11yTestConfigs = {
  // Strict testing - all rules enabled
  strict: {},

  // Skip color contrast for components that will be themed
  skipColorContrast: {
    rules: {
      'color-contrast': { enabled: false },
    },
  },

  // Skip landmark rules for isolated component testing
  skipLandmarks: {
    rules: {
      region: { enabled: false },
      'landmark-one-main': { enabled: false },
    },
  },

  // Focus testing specific rules
  focusOnly: {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
      'landmark-one-main': { enabled: false },
    },
  },
};

/**
 * Helper to test keyboard navigation
 * @param element - Element to test keyboard navigation on
 * @param expectedFocusableCount - Expected number of focusable elements
 * @returns Array of focusable HTML elements found within the given element
 */
export const testKeyboardNavigation = (
  element: HTMLElement,
  expectedFocusableCount?: number
): HTMLElement[] => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (expectedFocusableCount !== undefined) {
    expect(focusableElements).toHaveLength(expectedFocusableCount);
  }

  return Array.from(focusableElements) as HTMLElement[];
};

/**
 * Helper to test ARIA attributes
 * @param element - Element to test
 * @param expectedAttributes - Object of expected ARIA attributes
 */
export const testAriaAttributes = (
  element: HTMLElement,
  expectedAttributes: Record<string, string>
): void => {
  for (const [attribute, expectedValue] of Object.entries(expectedAttributes)) {
    expect(element).toHaveAttribute(attribute, expectedValue);
  }
};
