import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { CardData } from '@/constants/cards';

import { CardItem } from '../card-item';

// Mock the haptics module
jest.mock('expo-haptics');

describe('CardItem', () => {
  const mockCard: CardData = {
    id: 'card-1',
    imageId: 1,
    name: 'Test Card',
    cardNumber: '**** **** **** 1234',
    cardType: 'debit',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders card correctly', () => {
    const { getByRole } = render(<CardItem card={mockCard} />);

    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(<CardItem card={mockCard} />);

    const button = getByLabelText('Test Card debit card ending in 1234');
    expect(button).toBeTruthy();
  });

  it('calls onPress handler when pressed', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <CardItem card={mockCard} onPress={onPressMock} />
    );

    const button = getByRole('button');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
    expect(onPressMock).toHaveBeenCalledWith(mockCard);
  });

  it('triggers haptic feedback on press', () => {
    const { getByRole } = render(<CardItem card={mockCard} />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
  });

  it('works without onPress handler', () => {
    const { getByRole } = render(<CardItem card={mockCard} />);

    const button = getByRole('button');
    expect(() => fireEvent.press(button)).not.toThrow();
  });

  it('applies custom style', () => {
    const customStyle = { marginTop: 20 };
    const { getByRole } = render(
      <CardItem card={mockCard} style={customStyle} />
    );

    const button = getByRole('button');
    expect(button.props.style).toMatchObject(customStyle);
  });

  it('renders different card types correctly', () => {
    const cardTypes: Array<CardData['cardType']> = [
      'debit',
      'credit',
      'prepaid',
      'gift',
    ];

    cardTypes.forEach((cardType) => {
      const card = { ...mockCard, cardType };
      const { getByLabelText } = render(<CardItem card={card} />);

      const button = getByLabelText(
        `Test Card ${cardType} card ending in 1234`
      );
      expect(button).toBeTruthy();
    });
  });
});
