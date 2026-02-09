/**
 * API Configuration
 * Environment-based configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  ENDPOINTS: {
    AUTH: '/api/auth',
    SONGS: '/api/songs',
    PLAYLISTS: '/api/playlists',
    STREAM: '/api/stream',
    MEDIA: '/media',
  },
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: 'music_app_token',
  TOKEN_TYPE: 'Bearer',
  STORAGE: 'localStorage' as const,
} as const;

export const PLAYER_CONFIG = {
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for streaming
  BUFFER_SIZE: 256 * 1024, // 256KB buffer
} as const;

export const UI_CONFIG = {
  BREAKPOINTS: {
    mobile: 640,
    tablet: 1024,
    desktop: 1440,
  },
  ANIMATIONS: {
    TRANSITION_SPEED: 'cubic-bezier(0.4, 0, 0.2, 1)',
    DURATION_FAST: 150,
    DURATION_NORMAL: 250,
    DURATION_SLOW: 350,
  },
} as const;

export const VALIDATION = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  MAX_PLAYLIST_NAME_LENGTH: 100,
  MAX_SEARCH_QUERY_LENGTH: 100,
} as const;
