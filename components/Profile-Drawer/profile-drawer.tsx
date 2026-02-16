import { ReactNode, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;
const DRAG_HANDLE_WIDTH = 24;
const CLOSE_THRESHOLD = DRAWER_WIDTH * 0.3;

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ProfileDrawer({ visible, onClose, children }: ProfileDrawerProps) {

  const translateX = useSharedValue(DRAWER_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const dragStartX = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateX.value = withSpring(0, SPRING_CONFIG);
      backdropOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateX.value = withSpring(DRAWER_WIDTH, SPRING_CONFIG);
      backdropOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible, translateX, backdropOpacity]);

  const closeDrawer = () => {
    hapticLight();
    onClose();
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragStartX.value = translateX.value;
    })
    .onUpdate((event) => {
      // Only allow dragging to the right (positive direction)
      const newTranslateX = dragStartX.value + event.translationX;
      translateX.value = Math.max(0, Math.min(newTranslateX, DRAWER_WIDTH));
      // Update backdrop opacity based on drawer position
      backdropOpacity.value = 1 - (translateX.value / DRAWER_WIDTH);
    })
    .onEnd((event) => {
      // If dragged past threshold or with enough velocity, close the drawer
      if (translateX.value > CLOSE_THRESHOLD || event.velocityX > 500) {
        translateX.value = withSpring(DRAWER_WIDTH, SPRING_CONFIG);
        backdropOpacity.value = withTiming(0, {
          duration: 250,
          easing: Easing.in(Easing.cubic),
        });
        runOnJS(closeDrawer)();
      } else {
        // Snap back to open position
        translateX.value = withSpring(0, SPRING_CONFIG);
        backdropOpacity.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: visible ? 'auto' : 'none',
  }));

  const handleBackdropPress = () => {
    hapticLight();
    onClose();
  };

  return (
    <>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={handleBackdropPress}
          accessibilityRole="button"
          accessibilityLabel="Close drawer"
        />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.drawer,
            drawerStyle,
          ]}
        >
          {/* Drag Handle on the left edge - positioned absolutely */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 999,
    backgroundColor: InstacardColors.white,
  },
  dragHandleContainer: {
    position: 'absolute',
    left: -2,
    top: 0,
    bottom: 0,
    width: DRAG_HANDLE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dragHandle: {
    width: 4,
    height: 40,
    backgroundColor: InstacardColors.border,
    borderRadius: 2,
  },
});
