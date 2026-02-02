import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LogoIcon from '@/assets/svg/instacard.svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import { Image } from 'expo-image';

interface CardsHeaderProps {
  onSearchPress?: () => void;
  onHelpPress?: () => void;
  onAvatarPress?: () => void;
  onBackPress?: () => void;
  subtitle?: string;
}

export function CardsHeader({
  onSearchPress,
  onHelpPress,
  onAvatarPress,
  onBackPress,
  subtitle,
}: CardsHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleBackPress = onBackPress ?? router.back;
  const subtitleText = subtitle ?? 'Digital Instacard Wallet';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
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
            <View style={styles.logoPlaceholder}>
              <LogoIcon width={40} height={40} color={InstacardColors.textOnPrimary} />
            </View>
            <Text style={styles.brandName}>Instacard</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              hapticLight();
              onSearchPress?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <IconSymbol
              name="magnifyingglass"
              size={27}
              color={InstacardColors.textOnPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              hapticLight();
              onHelpPress?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Help"
          >
            <IconSymbol
              name="questionmark.circle"
              size={27}
              color={InstacardColors.textOnPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => {
              hapticLight();
              onAvatarPress?.();
            }}
          >
            <Image
              source={require('@/assets/images/profile.png')}
              style={styles.avatarImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>{subtitleText}</Text>
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
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: InstacardColors.primary,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '600',
    color: InstacardColors.textOnPrimary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    padding: 4,
  },
  avatarButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  subtitle: {
    fontSize: 14,
    color: InstacardColors.textOnPrimary,
    opacity: 1,
    marginTop: -2,
    marginLeft: 10,
  },
});
