import { fireEvent, render } from '@testing-library/react-native';

import { CardData } from '@/constants/cards';

import { CardList } from '../card-list';

describe('CardList', () => {
  const mockCards: CardData[] = [
    {
      id: 'card-1',
      imageId: 1,
      name: 'Test Card 1',
      cardNumber: '**** **** **** 1234',
      cardType: 'debit',
    },
    {
      id: 'card-2',
      imageId: 2,
      name: 'Test Card 2',
      cardNumber: '**** **** **** 5678',
      cardType: 'credit',
    },
    {
      id: 'card-3',
      imageId: 3,
      name: 'Test Card 3',
      cardNumber: '**** **** **** 9012',
      cardType: 'prepaid',
    },
  ];

  describe('Rendering', () => {
    it('renders all provided cards', () => {
      const { getByLabelText } = render(<CardList cards={mockCards} />);

      expect(getByLabelText('Test Card 1 debit card ending in 1234')).toBeTruthy();
      expect(getByLabelText('Test Card 2 credit card ending in 5678')).toBeTruthy();
      expect(getByLabelText('Test Card 3 prepaid card ending in 9012')).toBeTruthy();
    });

    it('renders empty list when no cards provided', () => {
      const { queryByLabelText } = render(<CardList cards={[]} />);

      // No cards should be rendered
      expect(queryByLabelText(/card ending in/)).toBeNull();
    });

    it('renders footer with instruction text', () => {
      const { getByText } = render(<CardList cards={mockCards} />);

      expect(getByText('Swipe up to see more cards')).toBeTruthy();
    });

    it('renders inside ScrollView', () => {
      const { UNSAFE_getByType } = render(<CardList cards={mockCards} />);

      const { ScrollView } = require('react-native');
      expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
    });

    it('hides vertical scroll indicator', () => {
      const { UNSAFE_getByType } = render(<CardList cards={mockCards} />);

      const { ScrollView } = require('react-native');
      const scrollView = UNSAFE_getByType(ScrollView);

      expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
  });

  describe('Card Interactions', () => {
    it('calls onCardPress when card is pressed', () => {
      const onCardPress = jest.fn();
      const { getByLabelText } = render(
        <CardList cards={mockCards} onCardPress={onCardPress} />
      );

      const card = getByLabelText('Test Card 1 debit card ending in 1234');
      fireEvent.press(card);

      expect(onCardPress).toHaveBeenCalledTimes(1);
      expect(onCardPress).toHaveBeenCalledWith(mockCards[0]);
    });

    it('calls onCardPress with correct card data', () => {
      const onCardPress = jest.fn();
      const { getByLabelText } = render(
        <CardList cards={mockCards} onCardPress={onCardPress} />
      );

      const secondCard = getByLabelText('Test Card 2 credit card ending in 5678');
      fireEvent.press(secondCard);

      expect(onCardPress).toHaveBeenCalledWith(mockCards[1]);
    });

    it('handles multiple card presses', () => {
      const onCardPress = jest.fn();
      const { getByLabelText } = render(
        <CardList cards={mockCards} onCardPress={onCardPress} />
      );

      fireEvent.press(getByLabelText('Test Card 1 debit card ending in 1234'));
      fireEvent.press(getByLabelText('Test Card 2 credit card ending in 5678'));
      fireEvent.press(getByLabelText('Test Card 3 prepaid card ending in 9012'));

      expect(onCardPress).toHaveBeenCalledTimes(3);
    });

    it('works without onCardPress handler', () => {
      const { getByLabelText } = render(<CardList cards={mockCards} />);

      const card = getByLabelText('Test Card 1 debit card ending in 1234');
      expect(() => fireEvent.press(card)).not.toThrow();
    });
  });

  describe('Single Card', () => {
    it('renders single card correctly', () => {
      const singleCard = [mockCards[0]];
      const { getByLabelText } = render(<CardList cards={singleCard} />);

      expect(getByLabelText('Test Card 1 debit card ending in 1234')).toBeTruthy();
    });
  });

  describe('Large Card List', () => {
    it('renders many cards efficiently', () => {
      const manyCards: CardData[] = Array.from({ length: 20 }, (_, i) => ({
        id: `card-${i}`,
        imageId: ((i % 5) + 1) as any,
        name: `Card ${i}`,
        cardNumber: `**** **** **** ${1000 + i}`,
        cardType: 'debit' as const,
      }));

      const { getByLabelText } = render(<CardList cards={manyCards} />);

      // Check first and last card are rendered
      expect(getByLabelText('Card 0 debit card ending in 1000')).toBeTruthy();
      expect(getByLabelText('Card 19 debit card ending in 1019')).toBeTruthy();
    });
  });

  describe('Card Order', () => {
    it('maintains card order as provided', () => {
      const { getAllByRole } = render(<CardList cards={mockCards} />);

      const buttons = getAllByRole('button');

      // First three buttons should be our cards (in order)
      expect(buttons[0].props.accessibilityLabel).toContain('Test Card 1');
      expect(buttons[1].props.accessibilityLabel).toContain('Test Card 2');
      expect(buttons[2].props.accessibilityLabel).toContain('Test Card 3');
    });
  });

  describe('Card Types', () => {
    it('renders different card types correctly', () => {
      const diverseCards: CardData[] = [
        { ...mockCards[0], cardType: 'debit' },
        { ...mockCards[1], cardType: 'credit' },
        { ...mockCards[2], cardType: 'prepaid' },
        {
          id: 'card-4',
          imageId: 4,
          name: 'Gift Card',
          cardNumber: '**** **** **** 1111',
          cardType: 'gift',
        },
      ];

      const { getByLabelText } = render(<CardList cards={diverseCards} />);

      expect(getByLabelText(/debit card/)).toBeTruthy();
      expect(getByLabelText(/credit card/)).toBeTruthy();
      expect(getByLabelText(/prepaid card/)).toBeTruthy();
      expect(getByLabelText(/gift card/)).toBeTruthy();
    });
  });

  describe('Updates and Re-renders', () => {
    it('updates when cards prop changes', () => {
      const { rerender, getByLabelText, queryByLabelText } = render(
        <CardList cards={[mockCards[0]]} />
      );

      expect(getByLabelText('Test Card 1 debit card ending in 1234')).toBeTruthy();

      // Update to different cards
      rerender(<CardList cards={[mockCards[1]]} />);

      expect(queryByLabelText('Test Card 1 debit card ending in 1234')).toBeNull();
      expect(getByLabelText('Test Card 2 credit card ending in 5678')).toBeTruthy();
    });

    it('updates when cards are added', () => {
      const { rerender, getByLabelText } = render(
        <CardList cards={[mockCards[0]]} />
      );

      // Add more cards
      rerender(<CardList cards={mockCards} />);

      expect(getByLabelText('Test Card 1 debit card ending in 1234')).toBeTruthy();
      expect(getByLabelText('Test Card 2 credit card ending in 5678')).toBeTruthy();
      expect(getByLabelText('Test Card 3 prepaid card ending in 9012')).toBeTruthy();
    });

    it('updates when cards are removed', () => {
      const { rerender, queryByLabelText } = render(
        <CardList cards={mockCards} />
      );

      // Remove cards
      rerender(<CardList cards={[mockCards[0]]} />);

      expect(queryByLabelText('Test Card 2 credit card ending in 5678')).toBeNull();
      expect(queryByLabelText('Test Card 3 prepaid card ending in 9012')).toBeNull();
    });
  });

  describe('Footer', () => {
    it('always renders footer regardless of card count', () => {
      const { getByText: getByTextEmpty } = render(<CardList cards={[]} />);
      expect(getByTextEmpty('Swipe up to see more cards')).toBeTruthy();

      const { getByText: getByTextMany } = render(<CardList cards={mockCards} />);
      expect(getByTextMany('Swipe up to see more cards')).toBeTruthy();
    });
  });
});
