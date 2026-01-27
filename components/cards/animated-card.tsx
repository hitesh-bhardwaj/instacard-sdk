import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { CardData } from '@/constants/cards';
import { CardItem } from './card-item';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Stack configuration constants
export const STACK_CONFIG = {
  VISIBLE_CARDS: 15,
  VERTICAL_OFFSET: -35,
  SCALE_FACTOR: 0.05,
  SWIPE_THRESHOLD: 120,
  SWIPE_VELOCITY_THRESHOLD: 1500,
};

interface AnimatedCardProps {
  card: CardData;
  index: number;
  currentIndex: SharedValue<number>;
  translationX: SharedValue<number>;
  slideBackX: SharedValue<number>;
  isAnimatingBack: SharedValue<boolean>;
  stackProgress: SharedValue<number>;
  focusProgress: SharedValue<number>;
  selectedIndex: SharedValue<number>;
  totalCards: number;
  onPress?: (card: CardData) => void;
}

export function AnimatedCard({
  card,
  index,
  currentIndex,
  translationX,
  slideBackX,
  isAnimatingBack,
  stackProgress,
  focusProgress,
  selectedIndex,
  totalCards,
  onPress,
}: AnimatedCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate stack position relative to current front card (circular)
    const total = totalCards;
    const rawPosition = index - currentIndex.value;
    const stackPosition = ((rawPosition % total) + total) % total;

    // Focus mode calculations (when drawer is open)
    const selectionDistance = Math.abs(index - selectedIndex.value);
    const selectionStrength = interpolate(
      selectionDistance,
      [0, 0.85],
      [1, 0],
      Extrapolation.CLAMP
    );
    const dimOpacity = interpolate(
      selectionDistance,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const focusOpacity = interpolate(
      focusProgress.value,
      [0, 1],
      [1, dimOpacity],
      Extrapolation.CLAMP
    );
    const focusLift = interpolate(
      focusProgress.value,
      [0, 1],
      [0, -120 * selectionStrength],
      Extrapolation.CLAMP
    );
    const focusScale = interpolate(
      focusProgress.value,
      [0, 1],
      [1, 1 - 0.1 * selectionStrength],
      Extrapolation.CLAMP
    );

    // Hide cards beyond visible limit
    if (stackPosition >= STACK_CONFIG.VISIBLE_CARDS) {
      return {
        opacity: 0,
        transform: [{ scale: 0.5 }],
        zIndex: -1,
      };
    }

    const isFrontCard = stackPosition === 0;

    if (isFrontCard) {
      // Check if this card is animating back in (swipe right)
      if (isAnimatingBack.value) {
        const rotation = interpolate(
          slideBackX.value,
          [-STACK_CONFIG.SWIPE_THRESHOLD * 2, 0],
          [-12, 0],
          Extrapolation.CLAMP
        );

        return {
          opacity: 1,
          transform: [
            { translateX: slideBackX.value },
            { translateY: focusLift },
            { rotate: `${rotation}deg` },
          ],
          zIndex: totalCards,
        };
      }

      // Normal front card - follows the finger with subtle rotation (only for swipe left)
      const effectiveTranslation = translationX.value < 0 ? translationX.value : 0;

      const rotation = interpolate(
        effectiveTranslation,
        [-STACK_CONFIG.SWIPE_THRESHOLD * 2, 0],
        [-12, 0],
        Extrapolation.CLAMP
      );

      // Subtle opacity fade as card moves away
      const opacity = interpolate(
        Math.abs(effectiveTranslation),
        [0, STACK_CONFIG.SWIPE_THRESHOLD * 2],
        [1, 0.8],
        Extrapolation.CLAMP
      );

      return {
        opacity: opacity * focusOpacity,
        transform: [
          { scale: focusScale },
          { translateX: effectiveTranslation },
          { translateY: focusLift },
          { rotate: `${rotation}deg` },
        ],
        zIndex: totalCards - stackPosition,
      };
    }

    // Cards behind: smoothly scale up/down and move as deck advances
    const currentScale = 1 - stackPosition * STACK_CONFIG.SCALE_FACTOR;
    const currentTranslateY = stackPosition * STACK_CONFIG.VERTICAL_OFFSET;

    const forwardScale = 1 - (stackPosition - 1) * STACK_CONFIG.SCALE_FACTOR;
    const forwardTranslateY = (stackPosition - 1) * STACK_CONFIG.VERTICAL_OFFSET;

    let scale = currentScale;
    let translateY = currentTranslateY;

    if (isAnimatingBack.value) {
      const backwardProgress = interpolate(
        slideBackX.value,
        [-SCREEN_WIDTH, 0],
        [1, 0],
        Extrapolation.CLAMP
      );
      scale = interpolate(backwardProgress, [0, 1], [currentScale, forwardScale]);
      translateY = interpolate(backwardProgress, [0, 1], [currentTranslateY, forwardTranslateY]);
    } else if (stackProgress.value > 0) {
      scale = interpolate(
        stackProgress.value,
        [0, 1],
        [currentScale, forwardScale],
        Extrapolation.CLAMP
      );
      translateY = interpolate(
        stackProgress.value,
        [0, 1],
        [currentTranslateY, forwardTranslateY],
        Extrapolation.CLAMP
      );
    }

    // Subtle depth effect
    const depthOpacity = interpolate(stackPosition, [0, 10], [1, 0.9], Extrapolation.CLAMP);

    return {
      opacity: depthOpacity * focusOpacity,
      transform: [{ scale: scale * focusScale }, { translateY }],
      zIndex: totalCards - stackPosition,
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <CardItem card={card} onPress={onPress} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: '100%',
    top: 230,
  },
});
