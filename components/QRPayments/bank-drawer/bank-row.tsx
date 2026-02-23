import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InstacardColors } from '@/constants/colors';
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

const styles = StyleSheet.create({
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${InstacardColors.white}90`,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: InstacardColors.border,
    gap: 12,
  },
  bankRowSelected: {
    borderColor: InstacardColors.textPrimary,
    // backgroundColor: `${InstacardColors.primary}08`,
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${InstacardColors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIconText: {
    fontSize: 18,
    fontFamily: AppFonts.bold,
    color: InstacardColors.primary,
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
    fontSize: 15,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
  bankSub: {
    fontSize: 12,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
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
    borderColor: InstacardColors.textPrimary,
  },
  radioOuterUnselected: {
    borderColor: InstacardColors.border,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: InstacardColors.orange,
  },
});