import { Moon, Sun } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { useAppDirection } from '@/hooks/use-app-direction';
import { useThemeStore } from '@/hooks/use-theme-store';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DIAGONAL = Math.sqrt(SCREEN_WIDTH ** 2 + SCREEN_HEIGHT ** 2);

export function ColorThemeChangeOverlay() {
  const { isDarkMode } = useThemeStore();
  const { t } = useTranslation();
  const { isRTL } = useAppDirection();

  const backgroundOpacity = useSharedValue(0);
  const clipProgress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const previousIsDarkMode = useRef(isDarkMode);

  useEffect(() => {
    if (previousIsDarkMode.current !== isDarkMode) {
      // Reset
      backgroundOpacity.value = 0;
      clipProgress.value = 0;
      contentOpacity.value = 0;

      // Background fade in first
      backgroundOpacity.value = withSequence(
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
        withDelay(2000, withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) })),
      );

      // Circular reveal animation (starts after background fades in)
      clipProgress.value = withDelay(
        300,
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
          withDelay(800, withTiming(2, { duration: 400, easing: Easing.in(Easing.cubic) })),
        ),
      );

      // Content fade in/out
      contentOpacity.value = withSequence(
        withDelay(500, withTiming(1, { duration: 300 })),
        withDelay(600, withTiming(0, { duration: 300 })),
      );
    }

    previousIsDarkMode.current = isDarkMode;
  }, [isDarkMode, backgroundOpacity, clipProgress, contentOpacity]);

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const progress = clipProgress.value;
    
    // Circular clip path simulation using border radius and size
    const size = progress <= 1 ? progress * DIAGONAL : (2 - progress) * DIAGONAL;
    const opacity = progress > 0 && progress < 2 ? 1 : 0;

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const message = isDarkMode ? t('themeOverlay.switchedToDark') : t('themeOverlay.switchedToLight');
  const themeColor = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
  const iconColor = isDarkMode ? '#ffffff' : '#1a1a1a';

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View style={[{backgroundColor: isDarkMode ? '#000000' : '#ffffff'},styles.background, backgroundAnimatedStyle]} />
      <Animated.View style={[styles.overlay, overlayAnimatedStyle, { backgroundColor: themeColor }]}>
        <Animated.View
          style={[
            styles.content,
            contentAnimatedStyle,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          {isDarkMode ? (
            <Moon size={28} color={iconColor} strokeWidth={1.5} />
          ) : (
            <Sun size={28} color={iconColor} strokeWidth={1.5} />
          )}
          <Text
            style={[
              styles.text,
              { color: textColor },
              isRTL && styles.textRTL,
            ]}
          >
            {message}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: '#000000',
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
