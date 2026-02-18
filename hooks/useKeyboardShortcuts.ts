/**
 * Keyboard Shortcuts Hook
 * Provides video player and navigation keyboard shortcuts
 * Similar to YouTube, Netflix, and other streaming platforms
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcuts {
  onPlayPause?: () => void;
  onSeekBackward?: (seconds?: number) => void;
  onSeekForward?: (seconds?: number) => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onMute?: () => void;
  onFullscreen?: () => void;
  onPictureInPicture?: () => void;
  onOpenSearch?: () => void;
  onClose?: () => void;
  onNextVideo?: () => void;
  onPreviousVideo?: () => void;
  onIncreaseSpeed?: () => void;
  onDecreaseSpeed?: () => void;
  onResetSpeed?: () => void;
  onSkipIntro?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled: boolean = true) {
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // Check for modifier keys (Ctrl/Cmd)
    const isModifierPressed = e.ctrlKey || e.metaKey;

    switch (e.key.toLowerCase()) {
      case ' ': // Spacebar - Play/Pause
        e.preventDefault();
        shortcuts.onPlayPause?.();
        break;

      case 'arrowleft':
        e.preventDefault();
        shortcuts.onSeekBackward?.(10);
        break;

      case 'arrowright':
        e.preventDefault();
        shortcuts.onSeekForward?.(10);
        break;

      case 'arrowup':
        e.preventDefault();
        if (e.shiftKey) {
          shortcuts.onIncreaseSpeed?.();
        } else {
          shortcuts.onVolumeUp?.();
        }
        break;

      case 'arrowdown':
        e.preventDefault();
        if (e.shiftKey) {
          shortcuts.onDecreaseSpeed?.();
        } else {
          shortcuts.onVolumeDown?.();
        }
        break;

      case 'm':
        e.preventDefault();
        shortcuts.onMute?.();
        break;

      case 'f':
        e.preventDefault();
        shortcuts.onFullscreen?.();
        break;

      case 'p':
        e.preventDefault();
        shortcuts.onPictureInPicture?.();
        break;

      case 'escape':
        e.preventDefault();
        shortcuts.onClose?.();
        break;

      case 'k':
        e.preventDefault();
        shortcuts.onPlayPause?.();
        break;

      case 'j':
        e.preventDefault();
        shortcuts.onSeekBackward?.(10);
        break;

      case 'l':
        e.preventDefault();
        shortcuts.onSeekForward?.(10);
        break;

      case '>':
        e.preventDefault();
        shortcuts.onIncreaseSpeed?.();
        break;

      case '<':
        e.preventDefault();
        shortcuts.onDecreaseSpeed?.();
        break;

      case '0':
        e.preventDefault();
        shortcuts.onResetSpeed?.();
        break;

      case 'n':
        e.preventDefault();
        shortcuts.onNextVideo?.();
        break;

      case 'shift+n':
        e.preventDefault();
        shortcuts.onPreviousVideo?.();
        break;

      case 's':
        e.preventDefault();
        shortcuts.onSkipIntro?.();
        break;
    }

    // Modifier key combinations
    if (isModifierPressed) {
      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault();
          shortcuts.onOpenSearch?.();
          break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, enabled]);
}

/**
 * Keyboard shortcuts help component data
 */
export const KEYBOARD_SHORTCUTS_HELP = [
  { key: 'Space / K', description: 'Play/Pause' },
  { key: '← / J', description: 'Seek backward 10s' },
  { key: '→ / L', description: 'Seek forward 10s' },
  { key: '↑', description: 'Volume up' },
  { key: '↓', description: 'Volume down' },
  { key: 'M', description: 'Mute/Unmute' },
  { key: 'F', description: 'Fullscreen' },
  { key: 'P', description: 'Picture-in-Picture' },
  { key: 'Esc', description: 'Exit fullscreen/Close' },
  { key: '>', description: 'Increase playback speed' },
  { key: '<', description: 'Decrease playback speed' },
  { key: '0', description: 'Reset playback speed' },
  { key: 'N', description: 'Next video' },
  { key: 'Shift + N', description: 'Previous video' },
  { key: 'S', description: 'Skip intro' },
  { key: 'Ctrl/Cmd + K', description: 'Open search' },
] as const;
