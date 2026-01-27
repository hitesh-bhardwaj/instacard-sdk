import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CardData, CardImages } from '@/constants/cards';
import { InstacardColors } from '@/constants/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAWER_HEIGHT = Math.min(560, SCREEN_HEIGHT * 0.5);
const CARD_ASPECT = 1.58;
const CARD_THUMB_WIDTH = 100;
const CARD_THUMB_HEIGHT = CARD_THUMB_WIDTH / CARD_ASPECT;
const CARD_GAP = 10;
const ACTION_GAP = 10;

const ACTIONS = [
  { id: 'manage', title: 'Manage Card', icon: 'creditcard' },
  { id: 'card-details', title: 'Card Details View', icon: 'doc.text' },
  { id: 'online-payment', title: 'Make Online Payment', icon: 'globe' },
  { id: 'add-gift', title: 'Add a Gift-card', icon: 'gift' },
  { id: 'contactless-default', title: 'Make default for Contactless Payments', icon: 'hand.tap' },
  {
    id: 'link-physical',
    title: 'Link to Physical Universal or Sigma Instacard',
    icon: 'link',
  },
] as const;

interface CardActionsDrawerProps {
  visible: boolean;
  cards: CardData[];
  selectedCardId?: string | null;
  onClose: () => void;
  onSelectCard?: (card: CardData) => void;
  onActionPress?: (actionId: string, card: CardData) => void;
}

export function CardActionsDrawer({
  visible,
  cards,
  selectedCardId,
  onClose,
  onSelectCard,
  onActionPress,
}: CardActionsDrawerProps) {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => [DRAWER_HEIGHT], []);

  const selectedCard = useMemo(() => {
    if (!cards.length) {
      return undefined;
    }
    return cards.find((card) => card.id === selectedCardId) ?? cards[0];
  }, [cards, selectedCardId]);

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

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
      backdropComponent={null}
      onDismiss={handleDismiss}
    >
      <BottomSheetScrollView
        contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {cards.map((card) => {
              const isSelected = card.id === selectedCard?.id;
              return (
                <TouchableOpacity
                  key={card.id}
                  style={[styles.cardThumb, isSelected && styles.cardThumbSelected]}
                  activeOpacity={0.9}
                  onPress={() => onSelectCard?.(card)}
                  accessibilityRole="button"
                  accessibilityLabel={`${card.name} card ending in ${card.cardNumber.slice(-4)}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Image
                    source={CardImages[card.imageId]}
                    style={styles.cardThumbImage}
                    resizeMode="contain"
                    accessibilityIgnoresInvertColors
                  />
                  {isSelected ? <View style={styles.selectedDot} /> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.actionsGrid}>
          {ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              activeOpacity={0.9}
              onPress={() => {
                if (selectedCard) {
                  onActionPress?.(action.id, selectedCard);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={action.title}
            >
              <View style={styles.actionHeader}>
                <IconSymbol
                  name={action.icon}
                  size={22}
                  color={InstacardColors.primary}
                />
                <IconSymbol
                  name="questionmark.circle"
                  size={18}
                  color={InstacardColors.tabInactive}
                />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: InstacardColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handleIndicator: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: InstacardColors.border,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 24,
  },
  carouselContainer: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: InstacardColors.border,
  },
  carouselContent: {
    paddingHorizontal: 4,
    gap: CARD_GAP,
  },
  cardThumb: {
    width: CARD_THUMB_WIDTH,
    height: CARD_THUMB_HEIGHT,
    borderRadius: 12,
    backgroundColor: InstacardColors.cardBackground,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardThumbSelected: {
    borderWidth: 2,
    borderColor: InstacardColors.primary,
  },
  cardThumbImage: {
    width: '100%',
    height: '100%',
  },
  selectedDot: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: InstacardColors.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: ACTION_GAP,
  },
  actionCard: {
    width: '48.5%',
    backgroundColor: InstacardColors.white,
    borderRadius: 16,
    padding: 12,
    minHeight: 96,
    borderWidth: 1,
    borderColor: InstacardColors.border,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    color: InstacardColors.textPrimary,
  },
});
