import React from 'react';
import DebitCardIcon from '@/assets/svg/debit-card.svg';
import CreditCardIcon from '@/assets/svg/credit-card.svg';
import GiftCardIcon from '@/assets/svg/giftcard.svg';
import PrepaidCardIcon from '@/assets/svg/prepaid-card.svg';

export const DebitcardIcon = (
    width: number,
    height: number,
    color: string,
) => React.createElement(DebitCardIcon, { width, height, color });

export const CreditcardIcon = (
    width: number,
    height: number,
    color: string,
) => React.createElement(CreditCardIcon, { width, height, color });

export const GiftcardIcon = (
    width: number,
    height: number,
    color: string,
) => React.createElement(GiftCardIcon, { width, height, color });

export const PrepaidcardIcon = (
    width: number,
    height: number,
    color: string,
) => React.createElement(PrepaidCardIcon, { width, height, color });