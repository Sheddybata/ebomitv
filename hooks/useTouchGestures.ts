/**
 * Touch Gestures Hook
 * Provides swipe and touch gesture detection for mobile devices
 * Similar to YouTube and Netflix mobile apps
 */

import { useEffect, useRef, useCallback } from 'react';

export interface TouchGestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isLongPress: boolean;
}

const SWIPE_THRESHOLD = 50; // Minimum distance for swipe (px)
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity for swipe (px/ms)
const LONG_PRESS_DURATION = 500; // Duration for long press (ms)
const DOUBLE_TAP_DURATION = 300; // Max time between taps for double tap (ms)

export function useTouchGestures(
  callbacks: TouchGestureCallbacks,
  enabled: boolean = true
) {
  const touchStateRef = useRef<TouchState | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    const touch = e.touches[0];
    const now = Date.now();

    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: now,
      isLongPress: false,
    };

    // Set up long press timer
    longPressTimerRef.current = setTimeout(() => {
      if (touchStateRef.current) {
        touchStateRef.current.isLongPress = true;
        callbacks.onLongPress?.();
      }
    }, LONG_PRESS_DURATION);
  }, [callbacks, enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStateRef.current) return;

    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStateRef.current) return;

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // If long press was triggered, don't process other gestures
    if (touchStateRef.current.isLongPress) {
      touchStateRef.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStateRef.current.startX;
    const deltaY = touch.clientY - touchStateRef.current.startY;
    const deltaTime = Date.now() - touchStateRef.current.startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check for double tap
    const now = Date.now();
    if (distance < 10 && deltaTime < 200) {
      // This is a tap
      if (now - lastTapRef.current < DOUBLE_TAP_DURATION) {
        // Double tap detected
        callbacks.onDoubleTap?.();
        lastTapRef.current = 0;
      } else {
        // Single tap
        lastTapRef.current = now;
        setTimeout(() => {
          if (lastTapRef.current === now) {
            callbacks.onTap?.();
          }
        }, DOUBLE_TAP_DURATION);
      }
      touchStateRef.current = null;
      return;
    }

    // Check for swipe
    if (distance > SWIPE_THRESHOLD && velocity > SWIPE_VELOCITY_THRESHOLD) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine swipe direction
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
      }
    }

    touchStateRef.current = null;
  }, [callbacks]);

  useEffect(() => {
    if (!enabled) return;

    const element = document.body;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);
}

/**
 * Hook specifically for video player touch gestures
 */
export function useVideoTouchGestures(
  callbacks: {
    onSeekBackward?: (seconds: number) => void;
    onSeekForward?: (seconds: number) => void;
    onTogglePlayPause?: () => void;
    onVolumeChange?: (delta: number) => void;
    onBrightnessChange?: (delta: number) => void;
  },
  enabled: boolean = true
) {
  useTouchGestures(
    {
      onSwipeLeft: () => callbacks.onSeekForward?.(10),
      onSwipeRight: () => callbacks.onSeekBackward?.(10),
      onSwipeUp: () => callbacks.onBrightnessChange?.(0.1),
      onSwipeDown: () => callbacks.onBrightnessChange?.(-0.1),
      onDoubleTap: () => callbacks.onTogglePlayPause?.(),
    },
    enabled
  );
}
