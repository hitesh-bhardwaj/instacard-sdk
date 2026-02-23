import type { CardType } from '@/lib/instacard-sdk';

export type BankItem = {
  id: string;
  name: string;
  subtitle?: string;
  balance?: string; // e.g. '₹12,450.10'
  cardType: CardType;
};
