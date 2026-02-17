import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticMedium } from '@/lib/haptics';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ProceedButtonProps {
  amount: string;
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function ProceedButton({ amount, onPress }: ProceedButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = amount === '0' || amount === '0.';

  const handlePressIn = () => {
    if (isDisabled) return;
    hapticMedium();
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (isDisabled) return;
    hapticMedium();
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.proceedButton, animatedStyle, isDisabled && styles.disabledButton]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={isDisabled}
    >
      <Text style={styles.proceedText}>Proceed</Text>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  proceedButton: {
    backgroundColor: InstacardColors.primary,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.2,
  },
  proceedText: {
    fontSize: 16,
    fontFamily: AppFonts.medium,
    color: InstacardColors.white,
  },
});
