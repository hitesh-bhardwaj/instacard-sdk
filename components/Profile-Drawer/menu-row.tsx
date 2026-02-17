import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';

export interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  danger?: boolean;
  isRTL?: boolean;
}

export function MenuRow({ icon, label, onPress, showChevron = true, rightElement, danger, isRTL = false }: MenuRowProps) {
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <TouchableOpacity
      style={[styles.menuRow, isRTL && styles.menuRowRTL]}
      onPress={() => {
        hapticLight();
        onPress();
      }}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
        {icon}
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger, isRTL && styles.menuLabelRTL]}>{label}</Text>
      {rightElement || (showChevron && (
        <Chevron size={18} color={InstacardColors.textSecondary} />
      ))}
    </TouchableOpacity>
  );
}

export const menuRowStyles = StyleSheet.create({
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${InstacardColors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDanger: {
    backgroundColor: `${InstacardColors.error}15`,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: InstacardColors.textPrimary,
  },
  menuLabelDanger: {
    color: InstacardColors.error,
  },
  menuRowRTL: {
    direction: 'rtl',
  },
  menuLabelRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});

const styles = menuRowStyles;
