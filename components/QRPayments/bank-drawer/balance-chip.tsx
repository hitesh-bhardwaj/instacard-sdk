import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticLight } from '@/lib/haptics';

interface BalanceChipProps {
  revealedText?: string;
  maskedText?: string;
}

export function BalanceChip({ maskedText = 'Tap to show balance', revealedText }: BalanceChipProps) {
  const [revealed, setRevealed] = useState(false);
  const maskedOpacity = useSharedValue(1);
  const revealedOpacity = useSharedValue(0);

  useEffect(() => {
    if (!revealed) return;
    maskedOpacity.value = withTiming(0, { duration: 160, easing: Easing.linear });
    revealedOpacity.value = withTiming(1, { duration: 160, easing: Easing.linear });
  }, [revealed, maskedOpacity, revealedOpacity]);

  const maskedStyle = useAnimatedStyle(() => ({ opacity: maskedOpacity.value }));
  const revealedStyle = useAnimatedStyle(() => ({ opacity: revealedOpacity.value }));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.balanceChip}
      onPress={() => {
        if (revealed) return;
        hapticLight();
        setRevealed(true);
      }}
      accessibilityRole="button"
      accessibilityLabel="Show balance"
    >
      <Animated.Text style={[styles.balanceChipText, maskedStyle]} numberOfLines={1}>
        {maskedText}
      </Animated.Text>
      <Animated.Text style={[styles.balanceChipText, styles.balanceChipTextRevealed, revealedStyle]} numberOfLines={1}>
        {revealedText ?? 'N'}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  balanceChip: {
    height: 28,
    borderRadius: 999,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  balanceChipText: {
    fontSize: 12,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  balanceChipTextRevealed: {
    position: 'absolute',
    left: 0,
    right: 0,
    color: InstacardColors.textPrimary,
    fontFamily: AppFonts.medium,
  },
});