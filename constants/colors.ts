export const InstacardColors = {
  // Primary purple (header background, buttons, active states)
  primary: '#5A1186',
  primaryDark: '#5A189A',
  primaryLight: '#9D4EDD',

  // Backgrounds
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  cardBackground: '#FFFFFF',

  // Text colors
  textPrimary: '#111111',
  textSecondary: '#333333',
  textOnPrimary: '#FFFFFF',
  textMuted: '#999999',

  // Tab/Filter colors
  tabActive: '#5A1186',
  tabInactive: '#666666',
  tabBorder: '#E0E0E0',

  // Shadows and borders
  shadow: '#000000',
  border: '#E5E5E5',

  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  orange: '#FF8303',
};

// Dark mode colors - use with useThemeStore hook inside components
export const InstacardDarkColors = {
  // Primary purple (header background, buttons, active states)
  primary: '#C77DFF',
  primaryDark: '#5A189A',
  primaryLight: '#9D4EDD',

  // Backgrounds
  white: '#1D1D1D',
  lightGray: '#2A2A2A',
  cardBackground: '#252525',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#AAAAAA',
  textOnPrimary: '#FFFFFF',
  textMuted: '#777777',

  // Tab/Filter colors
  tabActive: '#7B2CBF',
  tabInactive: '#AAAAAA',
  tabBorder: '#3A3A3A',

  // Shadows and borders
  shadow: '#000000',
  border: '#5A5A5A',

  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  orange: '#FF8303',
};

// Hook to get theme-aware colors - use inside React components
import { useThemeStore } from "@/hooks/use-theme-store";

export const useInstacardColors = () => {
  const { isDarkMode } = useThemeStore();
  return isDarkMode ? InstacardDarkColors : InstacardColors;
};
