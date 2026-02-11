/**
 * Design Tokens
 * Apple Music-inspired design system constants
 */

export const colors = {
  // Primary
  primary: {
    main: '#FA243C',      // Apple Music red
    light: '#FF5A5B',
    dark: '#E01E2D',
    disabled: 'rgba(250, 36, 60, 0.5)',
  },

  // Neutral/Gray
  neutral: {
    // Background
    bg: {
      primary: '#000000',     // Pure black
      secondary: '#1a1a1a',   // Very dark gray
      tertiary: '#242424',    // Dark gray
      quaternary: '#2a2a2a',  // Slightly lighter gray
      hover: '#333333',       // Hover state gray
    },
    // Foreground/Text
    fg: {
      primary: '#FFFFFF',     // White
      secondary: '#A6A6A6',   // Medium gray
      tertiary: '#757575',    // Darker gray
      quaternary: '#404040',  // Even darker gray
      disabled: '#424242',
    },
  },

  // Semantic
  semantic: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF453A',
    info: '#0A84FF',
  },

  // Accents
  accent: {
    purple: '#7C3AED',
    blue: '#0A84FF',
    pink: '#FF2D55',
  },

  // Dividers & Borders
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
} as const;

export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Flex", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    display: '48px',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    thin: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
  },
} as const;

export const radius = {
  none: '0px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '999px',
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.25)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
  md: '0 4px 8px rgba(0, 0, 0, 0.35)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.4)',
  xl: '0 12px 24px rgba(0, 0, 0, 0.45)',
  elevated: '0 16px 32px rgba(0, 0, 0, 0.5)',
  player: '0 -4px 16px rgba(0, 0, 0, 0.6)',
} as const;

export const transitions = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  normal: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slowest: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  // Easing functions for specific use cases
  easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  notification: 800,
  playerBar: 250,
} as const;

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '1024px',
  lg: '1440px',
  xl: '1920px',
} as const;

export const layers = {
  // Sidebar
  sidebarWidth: '280px',
  headerHeight: '60px',
  playerHeight: '100px',
} as const;

export const theme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  layers,
} as const;

export default theme;
