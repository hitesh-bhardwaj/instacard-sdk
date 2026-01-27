import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CardData } from '@/constants/cards';
import { InstacardColors } from '@/constants/colors';
import { AnimatedCard, STACK_CONFIG } from './animated-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Soft animation configurations
const SPRING_CONFIG = {
  damping: 25,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const SLIDE_OUT_CONFIG = {
  duration: 400,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

const DECK_FORWARD_CONFIG = {
  duration: 400,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

const SLIDE_BACK_CONFIG = {
  duration: 400,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

const STACK_DRAG_DISTANCE = STACK_CONFIG.SWIPE_THRESHOLD * 1.6;
const SWIPE_OUT_DISTANCE = SCREEN_WIDTH * 1.2;

interface CardStackProps {
  cards: CardData[];
  onCardPress?: (card: CardData) => void;
  onCardChange?: (index: number) => void;
  isDrawerOpen?: boolean;
  selectedCardId?: string | null;
}

export function CardStack({
  cards,
  onCardPress,
  onCardChange,
  isDrawerOpen = false,
  selectedCardId = null,
}: CardStackProps) {
  const currentIndex = useSharedValue(0);
  const translationX = useSharedValue(0);
  const slideBackX = useSharedValue(0);
  const isAnimatingBack = useSharedValue(false);
  const stackProgress = useSharedValue(0);
  const focusProgress = useSharedValue(0);
  const selectedIndex = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  // Animate focus when drawer opens/closes
  useEffect(() => {
    focusProgress.value = withTiming(isDrawerOpen ? 1 : 0, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [focusProgress, isDrawerOpen]);

  // Update selected index when card is selected in drawer
  useEffect(() => {
    if (!selectedCardId) {
      return;
    }

    const nextIndex = cards.findIndex((card) => card.id === selectedCardId);
    if (nextIndex < 0) {
      return;
    }

    isSwiping.value = false;
    currentIndex.value = nextIndex;
    translationX.value = 0;
    stackProgress.value = 0;
    slideBackX.value = 0;
    isAnimatingBack.value = false;
    selectedIndex.value = withTiming(nextIndex, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    });
  }, [
    cards,
    currentIndex,
    isAnimatingBack,
    selectedCardId,
    selectedIndex,
    isSwiping,
    slideBackX,
    stackProgress,
    translationX,
  ]);

  // Notify parent of card changes via callback
  useAnimatedReaction(
    () => currentIndex.value,
    (current, previous) => {
      if (previous !== null && current !== previous && onCardChange) {
        runOnJS(onCardChange)(current);
      }
    }
  );

  const panGesture = Gesture.Pan()
    .enabled(!isDrawerOpen)
    .onBegin(() => {
      if (isSwiping.value) {
        return;
      }
    })
    .onUpdate((event) => {
      if (isSwiping.value) {
        return;
      }
      translationX.value = event.translationX;
      if (event.translationX < 0) {
        const progress = Math.min(
          1,
          Math.abs(event.translationX) / STACK_DRAG_DISTANCE
        );
        stackProgress.value = progress;
      } else {
        stackProgress.value = 0;
      }
    })
    .onEnd((event) => {
      if (isSwiping.value) {
        return;
      }
      const swipeThresholdMet =
        Math.abs(translationX.value) > STACK_CONFIG.SWIPE_THRESHOLD ||
        Math.abs(event.velocityX) > STACK_CONFIG.SWIPE_VELOCITY_THRESHOLD;

      const swipingLeft = translationX.value < 0 || event.velocityX < 0;
      const swipingRight = translationX.value > 0 || event.velocityX > 0;

      if (swipeThresholdMet && swipingLeft && cards.length > 1) {
        isSwiping.value = true;
        // Swipe left - current card slides out, next card comes forward
        translationX.value = withTiming(-SWIPE_OUT_DISTANCE, SLIDE_OUT_CONFIG);
        stackProgress.value = withTiming(1, DECK_FORWARD_CONFIG, (finished) => {
          if (finished) {
            currentIndex.value = (currentIndex.value + 1) % cards.length;
            translationX.value = 0;
            stackProgress.value = 0;
          }
          isSwiping.value = false;
        });
      } else if (swipeThresholdMet && swipingRight && cards.length > 1) {
        isSwiping.value = true;
        // Swipe right - previous card slides back in from left
        translationX.value = 0;
        stackProgress.value = 0;

        isAnimatingBack.value = true;
        slideBackX.value = -SCREEN_WIDTH;
        currentIndex.value = (currentIndex.value - 1 + cards.length) % cards.length;

        slideBackX.value = withTiming(0, SLIDE_BACK_CONFIG, (finished) => {
          if (finished) {
            isAnimatingBack.value = false;
          }
          isSwiping.value = false;
        });
      } else {
        // Snap back with soft spring
        translationX.value = withSpring(0, SPRING_CONFIG);
        stackProgress.value = withTiming(0, SLIDE_BACK_CONFIG);
      }
    });

  // Render all cards - visibility controlled by animation
  const visibleCards = cards
    .map((card, idx) => (
      <AnimatedCard
        key={card.id}
        card={card}
        index={idx}
        currentIndex={currentIndex}
        translationX={translationX}
        slideBackX={slideBackX}
        isAnimatingBack={isAnimatingBack}
        stackProgress={stackProgress}
        focusProgress={focusProgress}
        selectedIndex={selectedIndex}
        totalCards={cards.length}
        onPress={onCardPress}
      />
    ))
    .reverse();

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.stackContainer}>{visibleCards}</Animated.View>
      </GestureDetector>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
});
