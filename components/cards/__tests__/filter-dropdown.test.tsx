import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { Modal } from 'react-native';

import { CardFilterType, FilterDropdown } from '../filter-dropdown';

jest.mock('expo-haptics');
jest.mock('@/assets/svg/filter.svg', () => 'FilterIcon');
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

describe('FilterDropdown', () => {
  const defaultProps = {
    visible: true,
    selectedFilters: ['all'] as CardFilterType[],
    onSelectionChange: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(<FilterDropdown {...defaultProps} />);

      expect(getByText('Filters')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <FilterDropdown {...defaultProps} visible={false} />
      );

      expect(queryByText('Filters')).toBeNull();
    });

    it('renders as Modal component', () => {
      const { UNSAFE_getByType } = render(<FilterDropdown {...defaultProps} />);

      expect(UNSAFE_getByType(Modal)).toBeTruthy();
    });
  });

  describe('Filter Options', () => {
    it('renders all filter options', () => {
      const { getByText } = render(<FilterDropdown {...defaultProps} />);

      expect(getByText('All Cards')).toBeTruthy();
      expect(getByText('Debit Card')).toBeTruthy();
      expect(getByText('Credit Card')).toBeTruthy();
      expect(getByText('Pre-Paid Card')).toBeTruthy();
      expect(getByText('Gift Card')).toBeTruthy();
    });

    it('marks "All Cards" as selected by default', () => {
      const { getByLabelText } = render(<FilterDropdown {...defaultProps} />);

      const allCardsOption = getByLabelText('All Cards');
      expect(allCardsOption.props.accessibilityState.checked).toBe(true);
    });

    it('marks selected filters as checked', () => {
      const { getByLabelText } = render(
        <FilterDropdown
          {...defaultProps}
          selectedFilters={['debit', 'credit']}
        />
      );

      const debitOption = getByLabelText('Debit Card');
      const creditOption = getByLabelText('Credit Card');
      const prepaidOption = getByLabelText('Pre-Paid Card');

      expect(debitOption.props.accessibilityState.checked).toBe(true);
      expect(creditOption.props.accessibilityState.checked).toBe(true);
      expect(prepaidOption.props.accessibilityState.checked).toBe(false);
    });

    it('has checkbox accessibility role for options', () => {
      const { getByLabelText } = render(<FilterDropdown {...defaultProps} />);

      const debitOption = getByLabelText('Debit Card');
      expect(debitOption.props.accessibilityRole).toBe('checkbox');
    });
  });

  describe('Filter Selection', () => {
    it('selects "All Cards" and clears other selections', () => {
      const onSelectionChange = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown
          {...defaultProps}
          selectedFilters={['debit', 'credit']}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.press(getByLabelText('All Cards'));

      expect(onSelectionChange).toHaveBeenCalledWith(['all']);
      expect(Haptics.selectionAsync).toHaveBeenCalled();
    });

    it('adds specific filter when selected', () => {
      const onSelectionChange = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown
          {...defaultProps}
          selectedFilters={['all']}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.press(getByLabelText('Debit Card'));

      expect(onSelectionChange).toHaveBeenCalledWith(['debit']);
    });

    it('removes filter when already selected', () => {
      const onSelectionChange = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown
          {...defaultProps}
          selectedFilters={['debit', 'credit']}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.press(getByLabelText('Debit Card'));

      expect(onSelectionChange).toHaveBeenCalledWith(['credit']);
    });

    it('defaults to "All Cards" when deselecting last filter', () => {
      const onSelectionChange = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown
          {...defaultProps}
          selectedFilters={['debit']}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.press(getByLabelText('Debit Card'));

      expect(onSelectionChange).toHaveBeenCalledWith(['all']);
    });

    it('allows multiple specific filters to be selected', () => {
      const onSelectionChange = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown
          {...defaultProps}
          selectedFilters={['debit']}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.press(getByLabelText('Credit Card'));

      expect(onSelectionChange).toHaveBeenCalledWith(['debit', 'credit']);
    });

    it('removes "all" when selecting specific filter', () => {
      const onSelectionChange = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown
          {...defaultProps}
          selectedFilters={['all']}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.press(getByLabelText('Debit Card'));

      expect(onSelectionChange).toHaveBeenCalledWith(['debit']);
      expect(onSelectionChange).not.toHaveBeenCalledWith(
        expect.arrayContaining(['all'])
      );
    });

    it('triggers haptic feedback on selection', () => {
      const { getByLabelText } = render(<FilterDropdown {...defaultProps} />);

      fireEvent.press(getByLabelText('Debit Card'));

      expect(Haptics.selectionAsync).toHaveBeenCalled();
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown {...defaultProps} onClose={onClose} />
      );

      fireEvent.press(getByLabelText('Close filters'));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).toHaveBeenCalled();
    });

    it('provides close button for dismissing dropdown', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <FilterDropdown {...defaultProps} onClose={onClose} />
      );

      const closeButton = getByLabelText('Close filters');
      fireEvent.press(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('has close button with correct accessibility', () => {
      const { getByLabelText } = render(<FilterDropdown {...defaultProps} />);

      const closeButton = getByLabelText('Close filters');
      expect(closeButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Header', () => {
    it('renders "Filters" header text', () => {
      const { getByText } = render(<FilterDropdown {...defaultProps} />);

      expect(getByText('Filters')).toBeTruthy();
    });

    it('renders filter icon in header', () => {
      const { UNSAFE_getByType } = render(<FilterDropdown {...defaultProps} />);

      expect(UNSAFE_getByType('FilterIcon')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty selectedFilters array', () => {
      const { getByLabelText } = render(
        <FilterDropdown {...defaultProps} selectedFilters={[]} />
      );

      // Should still render options
      expect(getByLabelText('All Cards')).toBeTruthy();
      expect(getByLabelText('Debit Card')).toBeTruthy();
    });

    it('handles all filters being selected', () => {
      const allFilters: CardFilterType[] = [
        'all',
        'debit',
        'credit',
        'prepaid',
        'gift',
      ];
      const { getByLabelText } = render(
        <FilterDropdown {...defaultProps} selectedFilters={allFilters} />
      );

      allFilters.forEach((filter) => {
        const filterLabels: Record<CardFilterType, string> = {
          all: 'All Cards',
          debit: 'Debit Card',
          credit: 'Credit Card',
          prepaid: 'Pre-Paid Card',
          gift: 'Gift Card',
        };
        const option = getByLabelText(filterLabels[filter]);
        expect(option.props.accessibilityState.checked).toBe(true);
      });
    });

    it('maintains selection when toggling visibility', () => {
      const { rerender, getByLabelText } = render(
        <FilterDropdown {...defaultProps} selectedFilters={['debit']} />
      );

      // Hide dropdown
      rerender(
        <FilterDropdown
          {...defaultProps}
          visible={false}
          selectedFilters={['debit']}
        />
      );

      // Show dropdown again
      rerender(
        <FilterDropdown
          {...defaultProps}
          visible={true}
          selectedFilters={['debit']}
        />
      );

      const debitOption = getByLabelText('Debit Card');
      expect(debitOption.props.accessibilityState.checked).toBe(true);
    });
  });
});
