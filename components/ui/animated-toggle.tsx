import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { InstacardColors } from '@/constants/colors';
import { hapticMedium } from '@/lib/haptics';

type ToggleValue = 'virtual' | 'universal';

interface AnimatedToggleProps {
  value: ToggleValue;
  onChange: (value: ToggleValue) => void;
}

const TOGGLE_OPTIONS: Array<{ id: ToggleValue; label: string }> = [
  { id: 'virtual', label: 'Virtual' },
  { id: 'universal', label: 'Universal' },
];

const GAP = 4;
const PADDING = 4;

export function AnimatedToggle({ value, onChange }: AnimatedToggleProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const translateX = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  const segmentWidth =
    layoutWidth > 0 ? (layoutWidth - PADDING * 2 - GAP) / 2 : 0;

  useEffect(() => {
    const index = value === 'virtual' ? 0 : 1;
    translateX.value = withTiming(index * (segmentWidth + GAP), {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [segmentWidth, translateX, value]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: segmentWidth,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container} onLayout={handleLayout} accessibilityRole="tablist">
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      {TOGGLE_OPTIONS.map((option) => {
        const isActive = option.id === value;
        return (
          <TouchableOpacity
            key={option.id}
            style={styles.option}
            onPress={() => {
              hapticMedium();
              onChange(option.id);
            }}
            activeOpacity={0.9}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: InstacardColors.lightGray,
    borderRadius: 22,
    padding: PADDING,
    gap: GAP,
    minWidth: 180,
  },
  indicator: {
    position: 'absolute',
    left: PADDING,
    top: PADDING,
    bottom: PADDING,
    backgroundColor: InstacardColors.primary,
    borderRadius: 18,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: InstacardColors.textSecondary,
  },
  optionTextActive: {
    color: InstacardColors.textOnPrimary,
  },
});
