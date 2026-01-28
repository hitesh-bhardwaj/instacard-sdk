import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { CardActionsDrawer } from '@/components/cards/card-actions-drawer';
import { CardStack } from '@/components/cards/card-stack';
import { CardsHeader } from '@/components/cards/cards-header';
import { FilterBar, FilterTab } from '@/components/cards/filter-bar';
import { FloatingBottomBar } from '@/components/cards/floating-bottom-bar';
import { GreetingBar } from '@/components/cards/greeting-bar';
import { PWAWebViewModal } from '@/components/pwa/pwa-webview-modal';
import { CardData, mockCards } from '@/constants/cards';
import { InstacardColors } from '@/constants/colors';
import { DEV_SDK_CONFIG, SDKResult } from '@/lib/instacard-sdk';

export default function CardsScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [pwaVisible, setPwaVisible] = useState(false);
  const [cardMode, setCardMode] = useState<'virtual' | 'universal'>('virtual');

  const handleAddNewPress = () => {
    setPwaVisible(true);
  };

  const handlePWAClose = useCallback((result: SDKResult) => {
    setPwaVisible(false);

    if (result.success && result.data) {
      Alert.alert(
        'Card Added!',
        `Your new ${result.data.cardType} card ending in ${result.data.lastFourDigits} has been added.`,
        [{ text: 'OK' }]
      );
    } else if (result.error) {
      Alert.alert('Error', result.error.message, [{ text: 'OK' }]);
    }
    // If cancelled, just close silently
  }, []);

  const handleCardPress = (card: CardData) => {
    setSelectedCardId(card.id);
    setDrawerVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <CardsHeader
        subtitle={drawerVisible ? 'Manage Card' : 'Digital Instacard Wallet'}
        onSearchPress={() => {
          // TODO: Implement search functionality
        }}
        onHelpPress={() => {
          // TODO: Implement help/support screen
        }}
        onAvatarPress={() => {
          // TODO: Navigate to profile screen
        }}
      />

      <View style={styles.content}>
        {/* Card stack positioned behind the UI elements */}
        <View style={styles.cardStackContainer}>
          <CardStack
            cards={mockCards}
            onCardPress={handleCardPress}
            onCardChange={() => {
              // Card index changed - can be used for analytics or UI updates
            }}
            isDrawerOpen={drawerVisible}
            selectedCardId={selectedCardId}
          />
        </View>

        {/* UI overlay on top of cards with gradient + blur */}
        <View style={styles.overlay}>
          <BlurView
            intensity={90}
            tint="default"
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
            blurReductionFactor={Platform.OS === 'android' ? 6 : 4}
            style={StyleSheet.absoluteFillObject}
          />
          <GreetingBar
            userName="Nirdesh Malik"
            mode={cardMode}
            onModeChange={setCardMode}
          />
          <FilterBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>

        <Text style={styles.stackHint}>
          Tap to view details & Swipe left to see next cards
        </Text>
      </View>

      <FloatingBottomBar
        onHomePress={() => {
          // TODO: Navigate to home
        }}
        onScanPress={() => {
          // TODO: Trigger scan action
        }}
        onAddPress={handleAddNewPress}
      />

      <CardActionsDrawer
        visible={drawerVisible}
        cards={mockCards}
        selectedCardId={selectedCardId ?? mockCards[0]?.id}
        onClose={() => setDrawerVisible(false)}
        onSelectCard={(card) => setSelectedCardId(card.id)}
        onActionPress={() => {
          // TODO: Handle card action (manage, payment, etc.)
        }}
      />

      <PWAWebViewModal
        visible={pwaVisible}
        config={DEV_SDK_CONFIG}
        route="/"
        onClose={handlePWAClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.primary,
  },
  content: {
    flex: 1,
    marginTop: -16,
    backgroundColor: InstacardColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  cardStackContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  overlay: {
    zIndex: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  stackHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 480,
    // bottom: 170,
    textAlign: 'center',
    fontSize: 13,
    color: InstacardColors.textMuted,
  },
});
