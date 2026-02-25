import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '@/assets/svg/home.svg';
import AddIcon from '@/assets/svg/add.svg';
import ScanIcon from '@/assets/svg/scan.svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';
import { hapticLight, hapticMedium } from '@/lib/haptics';
import { Gift, GiftIcon, LucideGift, Plus } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useThemeStore } from '@/hooks/use-theme-store';

interface FloatingBottomBarProps {
  onHomePress?: () => void;
  onScanPress?: () => void;
  onAddPress?: () => void;
  onAddGiftPress?: () => void;
}

export function FloatingBottomBar({
  onHomePress,
  onScanPress,
  onAddPress,
  onAddGiftPress,
}: FloatingBottomBarProps) {
  const plusrotation = useSharedValue(0);
  const { isDarkMode } = useThemeStore();
  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${plusrotation.value}deg` }],
  }));
  const rotatePlus = () => {
    plusrotation.value = withTiming(plusrotation.value + 90, {
      duration: 1000,
    });
  };
  const insets = useSafeAreaInsets();

  return (
    <>

      <View style={[styles.bottomBar, { bottom: insets.bottom + 24 }]}>
        {/* <TouchableOpacity
        style={styles.bottomAction}
        onPress={() => {
          hapticLight();
          onHomePress?.();
        }}
        >
          <HomeIcon width={25} height={25} color={InstacardColors.textOnPrimary} />
        <Text style={styles.bottomText}>Home</Text>
      </TouchableOpacity> */}

        {/* <View style={styles.centerSlot} /> */}

        <TouchableOpacity
          style={styles.bottomAction}
          onPress={() => {
            hapticLight();
            rotatePlus();
            setTimeout(() => {
              onAddPress?.();
            }, 500);
          }}
        >
          <Animated.View style={rotationStyle}>
            <Plus width={25} height={25} color={InstacardColors.textOnPrimary} />
          </Animated.View>
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
            <ScanIcon width={30} height={30} color={InstacardColors.textOnPrimary} />
          </TouchableOpacity>
        </View>




      </View>
      <TouchableOpacity style={[styles.addGiftCardText, { bottom: insets.bottom - 10 }]} activeOpacity={0.8} onPress={onAddGiftPress}>
        <View style={{ width: 20, height: 20, marginBottom:5, alignItems: 'center', justifyContent: 'center' }}>

            <LucideGift width={20} height={20} color={isDarkMode ? '#ffffff' : InstacardColors.textSecondary} />
        </View>
        <Text style={{ color: isDarkMode ? '#ffffff' : InstacardColors.textSecondary }}>Add Gift Card</Text>
      </TouchableOpacity >
    </>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    transform: [{ translateX: '-50%' }],
    height: 70,
    gap: 20,
    backgroundColor: InstacardColors.primary,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    // shadowColor: InstacardColors.shadow,
    // shadowOpacity: 0.25,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  bottomAction: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    gap: 4,
  },
  bottomText: {
    color: InstacardColors.textOnPrimary,
    fontSize: 16,
  },
  centerSlot: {
    width: 64,
  },
  centerButtonWrap: {
    // position: 'absolute',
    // top: -26,
    // left: 0,
    // right: 0,
    alignItems: 'center',
  },
  centerButton: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: InstacardColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: InstacardColors.white,
  },
  addGiftCardText: { position: 'absolute', left: 0, right: 0, textAlign: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, display:'flex' }
});
