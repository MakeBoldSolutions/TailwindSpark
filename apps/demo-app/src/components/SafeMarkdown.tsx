import ReactMarkdown, { type Components } from 'react-markdown';
import { sanitizeLinkHref } from '../utils/sanitize';

interface SafeMarkdownProps {
  children: string;
}

const MARKDOWN_ALLOWED_ELEMENTS = [
  'a',
  'blockquote',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'ul',
] as const;

/** Custom component overrides for ReactMarkdown with link sanitization. */
const markdownComponents: Components = {
  a: ({ href, children, ...props }) => {
    const safeHref = sanitizeLinkHref(href);
    if (!safeHref) {
      return <span>{children}</span>;
    }

    const isExternalLink = /^(https?:|mailto:|tel:)/.test(safeHref);
    return (
      <a
        {...props}
        href={safeHref}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
        target={isExternalLink ? '_blank' : undefined}
      >
        {children}
      </a>
    );
  },
};

/**
 * Renders sanitized Markdown content with restricted elements and safe links.
 * @param root0 - Component props.
 * @param root0.children - Markdown string to render.
 * @returns The rendered Markdown JSX element.
 */
export const SafeMarkdown = ({ children }: SafeMarkdownProps): React.JSX.Element => {
  return (
    <ReactMarkdown
      allowedElements={MARKDOWN_ALLOWED_ELEMENTS as unknown as string[]}
      components={markdownComponents}
    >
      {children}
    </ReactMarkdown>
  );
};