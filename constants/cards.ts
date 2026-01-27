/**
 * Card data types and mock data for the cards screen.
 */

import { ImageSourcePropType } from 'react-native';

// Card image mapping
export const CardImages: Record<number, ImageSourcePropType> = {
  1: require('@/assets/images/cards/Instacard_1.png'),
  2: require('@/assets/images/cards/Instacard_2.png'),
  3: require('@/assets/images/cards/Instacard_3.png'),
  4: require('@/assets/images/cards/Instacard_4.png'),
  5: require('@/assets/images/cards/Instacard_5.png'),
};

export type CardImageId = 1 | 2 | 3 | 4 | 5;

export interface CardData {
  id: string;
  imageId: CardImageId;
  name: string;
  cardNumber: string;
  cardType: 'Credit' | 'Debit';
}

// Generate 15 mock cards cycling through 5 image variants
export const mockCards: CardData[] = Array.from({ length: 15 }, (_, index) => ({
  id: `card-${index + 1}`,
  imageId: ((index % 5) + 1) as CardImageId,
  name: index % 5 === 0 ? 'FCMB Magic' : 'FCMB Club',
  cardNumber: `**** **** **** ${1234 + index}`,
  cardType: 'Credit',
}));
