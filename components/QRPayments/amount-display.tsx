import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { convertToWords } from '@/utils/formatamountinwords';
import formatAmountWithCommas from '@/utils/formatAmountWithCommas';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AmountDisplayProps {
  amount: string;
}

export function AmountDisplay({ amount }: AmountDisplayProps) {



  const formattedAmount = formatAmountWithCommas(amount);
  const amountInWords = convertToWords(Number(amount));

  return (
    <View style={styles.amountSection}>
      <View style={[styles.amountContainer]}>
        <View style={styles.amountRow}>
          <Text style={styles.rupeeSymbol}>N</Text>
          <Text style={styles.amountText}>{formattedAmount}</Text>
        </View>
        <Text style={styles.amountInWords}>{amountInWords}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amountSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginRight:16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rupeeSymbol: {
    fontSize: 24,
    textDecorationLine:'line-through',
    fontFamily: AppFonts.bold,
    color: InstacardColors.textPrimary,
    marginTop: 8,
    marginRight: 4,
  },
  amountText: {
    fontSize: 56,
    fontFamily: AppFonts.bold,
    color: InstacardColors.textPrimary,
  },
  amountInWords: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
