import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { InstacardColors } from '@/constants/colors';

interface LoadingScreenProps {
  backgroundColor?: string;
}

/**
 * Full-screen loading indicator displayed during app initialization
 * (e.g., while fonts are loading).
 */
export function LoadingScreen({ backgroundColor }: LoadingScreenProps) {
  return (
    <View
      style={[
        styles.container,
        backgroundColor ? { backgroundColor } : undefined,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading application"
    >
      <ActivityIndicator size="large" color={InstacardColors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
