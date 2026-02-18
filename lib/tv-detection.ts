/**
 * TV Device Detection Utility
 * Detects if the user is accessing from a Smart TV device
 * Based on user agent patterns from major Smart TV platforms
 */

export function isTVDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = window.navigator.userAgent.toLowerCase();
  
  // Common Smart TV user agent patterns
  const tvPatterns = [
    'smart-tv',
    'smarttv',
    'tizen',           // Samsung Tizen OS
    'webos',           // LG webOS
    'netcast',         // LG NetCast
    'bravia',          // Sony Bravia
    'philipstv',       // Philips TV
    'panasonic',       // Panasonic TV
    'viera',           // Panasonic Viera
    'smart-tv-box',    // Generic Smart TV Box
    'googletv',        // Google TV
    'androidtv',       // Android TV
    'appletv',         // Apple TV (Safari on tvOS)
    'roku',            // Roku
    'firetv',          // Amazon Fire TV
    'chromecast',      // Chromecast
  ];
  
  // Check for TV-specific patterns
  const isSmartTV = tvPatterns.some(pattern => ua.includes(pattern));
  
  // Additional checks for TV-like behavior
  const hasTVCharacteristics = 
    (ua.includes('samsung') && ua.includes('browser')) ||
    (ua.includes('lg') && ua.includes('netcast')) ||
    (ua.includes('tv') && !ua.includes('android')) ||
    window.screen.width >= 1920 && window.screen.height >= 1080 && 
    !window.navigator.userAgent.includes('mobile');
  
  return isSmartTV || hasTVCharacteristics;
}

/**
 * Get device type for responsive optimizations
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'tv';

export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  
  if (isTVDevice()) return 'tv';
  
  const width = window.innerWidth;
  
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get optimal video quality based on device and connection
 */
export function getOptimalVideoQuality(deviceType: DeviceType): string {
  switch (deviceType) {
    case 'tv':
      return '1080p'; // TVs can handle higher quality
    case 'desktop':
      return '720p'; // Default for desktop
    case 'tablet':
      return '480p'; // Balanced for tablets
    case 'mobile':
      return '360p'; // Lower for mobile to save data
    default:
      return '720p';
  }
}
