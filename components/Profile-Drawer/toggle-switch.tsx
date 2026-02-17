import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { InstacardColors } from '@/constants/colors';
import { hapticMedium } from '@/lib/haptics';

interface ToggleSwitchProps {
  value: boolean;
  isRTL?: boolean;
  onToggle: () => void;
}

export function ToggleSwitch({ value, onToggle, isRTL = false }: ToggleSwitchProps) {
  const translateX = useSharedValue(value ? 20 : 0);

  const handleToggle = () => {
    hapticMedium();
    translateX.value = withTiming(value ? 0 : isRTL ? -20 : 20, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    onToggle();
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity
      style={[styles.toggleTrack, value && styles.toggleTrackActive]}
      onPress={handleToggle}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.toggleThumb, thumbStyle]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: InstacardColors.border,
    padding: 4,
  },
  toggleTrackActive: {
    backgroundColor: InstacardColors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: InstacardColors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
