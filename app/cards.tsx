import { CardActionsDrawer } from '@/components/cards/card-actions-drawer';
import { CardStack, CardStackRef } from '@/components/cards/card-stack';
import { CardsHeader } from '@/components/cards/cards-header';
import { CardFilterType, FilterBar } from '@/components/cards/filter-bar';
import { FloatingBottomBar } from '@/components/cards/floating-bottom-bar';
import { GreetingBar } from '@/components/cards/greeting-bar';
import { SwipeIndicator } from '@/components/cards/swipe-indicator';
import { ProfileContent } from '@/components/Profile-Drawer/profile-content';
import { ProfileDrawer } from '@/components/Profile-Drawer/profile-drawer';
import { PWAWebViewModal } from '@/components/pwa/pwa-webview-modal';
import { CardData, mockCards } from '@/constants/cards';
import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { useThemeStore } from '@/hooks/use-theme-store';
import { DEV_SDK_CONFIG, SDKResult } from '@/lib/instacard-sdk';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

export default function CardsScreen() {
  const [cardFilters, setCardFilters] = useState<CardFilterType[]>(['all']);
  const [recentFilterActive, setRecentFilterActive] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [pwaVisible, setPwaVisible] = useState(false);
  const [viewAddGift, setViewAddGift] = useState(false);
  const [cardMode, setCardMode] = useState<'virtual' | 'universal'>('virtual');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const cardStackRef = useRef<CardStackRef>(null);

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
      // An error occurred during card addition
      Alert.alert('Error', result.error.message, [{ text: 'OK' }]);
    }
    // If cancelled, just close silently
  }, []);

  /**
   * Handles card press to open the card actions drawer
   */
  const handleCardPress = (card: CardData) => {
    setSelectedCardId(card.id);
    setDrawerVisible(true);
  };

  /**
   * Handles switching between virtual and universal card modes.
   * Resets selection state when mode changes.
   */
  const handleModeChange = useCallback((mode: 'virtual' | 'universal') => {
    setCardMode(mode);
    setSelectedCardId(null);
    setCurrentCardIndex(0);
  }, []);

  // ============================================
  // Computed Values
  // ============================================

  /**
   * Filters cards based on:
   * 1. Card form (virtual/universal)
   * 2. Recently used filter
   * 3. Card type filters (debit, credit, prepaid, gift)
   */
  const filteredCards = useMemo(() => {
    // First filter by card form (virtual/universal)
    let cards = mockCards.filter((card) => card.cardForm === cardMode);

    // Filter by recently used when sort/recent tab is active
    if (recentFilterActive) {
      cards = [...cards].sort(
        (a, b) =>
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      );
    }

    // Then filter by card type filters
    // If 'all' is selected or no filters, show all cards of the selected form
    if (cardFilters.includes('all') || cardFilters.length === 0) {
      return cards;
    }

    // Filter cards by selected types
    return cards.filter((card) =>
      cardFilters.includes(card.cardType as CardFilterType)
    );
  }, [cardFilters, cardMode, recentFilterActive]);

  /**
   * Handles card filter changes and resets selection state
   * to avoid stale references to cards that may no longer be visible
   */
  const handleCardFiltersChange = useCallback((filters: CardFilterType[]) => {
    setCardFilters(filters);
    // Reset selection to avoid stale state
    setSelectedCardId(null);
    setCurrentCardIndex(0);
  }, []);

  // Get the currently selected card for PWA modals
  const selectedCard = useMemo(() => {
    if (!filteredCards.length) return undefined;
    return filteredCards.find((card) => card.id === selectedCardId) ?? filteredCards[0];
  }, [filteredCards, selectedCardId]);

  // ============================================
  // Render
  // ============================================
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <View style={styles.container}>
        {/* Status bar with light text for dark header background */}
        <StatusBar style="light" />

        {/* Header with dynamic subtitle based on drawer state */}
        <CardsHeader
          subtitle={drawerVisible ? 'Manage Card' : 'Digital Instacard Wallet'}
          showHomeIcon={false}
        />

        <View style={styles.content}>
          {/* Card stack positioned behind the UI elements (z-index: 0) */}
          <View style={styles.cardStackContainer}>
            {filteredCards.length > 0 ? (
              <CardStack
                ref={cardStackRef}
                cards={filteredCards}
                onCardPress={handleCardPress}
                onCardChange={(index) => {
                  setCurrentCardIndex(index);
                }}
                isDrawerOpen={drawerVisible}
                selectedCardId={selectedCardId}
              />
            ) : (
              // Empty state when no cards match the current filters
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No card available</Text>
              </View>
            )}
          </View>

          {/* UI overlay on top of cards with gradient + blur effect */}
          <View style={styles.overlay}>
            {/* Blur effect for the overlay background */}
            <BlurView
              intensity={isDarkMode ? 10 : 90}
              tint={isDarkMode ? 'light' : 'light'}
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
              blurReductionFactor={Platform.OS === 'android' ? 6 : 4}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Greeting bar with user info and action buttons */}
            <GreetingBar
              userName="Nirdesh Malik"
              isDarkMode={isDarkMode}
              onSearchPress={() => {
                router.push('/search');
              }}
              onHelpPress={() => {
                router.push('/help-and-support');
              }}
              onAvatarPress={() => {
                setProfileDrawerVisible(true);
              }}
            />

            {/* Filter bar for card mode and type filtering */}
            <FilterBar
              isDarkMode={isDarkMode}
              mode={cardMode}
              onModeChange={handleModeChange}
              cardFilters={cardFilters}
              onCardFiltersChange={handleCardFiltersChange}
              recentFilterActive={recentFilterActive}
              onRecentFilterPress={() => {
                setRecentFilterActive((prev) => !prev);
                setSelectedCardId(null);
                setCurrentCardIndex(0);
              }}
            />
          </View>

          {/* Swipe indicator showing current card position */}
          {filteredCards.length > 0 && (
            <SwipeIndicator
              currentIndex={currentCardIndex}
              totalCount={filteredCards.length}
              onPreviousPress={() => cardStackRef.current?.goToPrevious()}
              onNextPress={() => cardStackRef.current?.goToNext()}
            />
          )}
        </View>

        {/* Floating bottom navigation bar */}
        <FloatingBottomBar
          onHomePress={() => {
            // TODO: Navigate to home
          }}
          onScanPress={() => {
            router.push('/QRPayments/scan');
          }}
          onAddPress={handleAddNewPress}
          onAddGiftPress={() => setViewAddGift(true)}

        />

        {/* Card actions drawer for managing selected card */}
        <CardActionsDrawer
          visible={drawerVisible}
          cards={filteredCards}
          selectedCardId={selectedCardId ?? filteredCards[0]?.id}
          onClose={() => setDrawerVisible(false)}
          onSelectCard={(card) => setSelectedCardId(card.id)}
        />


        {/* PWA WebView modal for adding new cards via SDK */}
        <PWAWebViewModal
          visible={pwaVisible}
          config={DEV_SDK_CONFIG}
          route="/"
          onClose={handlePWAClose}
        />

        <PWAWebViewModal
          visible={viewAddGift}
          config={DEV_SDK_CONFIG}
          route="/add-a-gift-card"
          onClose={() => setViewAddGift(false)}
        />
      </View>

      {/* Profile drawer with user settings and options */}
      <ProfileDrawer
        visible={profileDrawerVisible}
        onClose={() => setProfileDrawerVisible(false)}
      >
        <ProfileContent
          userName="Nirdesh Malik"
          onClose={() => setProfileDrawerVisible(false)}
        />
      </ProfileDrawer>
    </>
  );
}

// ============================================
// Styles
// ============================================

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  // Main container with primary background color
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  // Content area with white background and rounded top corners
  content: {
    flex: 1,
    marginTop: -16, // Overlap with header for seamless transition
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  // Card stack container positioned absolutely behind other elements
  cardStackContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  // Overlay container for greeting bar and filters
  overlay: {
    zIndex: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  // Empty state container when no cards are available
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Empty state text styling
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
