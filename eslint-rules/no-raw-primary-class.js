/**
 * ESLint rule: disallow usage of raw Tailwind color utility classes to enforce semantic tokens.
 * 
 * This rule enforces the use of semantic design tokens instead of hard-coded Tailwind color classes.
 * It catches patterns like:
 * - bg-blue-500, text-gray-900, border-red-300
 * - dark:bg-gray-800, hover:text-blue-600
 * - from-purple-500, to-pink-600 (gradients)
 * 
 * Exceptions (allowed):
 * - transparent, current, inherit, black, white (CSS color keywords)
 * - Semantic tokens: brand, surface, text, border, success, warning, error, info, data-viz-*
 */
export const rules = {
  'no-raw-primary-class': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow raw Tailwind color classes; use semantic design tokens instead',
      },
      messages: {
        noPrimary: 'Avoid raw "{{cls}}". Use semantic brand / surface / text / data-viz tokens instead.',
      },
      schema: [],
    },
    create(context) {
      // Tailwind color names to disallow (excludes semantic tokens and CSS keywords)
      const rawColors = [
        'blue', 'gray', 'green', 'red', 'purple', 'pink', 'orange', 'yellow',
        'indigo', 'violet', 'slate', 'zinc', 'neutral', 'stone', 'amber', 
        'lime', 'emerald', 'teal', 'cyan', 'sky', 'fuchsia', 'rose', 'primary'
      ].join('|');
      
      // Prefixes that can be used with colors
      const prefixes = 'bg|text|border|from|to|via|ring|outline|decoration|divide|caret|accent|shadow';
      
      // Optional modifiers (hover, focus, dark, etc.)
      const modifiers = '(?:(?:hover|focus|active|disabled|focus-visible|dark|group-hover|peer-hover):)*';
      
      // Numeric shades
      const shades = '(?:50|100|200|300|400|500|600|700|800|900|950)';
      
      // Complete pattern: (modifiers:)(prefix)-(color)-(shade)
      const disallowed = new RegExp(
        `\\b${modifiers}(?:${prefixes})-(${rawColors})-${shades}\\b`,
        'g'
      );
      
      return {
        Literal(node) {
          if (typeof node.value === 'string' && disallowed.test(node.value)) {
            const matches = node.value.match(disallowed) || [];
            matches.forEach(m => {
              context.report({ node, messageId: 'noPrimary', data: { cls: m } });
            });
          }
        },
      };
    },
  },
};
