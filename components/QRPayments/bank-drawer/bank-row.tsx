import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticSelection } from '@/lib/haptics';
import { BalanceChip } from './balance-chip';
import type { BankItem } from './types';

interface BankRowProps {
  bank: BankItem;
  selected: boolean;
  onSelect: (bankId: string) => void;
}

export function BankRow({ bank, selected, onSelect }: BankRowProps) {
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity
      style={[styles.bankRow, selected && styles.bankRowSelected]}
      activeOpacity={0.85}
      onPress={() => {
        hapticSelection();
        onSelect(bank.id);
      }}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={styles.bankIcon}>
        <Text style={styles.bankIconText}>{bank.name.slice(0, 1).toUpperCase()}</Text>
      </View>

      <View style={styles.bankText}>
        <View style={styles.bankTopRow}>
          <Text style={styles.bankName} numberOfLines={1}>
            {bank.name}
          </Text>
        </View>
          <BalanceChip revealedText={bank.balance} />
        {/* {bank.subtitle ? (
          <Text style={styles.bankSub} numberOfLines={1}>
            {bank.subtitle}
          </Text>
        ) : null} */}
      </View>

      <View style={[styles.radioOuter, selected ? styles.radioOuterSelected : styles.radioOuterUnselected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.white}90`,
    padding: 12,
    // borderWidth: 1,
    // borderColor: colors.border,
    gap: 12,
  },
  bankRowSelected: {
    // borderColor: InstacardColors.textPrimary,
    // backgroundColor: `${InstacardColors.primary}08`,
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIconText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  bankText: {
    flex: 1,
    gap: 2,
  },
  bankTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  bankName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  bankSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.textPrimary,
  },
  radioOuterUnselected: {
    borderColor: colors.border,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.orange,
  },
});