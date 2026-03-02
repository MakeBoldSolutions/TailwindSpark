import { useEffect } from 'react';

/**
 * Keyboard shortcuts configuration.
 */
interface KeyboardShortcutsProps {
  /**
   * Callback for search shortcut (Cmd/Ctrl+K).
   */
  onSearch?: () => void;
  /**
   * Callback for theme toggle shortcut (Cmd/Ctrl+Shift+T).
   */
  onThemeToggle?: () => void;
  /**
   * Callback for escape key press.
   */
  onEscape?: () => void;
}

/**
 * Hook for managing keyboard shortcuts.
 * 
 * Registers global keyboard shortcuts for search (Cmd/Ctrl+K),
 * theme toggle (Cmd/Ctrl+Shift+T), and escape key functionality.
 * 
 * @param root0 - Keyboard shortcut handlers
 * @param root0.onSearch - Search activation handler
 * @param root0.onThemeToggle - Theme toggle handler
 * @param root0.onEscape - Escape key handler
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   onSearch: () => setSearchOpen(true),
 *   onThemeToggle: toggleTheme,
 *   onEscape: () => setModal(false)
 * });
 * ```
 */
export const useKeyboardShortcuts = ({
  onSearch,
  onThemeToggle,
  onEscape,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Search shortcut: Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onSearch?.();
      }

      // Theme toggle: Ctrl/Cmd + T
      if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        onThemeToggle?.();
      }

      // Escape key
      if (event.key === 'Escape') {
        onEscape?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onThemeToggle, onEscape]);
};
