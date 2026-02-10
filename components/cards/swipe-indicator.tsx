import { InstacardColors } from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

interface SwipeIndicatorProps {
  currentIndex: number;
  totalCount: number;
}

const ARROW_SIZE = 18;
const ACTIVE_OPACITY = 1;
const INACTIVE_OPACITY = 0.2;

export function SwipeIndicator({ currentIndex, totalCount }: SwipeIndicatorProps) {
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < totalCount - 1;

  const counterText = `${(currentIndex + 1).toString().padStart(2, '0')}/${totalCount
    .toString()
    .padStart(2, '0')}`;

  const hintText = totalCount === 1
    ? <Text style={styles.hint}><Text style={styles.hintBold}>Tap</Text> to view card details</Text>
    : canGoRight
      ? <Text style={styles.hint}><Text style={styles.hintBold}>Tap</Text> to view details & <Text style={styles.hintBold}>Swipe</Text> left to see next cards</Text>
      : <Text style={styles.hint}><Text style={styles.hintBold}>Swipe back</Text> to see previous cards</Text>;

  return (
    <View style={styles.container}>
      {hintText}
      <View style={styles.arrowRow}>
        <View style={[styles.arrowContainer, { opacity: canGoLeft ? ACTIVE_OPACITY : INACTIVE_OPACITY }]}>
          <MaterialIcons
            name="chevron-left"
            size={ARROW_SIZE}
            color={InstacardColors.textSecondary}
          />
        </View>

        <Text style={styles.counter}>{counterText}</Text>

        <View style={[styles.arrowContainer, { opacity: canGoRight ? ACTIVE_OPACITY : INACTIVE_OPACITY }]}>
          <MaterialIcons
            name="chevron-right"
            size={ARROW_SIZE}
            color={InstacardColors.textSecondary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: InstacardColors.textSecondary,
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
  },
  arrowContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    fontSize: 12,
    fontWeight: '700',
    color: InstacardColors.textSecondary,
    minWidth: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
