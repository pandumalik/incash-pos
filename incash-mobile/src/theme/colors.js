// Base palette for shared colors
const palette = {
  primary: '#007AFF', // Vibrant Blue
  secondary: '#5856D6', // Purple-ish
  success: '#34C759', // Green
  warning: '#FF9500', // Orange
  danger: '#FF3B30', // Red
  white: '#FFFFFF',
  black: '#000000',
  gray1: '#8E8E93',
  gray2: '#AEAEB2',
  gray3: '#C7C7CC',
  gray4: '#D1D1D6',
  gray5: '#E5E5EA',
  gray6: '#F2F4F6',
};

export const lightColors = {
  primary: palette.primary,
  secondary: palette.secondary,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,

  background: palette.gray6, // Light gray backend
  surface: palette.white, // White cards

  textPrimary: palette.black,
  textSecondary: palette.gray1,
  textLight: palette.white,

  border: palette.gray5,
  inputBackground: palette.white,

  tabBarActive: palette.primary,
  tabBarInactive: palette.gray1,

  // Specifics
  cardShadow: '#000',
};

export const darkColors = {
  primary: '#0A84FF', // Slightly lighter blue for dark mode
  secondary: '#5E5CE6',
  success: '#30D158',
  warning: '#FF9F0A',
  danger: '#FF453A',

  background: '#000000', // Deep black background
  surface: '#1C1C1E', // Dark gray cards

  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textLight: '#000000', // Text on light buttons? Actually textLight usually means "Light colored text". Let's keep it white for now unless used for "Text on primary".
  // Wait, if textLight is used for text on primary button, it should remain white.
  // If it's used for "light text", it depends. 
  // Looking at usage might be safer, but usually white text on buttons stays white.

  border: '#38383A',
  inputBackground: '#1C1C1E',

  tabBarActive: '#0A84FF',
  tabBarInactive: '#8E8E93',

  cardShadow: '#000', // Shadows verify hard to see on dark mode, but we keep it valid.
};

// Deprecated: default export for backward compatibility until refactor is complete
export const colors = lightColors;

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  }
};
