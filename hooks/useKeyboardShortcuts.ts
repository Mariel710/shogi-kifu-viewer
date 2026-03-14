import { useEffect } from 'react';
import { Platform } from 'react-native';

interface KeyboardHandlers {
  onForward: () => void;
  onBack: () => void;
  onStart: () => void;
  onEnd: () => void;
}

/**
 * Web-only: listens for arrow key / Home / End presses to navigate moves.
 * Does nothing on native platforms.
 */
export function useKeyboardShortcuts(handlers: KeyboardHandlers) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handle = (e: KeyboardEvent) => {
      // Ignore when typing in an input element
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handlers.onForward();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlers.onBack();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handlers.onStart();
      } else if (e.key === 'End') {
        e.preventDefault();
        handlers.onEnd();
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [handlers.onForward, handlers.onBack, handlers.onStart, handlers.onEnd]);
}
