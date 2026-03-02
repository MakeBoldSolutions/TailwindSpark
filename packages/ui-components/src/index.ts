/**
 * UI Components Library
 * 
 * A collection of accessible, semantic, and themeable React components built with
 * Tailwind CSS design tokens. All components support dark mode through semantic
 * color tokens and follow WCAG accessibility guidelines.
 * 
 * @packageDocumentation
 */

export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Card, CardContent, CardFooter, CardHeader } from './components/Card';
export type {
    CardContentProps,
    CardFooterProps,
    CardHeaderProps,
    CardProps
} from './components/Card';

export { Modal, ModalContent, ModalFooter, ModalHeader } from './components/Modal';
export type {
    ModalContentProps,
    ModalFooterProps,
    ModalHeaderProps,
    ModalProps
} from './components/Modal';

export { Checkbox, Input, Radio, Select, Textarea } from './components/Form';
export type {
    CheckboxProps,
    InputProps,
    RadioProps,
    SelectProps,
    TextareaProps
} from './components/Form';

