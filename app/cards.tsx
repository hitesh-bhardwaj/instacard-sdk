import { CardActionsDrawer } from '@/components/cards/card-actions-drawer';
import { CardStack } from '@/components/cards/card-stack';
import { CardsHeader } from '@/components/cards/cards-header';
import { CardFilterType, FilterBar } from '@/components/cards/filter-bar';
import { FloatingBottomBar } from '@/components/cards/floating-bottom-bar';
import { GreetingBar } from '@/components/cards/greeting-bar';
import { PWAWebViewModal } from '@/components/pwa/pwa-webview-modal';
import { CardData, mockCards } from '@/constants/cards';
import { InstacardColors } from '@/constants/colors';
import { DEV_SDK_CONFIG, SDKResult } from '@/lib/instacard-sdk';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

export default function CardsScreen() {
  const [cardFilters, setCardFilters] = useState<CardFilterType[]>(['all']);
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

  // Filter cards based on selected filters and card mode (virtual/universal)
  const filteredCards = useMemo(() => {
    // First filter by card form (virtual/universal)
    let cards = mockCards.filter((card) => card.cardForm === cardMode);

    // Then filter by card type filters
    // If 'all' is selected or no filters, show all cards of the selected form
    if (cardFilters.includes('all') || cardFilters.length === 0) {
      return cards;
    }

    // Filter cards by selected types
    return cards.filter((card) =>
      cardFilters.includes(card.cardType as CardFilterType)
    );
  }, [cardFilters, cardMode]);

  // Reset selected card if it's no longer in filtered results
  const handleCardFiltersChange = useCallback((filters: CardFilterType[]) => {
    setCardFilters(filters);
    // Reset selection to avoid stale state
    setSelectedCardId(null);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <CardsHeader
        subtitle={drawerVisible ? 'Manage Card' : 'Digital Instacard Wallet'}
     
      />

      <View style={styles.content}>
        {/* Card stack positioned behind the UI elements */}

        <View style={styles.cardStackContainer}>
          <CardStack
            cards={filteredCards}
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
            tint="light"
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
            blurReductionFactor={Platform.OS === 'android' ? 6 : 4}
            style={StyleSheet.absoluteFillObject}

          />
          <GreetingBar
            userName="Nirdesh Malik"
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
          <FilterBar
            mode={cardMode}
            onModeChange={setCardMode}
            cardFilters={cardFilters}
            onCardFiltersChange={handleCardFiltersChange}
          />

        </View>

        <Text style={styles.stackHint}>
          <Text style={{ fontWeight: '700' }}>Tap</Text> to view details & <Text style={{ fontWeight: '700' }}>Swipe </Text>left to see next cards
        </Text>
      </View>

      <FloatingBottomBar
        onHomePress={() => {
          // TODO: Navigate to home
        }}
        onScanPress={() => {
          router.push('/scan');
        }}
        onAddPress={handleAddNewPress}
      />

      <CardActionsDrawer
        visible={drawerVisible}
        cards={filteredCards}
        selectedCardId={selectedCardId ?? filteredCards[0]?.id}
        onClose={() => setDrawerVisible(false)}
        onSelectCard={(card) => setSelectedCardId(card.id)}
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
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  stackHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 510,
    // bottom: 170,
    textAlign: 'center',
    fontSize: 13,
    color: InstacardColors.textSecondary,
  },
});
