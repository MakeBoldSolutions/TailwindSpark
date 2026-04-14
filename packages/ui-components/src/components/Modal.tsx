import { clsx } from 'clsx';
import * as React from 'react';

interface LucideIconProps {
  size?: number;
  className?: string;
}

// Simple X icon component
const X: React.FC<LucideIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
);

/**
 * Modal dialog component properties.
 * 
 * Configures modal behavior, size, and accessibility features.
 */
export interface ModalProps {
  /** Controls modal visibility. */
  isOpen: boolean;
  /** Callback invoked when the modal requests to close. */
  onClose: () => void;
  /** Optional modal title rendered in the header. */
  title?: string;
  /** Width preset for the modal dialog. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether clicking the overlay closes the modal. */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal. */
  closeOnEscape?: boolean;
  /** Whether to show the close button in the header. */
  showCloseButton?: boolean;
  /** Modal body content. */
  children: React.ReactNode;
  /** Additional classes applied to the dialog container. */
  className?: string;
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

/**
 * Accessible modal dialog component with overlay and escape handling.
 * 
 * Provides a centered dialog with configurable size, close behaviors, and automatic
 * focus management. Handles keyboard navigation (Escape key) and overlay clicks.
 * Prevents body scroll when open.
 * 
 * @param props - Modal component properties
 * @param props.isOpen - Controls modal visibility
 * @param props.onClose - Callback function when modal should close
 * @param props.title - Optional title displayed in modal header
 * @param props.size - Modal width size variant
 * @param props.closeOnOverlayClick - Whether clicking overlay closes modal
 * @param props.closeOnEscape - Whether pressing Escape key closes modal
 * @param props.showCloseButton - Whether to show close button in header
 * @param props.children - Modal content
 * @param props.className - Additional CSS classes
 * @returns Modal dialog element or null if not open
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <ModalContent>
 *     Are you sure you want to continue?
 *   </ModalContent>
 *   <ModalFooter>
 *     <Button onClick={() => setShowModal(false)}>Cancel</Button>
 *     <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
        onClick={handleOverlayClick}
      >
        <div className="fixed inset-0 bg-[color:var(--modal-overlay)] transition-opacity" />

        <div
          ref={modalRef}
          className={clsx(
            'relative transform overflow-hidden rounded-panel border border-[color:var(--card-border)] bg-[var(--card-bg)] px-4 pb-4 pt-5 text-left shadow-modal transition-all sm:my-8 sm:w-full sm:p-6',
            modalSizes[size],
            'animate-scale-in',
            className
          )}
        >
          {(title || showCloseButton) && (
            <div className="mb-4 flex items-center justify-between">
              {title && (
                <h3 className="text-text text-lg font-semibold">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-text hover:bg-surface-hover rounded-control p-1 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          <div className="text-text">{children}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal header component properties.
 * 
 * Defines optional title, subtitle, and custom header content.
 */
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional modal heading text. */
  title?: string;
  /** Optional supporting subtitle text. */
  subtitle?: string;
}

/**
 * Modal header section with optional title and subtitle.
 * 
 * Provides consistent typography and spacing for modal headers.
 * Can contain custom content in addition to or instead of title/subtitle props.
 * 
 * @param props - Modal header component properties
 * @param props.className - Additional CSS classes
 * @param props.title - Optional main heading text
 * @param props.subtitle - Optional subheading text
 * @param props.children - Custom header content
 * @returns Modal header element
 * 
 * @example
 * ```tsx
 * <ModalHeader title="Delete Item" subtitle="This action cannot be undone" />
 * ```
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  className,
  title,
  subtitle,
  children,
  ...props
}) => {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {title && (
        <h3 className="text-text mb-1 text-lg font-semibold">
          {title}
        </h3>
      )}
      {subtitle && <p className="text-text-muted text-sm">{subtitle}</p>}
      {children}
    </div>
  );
};

/**
 * Modal content component properties.
 * 
 * Standard HTML div attributes for modal body content.
 */
export type ModalContentProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Main content area of a modal dialog.
 * 
 * Provides consistent spacing and structure for modal body content.
 * 
 * @param props - Modal content component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Modal body content
 * @returns Modal content element
 * 
 * @example
 * ```tsx
 * <ModalContent>
 *   <p>This is the main content of the modal.</p>
 * </ModalContent>
 * ```
 */
export const ModalContent: React.FC<ModalContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('mb-6', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Modal footer component properties.
 * 
 * Standard HTML div attributes for modal footer actions.
 */
export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Footer section of a modal, typically for action buttons.
 * 
 * Automatically arranges buttons in a responsive layout (stacked on mobile, horizontal on desktop).
 * 
 * @param props - Modal footer component properties
 * @param props.className - Additional CSS classes
 * @param props.children - Footer action buttons
 * @returns Modal footer element
 * 
 * @example
 * ```tsx
 * <ModalFooter>
 *   <Button variant="ghost">Cancel</Button>
 *   <Button variant="primary">Save Changes</Button>
 * </ModalFooter>
 * ```
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        'flex flex-col-reverse space-y-2 space-y-reverse sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
