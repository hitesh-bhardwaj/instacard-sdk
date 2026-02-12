import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardData, CardImages } from '@/constants/cards';
import { ACTIONS, type ActionItem } from '@/constants/CARDS_ACTIONS';
import { InstacardColors } from '@/constants/colors';
import { hapticLight, hapticSelection } from '@/lib/haptics';
import { DEV_SDK_CONFIG } from '@/lib/instacard-sdk';
import FAQModal from '../Modals/FAQModal';
import { PWAWebViewModal } from '../pwa/pwa-webview-modal';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAWER_HEIGHT = Math.min(SCREEN_HEIGHT * 0.42);
const CARD_ASPECT = 1.58;
const CARD_THUMB_WIDTH = 100;
const CARD_THUMB_HEIGHT = CARD_THUMB_WIDTH / CARD_ASPECT;
const CARD_GAP = 10;
const ACTION_GAP = 10;

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
  const [faqModalVisible, setFaqModalVisible] = useState<boolean>(false);
  const [currentFaqData, setCurrentFaqData] = useState<ActionItem['faqData'] | undefined>(undefined);
  const [viewCardDetail, setViewCardDetail] = useState<boolean>(false);
  const [viewManageCard, setViewManageCard] = useState<boolean>(false);
  const [linkPhysicalVisible, setLinkPhysicalVisible] = useState<boolean>(false);
  const [viewAddGift, setViewAddGift] = useState<boolean>(false);

  const snapPoints = useMemo(() => [DRAWER_HEIGHT], []);

  const selectedCard = useMemo(() => {
    if (!cards.length) {
      return undefined;
    }
    return cards.find((card) => card.id === selectedCardId) ?? cards[0];
  }, [cards, selectedCardId]);

  const selectedCardType = useMemo(() => selectedCard?.cardType ?? 'debit', [selectedCard]);

  const routes = useMemo(() => {
    return {
      manage: `/manage-card/${selectedCardType}`,
      details: `/card-detail/${selectedCardType}`,
      // linkPhysical: `/link-physical-card-${selectedCardType}`,
      linkPhysical: `/link-physical-card`,
      addGift: `/add-a-gift-card`,
    };
  }, [selectedCardType]);

  const handleActionOpen = useCallback(
    (actionId: string) => {
      if (!selectedCard) return;

      onActionPress?.(actionId, selectedCard);

      // Only log + open for actions that have a PWA modal here.
      switch (actionId) {
        case 'manage': {
          console.log('[CardActionsDrawer] open route', routes.manage, {
            actionId,
            cardId: selectedCard.id,
            cardType: selectedCard.cardType,
          });
          setViewManageCard(true);
          return;
        }
        case 'card-details': {
          console.log('[CardActionsDrawer] open route', routes.details, {
            actionId,
            cardId: selectedCard.id,
            cardType: selectedCard.cardType,
          });
          setViewCardDetail(true);
          return;
        }
        case 'link-physical': {
          console.log('[CardActionsDrawer] open route', routes.linkPhysical, {
            actionId,
            cardId: selectedCard.id,
            cardType: selectedCard.cardType,
          });
          setLinkPhysicalVisible(true);
          return;
        }
        case 'add-gift': {
          console.log('[CardActionsDrawer] open route', routes.addGift, {
            actionId,
            cardId: selectedCard.id,
            cardType: selectedCard.cardType,
          });
          setViewAddGift(true);
          return;
        }
        default: {
          // Other actions exist in the UI but don't open a PWA modal yet.
          return;
        }
      }
    },
    [onActionPress, routes.addGift, routes.details, routes.linkPhysical, routes.manage, selectedCard]
  );

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

  const handleFaqPress = useCallback((action: ActionItem) => {
    setCurrentFaqData(action.faqData);
    setFaqModalVisible(true);
  }, []);

  return (
    <>
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
        backgroundComponent={({ style }) => (
          <BlurView
            intensity={90}
            tint="light"
            experimentalBlurMethod='dimezisBlurView'
            blurReductionFactor={6}
            style={[style, styles.blurBackground]}
          />
        )}
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
                    activeOpacity={0.7}
                    onPress={() => {
                      hapticSelection();
                      onSelectCard?.(card);
                    }}
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
            {ACTIONS.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    hapticLight();
                    handleActionOpen(action.id);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={action.title}
                >
                  <View style={styles.actionHeader}>
                    {IconComponent && (
                      <IconComponent
                        width={25}
                        height={25}
                        color={InstacardColors.primary}
                      />
                    )}
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        hapticLight();
                        handleFaqPress(action);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ backgroundColor: InstacardColors.primary, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
                    >
                     <Text style={{ color: InstacardColors.textOnPrimary, textAlign: 'center' }}>?</Text>
                    </TouchableOpacity>

                  </View>
                  <Text style={styles.actionText}>{action.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
      <FAQModal
        visible={faqModalVisible}
        onClose={() => setFaqModalVisible(false)}
        data={currentFaqData}
      />
      <PWAWebViewModal
        visible={viewCardDetail}
        config={{ ...DEV_SDK_CONFIG, cardType: selectedCard?.cardType }}
        route={routes.details}
        onClose={() => setViewCardDetail(false)}
      />
      <PWAWebViewModal
        visible={viewManageCard}
        config={{ ...DEV_SDK_CONFIG, cardType: selectedCard?.cardType }}
        route={routes.manage}
        onClose={() => setViewManageCard(false)}
      />
      <PWAWebViewModal
        visible={viewAddGift}
        config={{ ...DEV_SDK_CONFIG, cardType: selectedCard?.cardType }}
        route={routes.addGift}
        onClose={() => setViewAddGift(false)}
      />
      <PWAWebViewModal
        visible={linkPhysicalVisible}
        config={{ ...DEV_SDK_CONFIG, cardType: selectedCard?.cardType }}
        route={routes.linkPhysical}
        onClose={() => setLinkPhysicalVisible(false)}
      />
    </>

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
    paddingHorizontal: 0,
    paddingTop: 8,
    gap: 24,
  },
  carouselContainer: {
    paddingBottom: 12,
  },
  carouselContent: {
    paddingHorizontal: 4,
    gap: CARD_GAP,
  },
  cardThumb: {
    width: CARD_THUMB_WIDTH,
    height: CARD_THUMB_HEIGHT,
    borderRadius: 12,
    // backgroundColor: InstacardColors.cardBackground,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardThumbSelected: {
    shadowColor: InstacardColors.textPrimary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .5,
    elevation: 5,
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
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    rowGap: ACTION_GAP,
  },
  actionCard: {
    width: '48.7%',
    backgroundColor: InstacardColors.white,
    borderRadius: 16,
    padding: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 80,
    borderWidth: 1,
    borderColor: InstacardColors.border,
  },
  actionHeader: {
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    color: InstacardColors.textPrimary,
  },
});
