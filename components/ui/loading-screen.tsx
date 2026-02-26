import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { InstacardColors } from '@/constants/colors';
import { useThemeStore } from '@/hooks/use-theme-store';

interface LoadingScreenProps {
  backgroundColor?: string;
}

/**
 * Full-screen loading indicator displayed during app initialization
 * (e.g., while fonts are loading).
 */
export function LoadingScreen({ backgroundColor }: LoadingScreenProps) {
  const { isDarkMode } = useThemeStore();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#111111' : "#ffffff" },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading application"
    >
      <ActivityIndicator size="large" color={isDarkMode ? InstacardColors.white : '#000000'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
