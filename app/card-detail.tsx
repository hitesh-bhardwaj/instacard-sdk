import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CardData, CardImages, mockCards } from '@/constants/cards';
import { InstacardColors } from '@/constants/colors';

const ACTIONS = [
  { id: 'manage', title: 'Manage Card', icon: 'creditcard' },
  { id: 'online-payment', title: 'Make Online Payment', icon: 'globe' },
  {
    id: 'contactless-default',
    title: 'Make default for Contactless Payments',
    icon: 'hand.tap',
  },
  {
    id: 'link-physical',
    title: 'Link to a Physical Universal or Sigma Instacard',
    icon: 'link',
  },
] as const;

export default function CardDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cardId } = useLocalSearchParams<{ cardId: string }>();

  const card = useMemo(() => {
    return mockCards.find((c) => c.id === cardId) ?? mockCards[0];
  }, [cardId]);

  const handleActionPress = (actionId: string, selectedCard: CardData) => {
    // TODO: Handle card actions
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <IconSymbol name="xmark" size={24} color={InstacardColors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Image with shared element tag */}
        <Animated.View
          style={styles.cardContainer}
          sharedTransitionTag={`card-${card.id}`}
        >
          <Image
            source={CardImages[card.imageId]}
            style={styles.cardImage}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </Animated.View>

        {/* Card Info */}
        <Animated.View
          entering={FadeIn.delay(150).duration(300)}
          style={styles.cardInfo}
        >
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardNumber}>{card.cardNumber}</Text>
          <View style={styles.cardTypeBadge}>
            <Text style={styles.cardTypeText}>{card.cardType}</Text>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View
          entering={FadeIn.delay(250).duration(300)}
          style={styles.actionsSection}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {ACTIONS.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeIn.delay(300 + index * 50).duration(250)}
              >
                <TouchableOpacity
                  style={styles.actionCard}
                  activeOpacity={0.8}
                  onPress={() => handleActionPress(action.id, card)}
                  accessibilityRole="button"
                  accessibilityLabel={action.title}
                >
                  <View style={styles.actionHeader}>
                    <IconSymbol
                      name={action.icon}
                      size={24}
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
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: InstacardColors.textOnPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: InstacardColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 1.58,
    marginBottom: 24,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cardInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cardName: {
    fontSize: 24,
    fontWeight: '700',
    color: InstacardColors.textPrimary,
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 16,
    color: InstacardColors.textSecondary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  cardTypeBadge: {
    backgroundColor: InstacardColors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cardTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: InstacardColors.textOnPrimary,
  },
  actionsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: InstacardColors.textPrimary,
    marginBottom: 8,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: InstacardColors.white,
    borderRadius: 16,
    padding: 16,
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
    fontSize: 15,
    color: InstacardColors.textPrimary,
    lineHeight: 20,
  },
});
