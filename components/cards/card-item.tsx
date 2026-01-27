import { Image, StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';

import { CardData, CardImages } from '@/constants/cards';

interface CardItemProps {
  card: CardData;
  onPress?: (card: CardData) => void;
  style?: ViewStyle;
}

export function CardItem({ card, onPress, style }: CardItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress?.(card)}
      activeOpacity={1.0}
      accessibilityRole="button"
      accessibilityLabel={`${card.name} ${card.cardType} card ending in ${card.cardNumber.slice(-4)}`}
    >
      <View style={styles.cardWrapper}>
        <Image
          source={CardImages[card.imageId]}
          style={styles.cardImage}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  cardWrapper: {
    width: '100%',
    aspectRatio: 1.58,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
