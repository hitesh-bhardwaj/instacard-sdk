import { ImageSourcePropType } from 'react-native';
import cardsData from './cards.json';

export type CardImageUrl = 'debit' | 'credit' | 'prepaid' | 'gift';

// Card image mapping
export const CardImages: Record<CardImageUrl, ImageSourcePropType> = {
  debit: require('@/assets/images/cards/debit.png'),
  credit: require('@/assets/images/cards/credit.png'),
  prepaid: require('@/assets/images/cards/prepaid.png'),
  gift: require('@/assets/images/cards/gift.png'),
};

export type CardType = 'debit' | 'credit' | 'prepaid' | 'gift';

export type CardForm = 'universal' | 'virtual';

export interface CardData {
  id: string;
  imageUrl: CardImageUrl;
  name: string;
  cardNumber: string;
  cardType: CardType;
  cardForm: CardForm;
  recentlyUsed: boolean;
  mostUsed: boolean;
  issuedDate: string;
}

export const mockCards: CardData[] = cardsData as CardData[];
