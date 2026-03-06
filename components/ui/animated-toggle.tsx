import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { hapticMedium } from '@/lib/haptics';

type ToggleValue = 'virtual' | 'universal';

interface AnimatedToggleProps {
  value: ToggleValue;
  onChange: (value: ToggleValue) => void;
}

const GAP = 4;
const PADDING = 8;

export function AnimatedToggle({ value, onChange }: AnimatedToggleProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const translateX = useSharedValue(0);
  const { t } = useTranslation();

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
  const colors = useInstacardColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container} onLayout={handleLayout} accessibilityRole="tablist">
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      {(['virtual', 'universal'] as ToggleValue[]).map((id) => {
        const isActive = id === value;
        const label =
          id === 'virtual'
            ? t('cards.modes.virtual')
            : t('cards.modes.universal');
        return (
          <TouchableOpacity
            key={id}
            style={styles.option}
            onPress={() => {
              hapticMedium();
              onChange(id);
            }}
            activeOpacity={0.9}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  container: {
    direction: 'ltr',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor:`${colors.border}80`,
    borderRadius: 9999,
    padding: PADDING,
    gap: GAP,
    minWidth: 160,
    borderWidth: 1,
  },
  indicator: {
    position: 'absolute',
    left: 5,
    top: 5,
    bottom: 5,
    backgroundColor: colors.primary,
    borderRadius: 9999,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  optionText: {
    writingDirection: 'ltr',
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.textOnPrimary,
   
  },
});
