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

/** Card form type */
export type CardForm = "universal" | "virtual";

export interface CardData {
  id: string;
  imageId: CardImageId;
  name: string;
  cardNumber: string;
  cardType: CardType;
  cardForm: CardForm;
  recentlyUsed: boolean;
}

// Plain array of card objects
export const mockCards: CardData[] = [
  {
    id: "card-1",
    imageId: 1,
    name: "FCMB Debit",
    cardNumber: "**** **** **** 1234",
    cardType: "debit",
    cardForm: "virtual",
    recentlyUsed: true,
  },
  {
    id: "card-2",
    imageId: 2,
    name: "GTB Credit",
    cardNumber: "**** **** **** 1235",
    cardType: "credit",
    cardForm: "virtual",
    recentlyUsed: true,
  },
  {
    id: "card-3",
    imageId: 3,
    name: "Access Debit",
    cardNumber: "**** **** **** 1236",
    cardType: "debit",
    cardForm: "virtual",
    recentlyUsed: true,
  },
  {
    id: "card-4",
    imageId: 4,
    name: "Prepaid Card",
    cardNumber: "**** **** **** 1237",
    cardType: "prepaid",
    cardForm: "universal",
    recentlyUsed: true,
  },
  {
    id: "card-5",
    imageId: 5,
    name: "Gift Card",
    cardNumber: "**** **** **** 1238",
    cardType: "gift",
    cardForm: "universal",
    recentlyUsed: true,
  },
  {
    id: "card-6",
    imageId: 1,
    name: "FCMB Magic",
    cardNumber: "**** **** **** 1239",
    cardType: "credit",
    cardForm: "universal",
    recentlyUsed: false,
  },
  {
    id: "card-7",
    imageId: 2,
    name: "GTB Debit",
    cardNumber: "**** **** **** 1240",
    cardType: "debit",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-8",
    imageId: 3,
    name: "Access Credit",
    cardNumber: "**** **** **** 1241",
    cardType: "credit",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-9",
    imageId: 4,
    name: "Travel Card",
    cardNumber: "**** **** **** 1242",
    cardType: "prepaid",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-10",
    imageId: 5,
    name: "Reward Card",
    cardNumber: "**** **** **** 1243",
    cardType: "gift",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-11",
    imageId: 1,
    name: "Student Card",
    cardNumber: "**** **** **** 1244",
    cardType: "prepaid",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-12",
    imageId: 2,
    name: "Shopping Card",
    cardNumber: "**** **** **** 1245",
    cardType: "gift",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-13",
    imageId: 3,
    name: "FCMB Debit",
    cardNumber: "**** **** **** 1246",
    cardType: "debit",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-14",
    imageId: 4,
    name: "GTB Credit",
    cardNumber: "**** **** **** 1247",
    cardType: "credit",
    cardForm: "virtual",
    recentlyUsed: false,
  },
  {
    id: "card-15",
    imageId: 5,
    name: "Access Debit",
    cardNumber: "**** **** **** 1248",
    cardType: "debit",
    cardForm: "universal",
    recentlyUsed: false,
  },
];
