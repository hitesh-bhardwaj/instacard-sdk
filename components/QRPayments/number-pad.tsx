import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticLight } from '@/lib/haptics';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface NumberPadProps {
  onNumberPress: (num: string) => void;
  onBackspace: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function NumberButton({
  value,
  onPress,
  isBackspace = false,
}: {
  value: string;
  onPress: () => void;
  isBackspace?: boolean;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    hapticLight();
    scale.value = withSpring(0.85, { damping: 12, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.numButton, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {isBackspace ? (
        <Ionicons name="backspace-outline" size={24} color={InstacardColors.textPrimary} />
      ) : (
        <Text style={styles.numText}>{value}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
}

export function NumberPad({ onNumberPress, onBackspace }: NumberPadProps) {
  return (
    <View style={styles.numPad}>
      <View style={styles.numRow}>
        <NumberButton value="1" onPress={() => onNumberPress('1')} />
        <NumberButton value="2" onPress={() => onNumberPress('2')} />
        <NumberButton value="3" onPress={() => onNumberPress('3')} />
      </View>
      <View style={styles.numRow}>
        <NumberButton value="4" onPress={() => onNumberPress('4')} />
        <NumberButton value="5" onPress={() => onNumberPress('5')} />
        <NumberButton value="6" onPress={() => onNumberPress('6')} />
      </View>
      <View style={styles.numRow}>
        <NumberButton value="7" onPress={() => onNumberPress('7')} />
        <NumberButton value="8" onPress={() => onNumberPress('8')} />
        <NumberButton value="9" onPress={() => onNumberPress('9')} />
      </View>
      <View style={styles.numRow}>
        <NumberButton value="." onPress={() => onNumberPress('.')} />
        <NumberButton value="0" onPress={() => onNumberPress('0')} />
        <NumberButton value="" onPress={onBackspace} isBackspace />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  numPad: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingBottom: 24,
  },
  numRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  numButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 24,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
});
