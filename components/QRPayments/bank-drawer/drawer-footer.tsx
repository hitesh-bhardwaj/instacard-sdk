import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticLight } from '@/lib/haptics';

interface DrawerFooterProps {
  canConfirm: boolean;
  onAddNew?: () => void;
  onConfirm: () => void;
}

export function DrawerFooter({ canConfirm, onAddNew, onConfirm }: DrawerFooterProps) {
  return (
    <>
      {/* <TouchableOpacity
        activeOpacity={0.9}
        style={styles.addNewBtn}
        onPress={() => {
          hapticLight();
          onAddNew?.();
        }}
        accessibilityRole="button"
        accessibilityLabel="Add new bank or card"
      >
        <Ionicons name="add" size={18} color={InstacardColors.primary} />
        <Text style={styles.addNewText}>Add new bank/card</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
        onPress={() => {
          if (!canConfirm) return;
          hapticLight();
          onConfirm();
        }}
        accessibilityRole="button"
        accessibilityLabel="Confirm bank and proceed"
      >
        <Text style={styles.confirmText}>Pay Now</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  addNewBtn: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  addNewText: {
    fontSize: 14,
    fontFamily: AppFonts.medium,
    color: InstacardColors.primary,
  },
  confirmBtn: {
    marginVertical: 16,
    backgroundColor: InstacardColors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textOnPrimary,
  },
});