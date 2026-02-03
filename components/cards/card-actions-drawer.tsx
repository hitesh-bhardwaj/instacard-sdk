import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CreditCardIcon from '@/assets/svg/manage-card.svg';
import DocTextIcon from '@/assets/svg/card-detail.svg';
import GlobeIcon from '@/assets/svg/phone.svg';
import GiftIcon from '@/assets/svg/gift-card.svg';
import HandTapIcon from '@/assets/svg/contactlesspayment.svg';
import LinkIcon from '@/assets/svg/sigma.svg';
import { CardData, CardImages } from '@/constants/cards';
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

interface FAQData {
  heading: string;
  bulletPoints: string[];
}

const ACTION_FAQ_DATA: Record<string, FAQData> = {
  'manage': {
    heading: 'Manage Card',
    bulletPoints: [
      'View and update your card settings and preferences.',
      'Set spending limits and transaction controls.', 
      'Enable or disable online and international transactions.',
      'Update your PIN or request a new card.',
      'View your card statement and transaction history.',
    ],
  },
  'card-details': {
    heading: 'Card Details View',
    bulletPoints: [
      'View your complete card information including card number, expiry date, and CVV.',
      'Copy card details securely for online transactions.',
      'Card details are protected and require authentication to view.',
      'You can view details for any of your linked virtual cards.',
    ],
  },
  'online-payment': {
    heading: 'Make Online Payment',
    bulletPoints: [
      'Use your virtual card for secure online purchases.',
      'Generate a one-time virtual card number for added security.',
      'Set transaction limits for online payments.',
      'Track all your online transactions in real-time.',
    ],
  },
  'add-gift': {
    heading: 'Add a Gift-card',
    bulletPoints: [
      'Add gift cards from various retailers to your wallet.',
      'Manage all your gift cards in one place.',
      'Check gift card balances and transaction history.',
      'Use gift cards for in-store and online purchases.',
    ],
  },
  'contactless-default': {
    heading: 'Make Default for Contactless Payments',
    bulletPoints: [
      'Set this card as your default for tap-to-pay transactions.',
      'Use your phone or smartwatch for contactless payments.',
      'Enjoy faster checkout at supported terminals.',
      'Change your default card anytime from settings.',
    ],
  },
  'link-physical': {
    heading: 'Link to a Physical Universal or Sigma Instacard',
    bulletPoints: [
      'You can purchase a Universal Card or a Sigma card from your Bank or any Agent, Marketplace or order online.',
      'Universal Card or Sigma Card offer unified card experience such that you can link any Virtual Instacard to them to start using the virtual Instacard on any POS/ATM through the linked Universal or Sigma Instacard.',
      'Sigma Card is a physical card variant of Instacard that is issued by a Bank/ FinTech to allow users to link any Virtual Instacard issued by them for making Domestic as well as International payments.',
      'Universal Card is another physical card variant of Instacard that users can link any virtual Instacard issued by any Bank/ FinTech in your country for making Domestic Payments through a single Physical Card.',
      'You can simply link any one Virtual Instacard to a Universal or Sigma Cards to start using the linked Virtual Instacard from the physical card. When you link a new Virtual Instacard to a Universal or Sigma card, previously linked Virtual Instacard is de-linked and you can start using the newly linked Virtual Card from the physical Universal / Sigma card.',
    ],
  },
};

const ACTION_ICONS: Record<string, React.FC<{ width: number; height: number; color: string }>> = {
  'manage': CreditCardIcon,
  'card-details': DocTextIcon,
  'online-payment': GlobeIcon,
  'add-gift': GiftIcon,
  'contactless-default': HandTapIcon,
  'link-physical': LinkIcon,
};

const ACTIONS = [
  { id: 'manage', title: 'Manage Card' },
  { id: 'card-details', title: 'Card Details View' },
  { id: 'online-payment', title: 'Make Online Payment' },
  { id: 'add-gift', title: 'Add a Gift-card' },
  { id: 'contactless-default', title: 'Make default for Contactless Payments' },
  {
    id: 'link-physical',
    title: 'Link to Physical Universal or Sigma Instacard',
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
  const [faqModalVisible, setFaqModalVisible] = useState<boolean>(false);
  const [currentFaqData, setCurrentFaqData] = useState<FAQData | undefined>(undefined);
  const [viewCardDetail, setViewCardDetail] = useState<boolean>(false);
  const [viewManageCard, setViewManageCard] = useState<boolean>(false);
  const [linkPhysicalVisible, setLinkPhysicalVisible] = useState<boolean>(false);

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

  const handleFaqPress = useCallback((actionId: string) => {
    setCurrentFaqData(ACTION_FAQ_DATA[actionId]);
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
              const IconComponent = ACTION_ICONS[action.id];
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    hapticLight();
                    if (selectedCard) {
                      onActionPress?.(action.id, selectedCard);
                    }
                    if (action.id === 'link-physical') {
                      setLinkPhysicalVisible(true);
                    }
                    if (action.id === 'card-details') {
                      setViewCardDetail(true);
                    }
                    if (action.id === 'manage') {
                      setViewManageCard(true);
                    }
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
                        handleFaqPress(action.id);
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
        config={DEV_SDK_CONFIG}
        route="/card-detail"
        onClose={() =>
          setViewCardDetail(false)
        }
      />
      <PWAWebViewModal
        visible={viewManageCard}
        config={DEV_SDK_CONFIG}
        route="/manage-card"
        onClose={() =>
          setViewManageCard(false)
        }
      />
      <PWAWebViewModal
        visible={linkPhysicalVisible}
        config={DEV_SDK_CONFIG}
        route="/link-physical-card"
        onClose={() =>
          setLinkPhysicalVisible(false)
        }
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
