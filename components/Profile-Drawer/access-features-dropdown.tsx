import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import { useThemeStore } from '@/hooks/use-theme-store';
import {
  ChevronDown,
  CreditCard,
  HandCoins,
  KeyRound,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Star,
  Store,
  Users,
  Wallet,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type FeatureId =
  | 'digitalAccountWallet'
  | 'virtualCardWallet'
  | 'merchantAccountWallet'
  | 'agencyBanking'
  | 'instantDigitalLoans'
  | 'upgradeKyc'
  | 'rewardsManagement'
  | 'softTokenAccount'
  | 'chatboxHelpSupport'
  | 'scanPay';

type FeatureRow = {
  id: FeatureId;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

interface AccessFeaturesDropdownProps {
  isRTL?: boolean;
  onSelect?: (id: FeatureId) => void;
}

const ANIM_DURATION = 400;
const ANIM_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

export function AccessFeaturesDropdown({ isRTL = false, onSelect }: AccessFeaturesDropdownProps) {
  const { t } = useTranslation();
  const colors = useInstacardColors();
  const { isDarkMode } = useThemeStore();
  const styles = createStyles(colors);
  const [isOpen, setIsOpen] = useState(false);
  const measuredHeight = useSharedValue(0);
  const animHeight = useSharedValue(0);
  const chevronRotate = useSharedValue(0);

  const features = useMemo<FeatureRow[]>(
    () => [
      { id: 'digitalAccountWallet', label: 'Digital Account Wallet', Icon: Smartphone },
      { id: 'virtualCardWallet', label: 'Virtual Card Wallet', Icon: CreditCard },
      { id: 'merchantAccountWallet', label: 'Merchant Account Wallet', Icon: Store },
      { id: 'agencyBanking', label: 'Agency Banking', Icon: Users },
      { id: 'instantDigitalLoans', label: 'Instant Digital Loans', Icon: HandCoins },
      { id: 'upgradeKyc', label: 'Upgrade KYC', Icon: ShieldCheck },
      { id: 'rewardsManagement', label: 'Rewards Management', Icon: Star },
      { id: 'softTokenAccount', label: 'Soft Token Account', Icon: KeyRound },
      { id: 'chatboxHelpSupport', label: 'Chatbox Help Support', Icon: MessageCircle },
      { id: 'scanPay', label: 'Scan Pay', Icon: QrCode },
    ],
    [],
  );

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) measuredHeight.value = h;
  }, [measuredHeight]);

  const toggle = useCallback(() => {
    hapticLight();
    const opening = !isOpen;
    setIsOpen(opening);
    animHeight.value = withTiming(opening ? measuredHeight.value : 0, {
      duration: ANIM_DURATION,
      easing: ANIM_EASING,
    });
    chevronRotate.value = withTiming(opening ? 180 : 0, {
      duration: ANIM_DURATION,
      easing: ANIM_EASING,
    });
  }, [isOpen, animHeight, measuredHeight, chevronRotate]);

  const handleSelect = useCallback(
    (id: FeatureId) => {
      hapticLight();
      onSelect?.(id);
    },
    [onSelect],
  );

  const clipStyle = useAnimatedStyle(() => ({
    height: animHeight.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotate.value}deg` }],
  }));

  return (
    <View>
      <Pressable
        onPress={toggle}
        style={[styles.headerButton, isRTL && styles.rtlRow]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel="Profile Access Features"
      >
        <View style={styles.iconWrapper}>
          <Wallet size={20} color={isDarkMode ? '#ffffff' : colors.primary} />
        </View>
        <Text style={[styles.headerLabel, isRTL && styles.rtlText]}>
          Access Features
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color={colors.textSecondary} />
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.clipWrapper, clipStyle]}>
        <View style={styles.dropdownWrapper} onLayout={handleLayout}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {features.map(({ id, label, Icon }) => (
              <Pressable
                key={id}
                onPress={() => handleSelect(id)}
                style={({ pressed }) => [
                  styles.itemButton,
                  isRTL && styles.rtlRow,
                  pressed && styles.itemButtonPressed,
                ]}
              >
                <View style={styles.itemIconWrapper}>
                  <Icon size={20} color={isDarkMode ? colors.textPrimary : colors.textPrimary} />
                </View>
                <Text style={[styles.itemLabel, isRTL && styles.rtlText]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) =>
  StyleSheet.create({
    headerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.lightGray,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    headerLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    clipWrapper: {
      overflow: 'hidden',
    },
    dropdownWrapper: {
      position: 'absolute',
      top: 0,
      left: 8,
      right: 8,
      borderRadius: 12,
      backgroundColor: colors.lightGray,
      maxHeight: 280,
      overflow: 'hidden',
    },
    dropdownScroll: {
      paddingVertical: 4,
    },
    itemButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    itemButtonPressed: {
      backgroundColor: `${colors.primary}10`,
    },
    itemIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    itemLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    rtlRow: {
      flexDirection: 'row-reverse',
    },
    rtlText: {
      textAlign: 'right',
    },
  });
