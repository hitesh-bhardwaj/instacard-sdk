import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeIcon from '@/assets/svg/home.svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import { ChevronsLeft, CornerDownLeft, CornerLeftDown, CornerLeftUp, LogOut } from 'lucide-react-native';

interface CardsHeaderProps {
  onBackPress?: () => void;
  subtitle?: string;
  showHomeIcon?: boolean;
  onHomePress?: () => void;
}

export function CardsHeader({
  onBackPress,
  subtitle,
  showHomeIcon = false,
  onHomePress = () => {},
}: CardsHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleBackPress = onBackPress ?? router.back;
  const subtitleText = subtitle ?? 'Digital Instacard Wallet';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topRow} >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            hapticLight();
            handleBackPress();
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <IconSymbol
            name="chevron.left"
            size={24}
            color={InstacardColors.textOnPrimary}
          />
        </TouchableOpacity>
        <View style={styles.brandSection} accessibilityRole="header">
          <Text style={styles.brandName}>Instacard</Text>
        </View>
        {!showHomeIcon && <View style={styles.placeholder} />}
        {showHomeIcon && (
          <TouchableOpacity onPress={onHomePress} accessibilityRole="button" accessibilityLabel="Go home">
            <LogOut width={24} height={24} color={InstacardColors.textOnPrimary} />
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: InstacardColors.primary,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  backButton: {
    padding: 4,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '400',
    color: InstacardColors.textOnPrimary,
  },
  placeholder: {
    width: 32,
  },
  subtitle: {
    fontSize: 14,
    color: InstacardColors.textOnPrimary,
    opacity: 1,
    marginTop: -2,
    marginLeft: 10,
  },
});
