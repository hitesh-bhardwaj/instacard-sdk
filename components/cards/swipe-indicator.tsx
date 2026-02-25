import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { useThemeStore } from '@/hooks/use-theme-store';
import { hapticLight } from '@/lib/haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface SwipeIndicatorProps {
  currentIndex: number;
  totalCount: number;
  onPreviousPress?: () => void;
  onNextPress?: () => void;
}

const ARROW_SIZE = 26;
const ACTIVE_OPACITY = 1;
const INACTIVE_OPACITY = 0.2;

const PRESS_SCALE = 0.88;
const SPRING_CONFIG = { damping: 15, stiffness: 400 };

export function SwipeIndicator({
  currentIndex,
  totalCount,
  onPreviousPress,
  onNextPress,
}: SwipeIndicatorProps) {
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < totalCount - 1;
  const { isDarkMode } = useThemeStore();
  const scaleLeft = useSharedValue(1);
  const scaleRight = useSharedValue(1);
  const opacityLeft = useSharedValue(canGoLeft ? ACTIVE_OPACITY : INACTIVE_OPACITY);
  const opacityRight = useSharedValue(canGoRight ? ACTIVE_OPACITY : INACTIVE_OPACITY);

  useEffect(() => {
    opacityLeft.value = withTiming(canGoLeft ? ACTIVE_OPACITY : INACTIVE_OPACITY, {
      duration: 200,
    });
    opacityRight.value = withTiming(canGoRight ? ACTIVE_OPACITY : INACTIVE_OPACITY, {
      duration: 200,
    });
  }, [canGoLeft, canGoRight, opacityLeft, opacityRight]);

  const counterText = `${(currentIndex + 1).toString().padStart(2, '0')}/${totalCount
    .toString()
    .padStart(2, '0')}`;


  const colors = useInstacardColors();
  const styles = createStyles(colors);

  const hintText = totalCount === 1
    ? <Text style={styles.hint}><Text style={styles.hintBold}>Tap</Text> to view card details</Text>
    : canGoRight
      ? <Text style={styles.hint}><Text style={styles.hintBold}>Tap</Text> to view details & <Text style={styles.hintBold}>Swipe</Text> left to see next cards</Text>
      : <Text style={styles.hint}><Text style={styles.hintBold}>Swipe back</Text> to see previous cards</Text>;

  const handlePrevious = () => {
    if (canGoLeft && onPreviousPress) {
      hapticLight();
      onPreviousPress();
    }
  };

  const handleNext = () => {
    if (canGoRight && onNextPress) {
      hapticLight();
      onNextPress();
    }
  };

  const animatedStyleLeft = useAnimatedStyle(() => ({
    opacity: opacityLeft.value,
    transform: [{ scale: scaleLeft.value }],
  }));

  const animatedStyleRight = useAnimatedStyle(() => ({
    opacity: opacityRight.value,
    transform: [{ scale: scaleRight.value }],
  }));


  return (
    <View style={styles.container}>
      {hintText}
      <View style={styles.arrowRow}>
        <TouchableOpacity
          activeOpacity={.8}
          onPress={handlePrevious}
          onPressIn={() => {
            if (canGoLeft) scaleLeft.value = withSpring(PRESS_SCALE, SPRING_CONFIG);
          }}
          onPressOut={() => {
            scaleLeft.value = withSpring(1, SPRING_CONFIG);
          }}
          disabled={!canGoLeft}
          style={styles.arrowPressable}
        >
          <Animated.View style={[styles.arrowContainer, animatedStyleLeft]}>
            <ChevronLeft
              size={16}
              color={isDarkMode ? colors.textPrimary : colors.textSecondary}
            />
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.counter}>{counterText}</Text>

        <TouchableOpacity
          activeOpacity={.8}
          onPress={handleNext}
          onPressIn={() => {
            if (canGoRight) scaleRight.value = withSpring(PRESS_SCALE, SPRING_CONFIG);
          }}
          onPressOut={() => {
            scaleRight.value = withSpring(1, SPRING_CONFIG);
          }}
          disabled={!canGoRight}
          style={styles.arrowPressable}
        >
          <Animated.View style={[styles.arrowContainer, animatedStyleRight]}>
            <ChevronRight
              size={16}
              color={isDarkMode ? colors.textPrimary : colors.textSecondary}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 510,
    alignItems: 'center',
    gap: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  hintBold: {
    fontWeight: '700',
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  arrowPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,

    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  counter: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
