import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BankRow } from '@/components/QRPayments/bank-drawer/bank-row';
import { DrawerFooter } from '@/components/QRPayments/bank-drawer/drawer-footer';
import { DrawerHeader } from '@/components/QRPayments/bank-drawer/drawer-header';
import { InstacardColors } from '@/constants/colors';
import type { BankItem as BankItemInternal } from '@/components/QRPayments/bank-drawer/types';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAWER_HEIGHT = Math.min(SCREEN_HEIGHT * 0.55, 520);

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
          intensity={90}
          tint="light"
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
          blurReductionFactor={Platform.OS === 'android' ? 6 : 4}
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
          {banks.map((bank) => {
            const isSelected = bank.id === selectedBank?.id;
            return (
              <BankRow
                key={bank.id}
                bank={bank}
                selected={isSelected}
                onSelect={onSelectBank}
              />
            );
          })}
        </View>

        <DrawerFooter canConfirm={canConfirm} onAddNew={onAddNew} onConfirm={onConfirm} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  blurBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    borderColor: InstacardColors.border,
    borderWidth: 1,
  },
  handleIndicator: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: InstacardColors.border,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 16,
    
  },
  list: {
    gap: 10,
  },
});