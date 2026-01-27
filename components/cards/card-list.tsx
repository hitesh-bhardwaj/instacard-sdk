import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CardItem } from './card-item';
import { CardData } from '@/constants/cards';
import { InstacardColors } from '@/constants/colors';

interface CardListProps {
  cards: CardData[];
  onCardPress?: (card: CardData) => void;
}

export function CardList({ cards, onCardPress }: CardListProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onPress={onCardPress} style={styles.cardItem} />
      ))}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Swipe up to see more cards</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  cardItem: {
    marginBottom: 0,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: InstacardColors.textMuted,
  },
});
