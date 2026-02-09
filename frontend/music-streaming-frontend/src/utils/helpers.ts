/**
 * Common Utility Functions
 */

/**
 * Format seconds to HH:MM:SS or MM:SS display
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const padZero = (num: number): string => String(num).padStart(2, '0');
  
  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
  }
  
  return `${minutes}:${padZero(secs)}`;
};

/**
 * Check if device is touch-enabled (mobile/tablet)
 * @returns true if touch device
 */
export const isTouchDevice = (): boolean => {
  return (
    (typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0)) ||
    false
  );
};

/**
 * Debounce function for event handlers
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Throttle function for event handlers
 * @param func - Function to throttle
 * @param limit - Limit in milliseconds
 */
export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastRun = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastRun >= limit) {
      func(...args);
      lastRun = now;
    }
  };
};

/**
 * Validate email format
 * @param email - Email string
 * @returns true if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get responsive column count based on viewport width
 */
export const getGridColumns = (width: number): number => {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  if (width < 1440) return 3;
  return 4;
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    if (err.message) return String(err.message);
    if (err.data) return String(err.data);
  }
  
  return 'An unexpected error occurred';
};
