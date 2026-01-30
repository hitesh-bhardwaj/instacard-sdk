/**
 * Card data types and mock data for the cards screen.
 */

import { ImageSourcePropType } from "react-native";

// Card image mapping
export const CardImages: Record<number, ImageSourcePropType> = {
  1: require("@/assets/images/cards/Instacard_1.png"),
  2: require("@/assets/images/cards/Instacard_2.png"),
  3: require("@/assets/images/cards/Instacard_3.png"),
  4: require("@/assets/images/cards/Instacard_4.png"),
  5: require("@/assets/images/cards/Instacard_5.png"),
};

export type CardImageId = 1 | 2 | 3 | 4 | 5;

/** All supported card types */
export type CardType = "debit" | "credit" | "prepaid" | "gift";

export interface CardData {
  id: string;
  imageId: CardImageId;
  name: string;
  cardNumber: string;
  cardType: CardType;
}

/** Card type distribution for mock data */
const CARD_TYPES: CardType[] = ["debit", "credit", "prepaid", "gift"];
const CARD_NAMES: Record<CardType, string[]> = {
  debit: ["FCMB Debit", "GTB Debit", "Access Debit"],
  credit: ["FCMB Magic", "GTB Credit", "Access Credit"],
  prepaid: ["Prepaid Card", "Travel Card", "Student Card"],
  gift: ["Gift Card", "Reward Card", "Shopping Card"],
};

// Generate 15 mock cards with varied types
export const mockCards: CardData[] = Array.from({ length: 15 }, (_, index) => {
  const cardType = CARD_TYPES[index % CARD_TYPES.length];
  const nameOptions = CARD_NAMES[cardType];
  return {
    id: `card-${index + 1}`,
    imageId: ((index % 5) + 1) as CardImageId,
    name: nameOptions[index % nameOptions.length],
    cardNumber: `**** **** **** ${1234 + index}`,
    cardType,
  };
});
