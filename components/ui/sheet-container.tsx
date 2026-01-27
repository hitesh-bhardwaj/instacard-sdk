import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { InstacardColors } from '@/constants/colors';

interface SheetContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * Reusable sheet container that provides the standard rounded white
 * background sheet that overlaps the purple header.
 */
export function SheetContainer({ children, style }: SheetContainerProps) {
  return <View style={[styles.sheet, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    marginTop: -16,
    backgroundColor: InstacardColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});
