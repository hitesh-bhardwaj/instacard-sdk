import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { convertToWords } from '@/utils/formatamountinwords';
import formatAmountWithCommas from '@/utils/formatAmountWithCommas';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface AmountDisplayProps {
  amount: string;
  currencySymbol?: string;
}

export function AmountDisplay({ amount, currencySymbol = 'N' }: AmountDisplayProps) {
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const formattedAmount = formatAmountWithCommas(amount);
  const amountInWords = convertToWords(Number(amount));

  return (
    <View style={styles.amountSection}>
      <View style={[styles.amountContainer]}>
        <View style={styles.amountRow}>
          <Text
            style={[
              styles.amountText,
              { textDecorationLine: 'line-through', marginRight: 4 },
            ]}
          >
            {currencySymbol}
          </Text>
          <Text style={styles.amountText}>{formattedAmount}</Text>
        </View>
        <Text style={styles.amountInWords}>
          {amountInWords} {t('cards.scan.amountSuffix', { defaultValue: '' })}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) =>
  StyleSheet.create({
    amountSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    amountContainer: {
      alignItems: 'center',
      marginRight: 16,
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    rupeeSymbol: {
      fontSize: 24,
      textDecorationLine: 'line-through',
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
