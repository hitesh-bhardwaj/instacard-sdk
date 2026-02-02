import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '@/assets/svg/home.svg';
import AddIcon from '@/assets/svg/add.svg';
import ScanIcon from '@/assets/svg/scan.svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';
import { hapticLight, hapticMedium } from '@/lib/haptics';

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
      <TouchableOpacity
        style={styles.bottomAction}
        onPress={() => {
          hapticLight();
          onHomePress?.();
        }}
        >
          <HomeIcon width={25} height={25} color={InstacardColors.textOnPrimary} />
        <Text style={styles.bottomText}>Home</Text>
      </TouchableOpacity>

      <View style={styles.centerSlot} />

      <TouchableOpacity
        style={styles.bottomAction}
        onPress={() => {
          hapticLight();
          onAddPress?.();
        }}
      >
        <AddIcon width={25} height={25} color={InstacardColors.textOnPrimary} />
        <Text style={styles.bottomText}>Add Instacard</Text>
      </TouchableOpacity>

      <View style={styles.centerButtonWrap}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => {
            hapticMedium();
            onScanPress?.();
          }}
        >
          <ScanIcon width={35} height={35} color={InstacardColors.textOnPrimary} />
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
    paddingHorizontal: 40,
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
    fontSize: 12,
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
    borderWidth: 2,
    borderColor: InstacardColors.white,
  },
});
