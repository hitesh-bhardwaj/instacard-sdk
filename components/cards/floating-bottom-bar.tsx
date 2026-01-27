import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';

interface FloatingBottomBarProps {
  onHomePress?: () => void;
  onScanPress?: () => void;
  onAddPress?: () => void;
}

export function FloatingBottomBar({
  onHomePress,
  onScanPress,
  onAddPress,
}: FloatingBottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { bottom: insets.bottom + 16 }]}>
      <TouchableOpacity style={styles.bottomAction} onPress={onHomePress}>
        <IconSymbol name="house.fill" size={20} color={InstacardColors.textOnPrimary} />
        <Text style={styles.bottomText}>Home</Text>
      </TouchableOpacity>

      <View style={styles.centerSlot} />

      <TouchableOpacity style={styles.bottomAction} onPress={onAddPress}>
        <IconSymbol name="plus" size={20} color={InstacardColors.textOnPrimary} />
        <Text style={styles.bottomText}>Add Instacard</Text>
      </TouchableOpacity>

      <View style={styles.centerButtonWrap}>
        <TouchableOpacity style={styles.centerButton} onPress={onScanPress}>
          <IconSymbol
            name="qrcode.viewfinder"
            size={24}
            color={InstacardColors.textOnPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 28,
    right: 28,
    height: 70,
    backgroundColor: InstacardColors.primary,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    shadowColor: InstacardColors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  bottomAction: {
    alignItems: 'center',
    gap: 4,
  },
  bottomText: {
    color: InstacardColors.textOnPrimary,
    fontSize: 14,
  },
  centerSlot: {
    width: 64,
  },
  centerButtonWrap: {
    position: 'absolute',
    top: -26,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  centerButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: InstacardColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: InstacardColors.white,
  },
});
