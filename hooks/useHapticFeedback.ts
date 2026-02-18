"use client";

/**
 * Hook for haptic feedback on mobile devices
 * Provides vibration feedback for user interactions
 */
export function useHapticFeedback() {
  const vibrate = (pattern: number | number[] = 10) => {
    // Check if Vibration API is supported
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        // Silently fail if vibration is not supported or blocked
      }
    }
  };

  const lightTap = () => vibrate(10);
  const mediumTap = () => vibrate(20);
  const heavyTap = () => vibrate(30);
  const success = () => vibrate([10, 50, 10]);
  const error = () => vibrate([20, 50, 20, 50, 20]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    error,
  };
}
