import { InstacardColors, useInstacardColors } from '@/constants/colors';
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
  const colors = useInstacardColors();
  const styles = createStyles(colors);  


  const formattedAmount = formatAmountWithCommas(amount);
  const amountInWords = convertToWords(Number(amount));

  return (
    <View style={styles.amountSection}>
      <View style={[styles.amountContainer]}>
        <View style={styles.amountRow}>
          <Text style={[styles.amountText, { textDecorationLine: 'line-through', marginRight: 4 }]}>N</Text>
          <Text style={styles.amountText}>{formattedAmount}</Text>
        </View>
        <Text style={styles.amountInWords}>{amountInWords}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
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
    color: colors.textPrimary,
    marginTop: 8,
    marginRight: 4,
  },
  amountText: {
    fontSize: 56,
    fontFamily: AppFonts.bold,
    color: colors.textPrimary,
  },
  amountInWords: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
