import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BankRow } from '@/components/QRPayments/bank-drawer/bank-row';
import { DrawerFooter } from '@/components/QRPayments/bank-drawer/drawer-footer';
import { DrawerHeader } from '@/components/QRPayments/bank-drawer/drawer-header';
import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import type { CardType } from '@/lib/instacard-sdk';
import type { BankItem as BankItemInternal } from '@/components/QRPayments/bank-drawer/types';
import { CardSimIcon } from 'lucide-react-native';
import { CreditcardIcon, DebitcardIcon, GiftcardIcon, PrepaidcardIcon } from '@/utils/Icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAWER_HEIGHT = Math.min(SCREEN_HEIGHT * 0.55, 520);

const AnimatedView = Animated.createAnimatedComponent(View);

export type BankItem = BankItemInternal;

interface BankActionsDrawerProps {
  visible: boolean;
  amount: string;
  banks: BankItem[];
  selectedBankId?: string | null;
  onSelectBank: (bankId: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  onAddNew?: () => void;
}

interface AccordionSectionProps {
  type: CardType;
  label: string;
  banks: BankItem[];
  isExpanded: boolean;
  selectedBankId?: string;
  onToggle: () => void;
  onSelectBank: (bankId: string) => void;
}

function AccordionSection({
  type,
  label,
  banks,
  isExpanded,
  selectedBankId,
  onToggle,
  onSelectBank,
}: AccordionSectionProps) {
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  const animationProgress = useSharedValue(isExpanded ? 1 : 0);
  const contentHeight = useSharedValue(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    animationProgress.value = withTiming(isExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isExpanded, animationProgress]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [0, measuredHeight],
    );
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 0.5, 1],
    );

    return {
      height: measuredHeight > 0 ? height : undefined,
      opacity,
      overflow: 'hidden',
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 180],
    );

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const onLayout = useCallback((event: { nativeEvent: { layout: { height: number } } }) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
      contentHeight.value = height;
    }
  }, [measuredHeight, contentHeight]);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.sectionHeader}
        onPress={onToggle}
      >
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
           {type === 'debit' ? DebitcardIcon(24, 24, colors.textSecondary) : type === 'credit' ? CreditcardIcon(24, 24, colors.textSecondary) : type === 'gift' ? GiftcardIcon(24, 24, colors.textSecondary) : PrepaidcardIcon(24, 24, colors.textSecondary)}
          <Text style={styles.sectionTitle}>{label}</Text>
        </View>
        <View style={styles.sectionMeta}>
          {/* <Text style={styles.sectionCount}>{banks.length}</Text> */}
          <AnimatedView style={chevronAnimatedStyle}>
            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.textSecondary}
            />
          </AnimatedView>
        </View>
      </TouchableOpacity>

      <AnimatedView style={containerAnimatedStyle}>
        <View
          style={styles.sectionBody}
          onLayout={onLayout}
        >
          {banks.map((bank, index) => {
            const isSelected = bank.id === selectedBankId;
            return (
              <Fragment key={bank.id}>
                {index > 0 && (
                  <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 10, marginVertical: 4 }} />
                )}
                <BankRow
                  bank={bank}
                  selected={isSelected}
                  onSelect={onSelectBank}
                />
              </Fragment>
            );
          })}
        </View>
      </AnimatedView>

      {/* Hidden measurement view */}
      {measuredHeight === 0 && (
        <View
          style={styles.measureContainer}
          onLayout={onLayout}
        >
          {banks.map((bank) => (
            <BankRow
              key={bank.id}
              bank={bank}
              selected={false}
              onSelect={() => { }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export function BankActionsDrawer({
  visible,
  amount,
  banks,
  selectedBankId,
  onSelectBank,
  onClose,
  onConfirm,
  onAddNew,
}: BankActionsDrawerProps) {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [DRAWER_HEIGHT], []);
  const colors = useInstacardColors();
  const styles = createStyles(colors);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const selectedBank = useMemo(() => {
    if (!banks.length) return undefined;
    return banks.find((b) => b.id === selectedBankId) ?? banks[0];
  }, [banks, selectedBankId]);

  const groupedBanks = useMemo(() => {
    const groups: Record<CardType, BankItem[]> = {
      debit: [],
      credit: [],
      prepaid: [],
      gift: [],
    };

    banks.forEach((bank) => {
      groups[bank.cardType]?.push(bank);
    });

    return groups;
  }, [banks]);

  const [expandedTypes, setExpandedTypes] = useState<Record<CardType, boolean>>(() => {
    const initial: Record<CardType, boolean> = {
      debit: false,
      credit: false,
      prepaid: false,
      gift: false,
    };

    const activeBank = banks.find((b) => b.id === selectedBankId) ?? banks[0];
    if (activeBank) {
      initial[activeBank.cardType] = true;
    } else {
      (Object.keys(initial) as CardType[]).forEach((type) => {
        if (groupedBanks[type]?.length && !initial.debit && !initial.credit && !initial.prepaid && !initial.gift) {
          initial[type] = true;
        }
      });
    }

    return initial;
  });

  const toggleType = useCallback((type: CardType) => {
    setExpandedTypes((prev) => {
      const isCurrentlyOpen = prev[type];

      // If tapping the already-open section, collapse all
      if (isCurrentlyOpen) {
        return {
          debit: false,
          credit: false,
          prepaid: false,
          gift: false,
        };
      }

      // Otherwise open only this section and close others
      return {
        debit: type === 'debit',
        credit: type === 'credit',
        prepaid: type === 'prepaid',
        gift: type === 'gift',
      };
    });
  }, []);

  const cardTypeOrder: CardType[] = ['debit', 'credit', 'prepaid', 'gift'];

  const cardTypeLabels: Record<CardType, string> = {
    debit: 'Debit cards',
    credit: 'Credit cards',
    prepaid: 'Prepaid cards',
    gift: 'Gift cards',
  };

  const canConfirm = Boolean(selectedBank?.id);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
      backdropComponent={() => null}
      onDismiss={handleDismiss}
      animationConfigs={{ duration: 260 }}
      backgroundComponent={({ style }) => (
        <BlurView
          intensity={Platform.OS === 'android' ? 40 : 90}
          tint="light"
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
          blurReductionFactor={Platform.OS === 'android' ? 4 : 4}
          style={[style, styles.blurBackground]}
        />
      )}
    >
      <BottomSheetScrollView
        contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <DrawerHeader amount={amount} onClose={() => sheetRef.current?.dismiss()} />

        <View style={styles.list}>
          {cardTypeOrder.map((type) => {
            const banksForType = groupedBanks[type];
            if (!banksForType || banksForType.length === 0) return null;

            const isExpanded = expandedTypes[type];

            return (
              <AccordionSection
                key={type}
                type={type}
                label={cardTypeLabels[type]}
                banks={banksForType}
                isExpanded={isExpanded}
                selectedBankId={selectedBank?.id}
                onToggle={() => toggleType(type)}
                onSelectBank={onSelectBank}
              />
            );
          })}
        </View>

        <DrawerFooter canConfirm={canConfirm} onAddNew={onAddNew} onConfirm={onConfirm} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  sheetBackground: {
    // backgroundColor: InstacardColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  blurBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    borderColor: colors.border,
    borderWidth: 1,
  },
  handleIndicator: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 16,
  },
  list: {
    gap: 8,
  },
  section: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 20,
    paddingLeft:24
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: AppFonts.medium,
    color: colors.textPrimary,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  sectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionCount: {
    fontSize: 12,
    fontFamily: AppFonts.medium,
    color: colors.textSecondary,
  },
  sectionBody: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 0,
  },
  measureContainer: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 10,
  },
});