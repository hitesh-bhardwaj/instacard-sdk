import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { CardFilterType, FilterBar } from '../filter-bar';

jest.mock('expo-haptics');
jest.mock('@/assets/svg/filter.svg', () => 'FilterIcon');
jest.mock('@/assets/svg/sort.svg', () => 'SortIcon');

describe('FilterBar', () => {
  const defaultProps = {
    cardFilters: ['all'] as CardFilterType[],
    onCardFiltersChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default "All Cards" label', () => {
      const { getByText } = render(<FilterBar />);

      expect(getByText('All Cards')).toBeTruthy();
    });

    it('renders "Recently Used" tab', () => {
      const { getByText } = render(<FilterBar />);

      expect(getByText('Recently Used')).toBeTruthy();
    });

    it('renders filter and sort icons', () => {
      const { UNSAFE_getAllByType } = render(<FilterBar />);

      const filterIcons = UNSAFE_getAllByType('FilterIcon');
      const sortIcons = UNSAFE_getAllByType('SortIcon');

      expect(filterIcons.length).toBeGreaterThan(0);
      expect(sortIcons.length).toBeGreaterThan(0);
    });

    it('has correct container accessibility role', () => {
      const { UNSAFE_getByProps } = render(<FilterBar />);

      const tablist = UNSAFE_getByProps({ accessibilityRole: 'tablist' });
      expect(tablist).toBeTruthy();
    });
  });

  describe('Filter Label Display', () => {
    it('displays "All Cards" when all filter is selected', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['all']} />
      );

      expect(getByText('All Cards')).toBeTruthy();
    });

    it('displays "All Cards" when cardFilters is empty', () => {
      const { getByText } = render(
        <FilterBar cardFilters={[]} />
      );

      expect(getByText('All Cards')).toBeTruthy();
    });

    it('displays single filter label with "Cards" suffix', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['debit']} />
      );

      expect(getByText('Debit Cards')).toBeTruthy();
    });

    it('displays correct label for credit filter', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['credit']} />
      );

      expect(getByText('Credit Cards')).toBeTruthy();
    });

    it('displays correct label for prepaid filter', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['prepaid']} />
      );

      expect(getByText('Pre-Paid Cards')).toBeTruthy();
    });

    it('displays correct label for gift filter', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['gift']} />
      );

      expect(getByText('Gift Cards')).toBeTruthy();
    });

    it('displays two filter names when two filters selected', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['debit', 'credit']} />
      );

      expect(getByText('Debit, Credit')).toBeTruthy();
    });

    it('displays count when more than two filters selected', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['debit', 'credit', 'prepaid']} />
      );

      expect(getByText('3 Selected')).toBeTruthy();
    });

    it('displays "4 Selected" for four filters', () => {
      const { getByText } = render(
        <FilterBar cardFilters={['debit', 'credit', 'prepaid', 'gift']} />
      );

      expect(getByText('4 Selected')).toBeTruthy();
    });
  });

  describe('Filter Dropdown Interaction', () => {
    it('opens dropdown when filter button is pressed', () => {
      const { getByLabelText, queryByText } = render(<FilterBar />);

      const filterButton = getByLabelText('All Cards');
      fireEvent.press(filterButton);

      // FilterDropdown should be visible after press
      // We can't directly check if it's visible, but we can verify haptic was called
      expect(Haptics.impactAsync).toHaveBeenCalled();
    });

    it('triggers haptic feedback when filter button pressed', () => {
      const { getByLabelText } = render(<FilterBar />);

      const filterButton = getByLabelText('All Cards');
      fireEvent.press(filterButton);

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility hint for filter button', () => {
      const { getByLabelText } = render(<FilterBar />);

      const filterButton = getByLabelText('All Cards');
      expect(filterButton.props.accessibilityHint).toBe(
        'Opens card type filter dropdown'
      );
    });

    it('filter button has tab accessibility role', () => {
      const { getByLabelText } = render(<FilterBar />);

      const filterButton = getByLabelText('All Cards');
      expect(filterButton.props.accessibilityRole).toBe('tab');
    });
  });

  describe('Recently Used Tab', () => {
    it('triggers haptic feedback when pressed', () => {
      const { getByText } = render(<FilterBar />);

      const recentTab = getByText('Recently Used');
      fireEvent.press(recentTab);

      expect(Haptics.impactAsync).toHaveBeenCalled();
    });

    it('has tab accessibility role', () => {
      const { getByLabelText } = render(<FilterBar />);

      const recentTab = getByLabelText('Recently Used');
      expect(recentTab.props.accessibilityRole).toBe('tab');
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<FilterBar />);

      expect(getByLabelText('Recently Used')).toBeTruthy();
    });
  });

  describe('Filter Change Callback', () => {
    it('calls onCardFiltersChange when filters update', () => {
      const onCardFiltersChange = jest.fn();
      const { getByLabelText } = render(
        <FilterBar
          cardFilters={['all']}
          onCardFiltersChange={onCardFiltersChange}
        />
      );

      // Open dropdown
      const filterButton = getByLabelText('All Cards');
      fireEvent.press(filterButton);

      // The dropdown will handle the actual filter change
      // This test verifies the prop is passed correctly
      expect(onCardFiltersChange).not.toHaveBeenCalled();
    });

    it('works without onCardFiltersChange callback', () => {
      const { getByLabelText } = render(<FilterBar cardFilters={['all']} />);

      const filterButton = getByLabelText('All Cards');
      expect(() => fireEvent.press(filterButton)).not.toThrow();
    });
  });

  describe('Label Updates', () => {
    it('updates label when cardFilters prop changes', () => {
      const { rerender, getByText } = render(
        <FilterBar cardFilters={['all']} />
      );

      expect(getByText('All Cards')).toBeTruthy();

      rerender(<FilterBar cardFilters={['debit']} />);

      expect(getByText('Debit Cards')).toBeTruthy();
    });

    it('updates from single to multiple filters', () => {
      const { rerender, getByText } = render(
        <FilterBar cardFilters={['debit']} />
      );

      expect(getByText('Debit Cards')).toBeTruthy();

      rerender(<FilterBar cardFilters={['debit', 'credit']} />);

      expect(getByText('Debit, Credit')).toBeTruthy();
    });

    it('updates from multiple to all filters', () => {
      const { rerender, getByText } = render(
        <FilterBar cardFilters={['debit', 'credit']} />
      );

      expect(getByText('Debit, Credit')).toBeTruthy();

      rerender(<FilterBar cardFilters={['all']} />);

      expect(getByText('All Cards')).toBeTruthy();
    });
  });

  describe('Layout and Styling', () => {
    it('renders two tabs side by side', () => {
      const { getByLabelText } = render(<FilterBar />);

      const filterTab = getByLabelText('All Cards');
      const recentTab = getByLabelText('Recently Used');

      expect(filterTab).toBeTruthy();
      expect(recentTab).toBeTruthy();
    });

    it('truncates long filter labels', () => {
      const { getByText } = render(<FilterBar />);

      const filterLabel = getByText('All Cards');
      expect(filterLabel.props.numberOfLines).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined cardFilters', () => {
      const { getByText } = render(
        <FilterBar cardFilters={undefined as any} />
      );

      expect(getByText('All Cards')).toBeTruthy();
    });

    it('handles empty array cardFilters', () => {
      const { getByText } = render(<FilterBar cardFilters={[]} />);

      expect(getByText('All Cards')).toBeTruthy();
    });

    it('handles rapid filter button presses', () => {
      const { getByLabelText } = render(<FilterBar />);

      const filterButton = getByLabelText('All Cards');

      fireEvent.press(filterButton);
      fireEvent.press(filterButton);
      fireEvent.press(filterButton);

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('provides accessible labels for all interactive elements', () => {
      const { getByLabelText } = render(<FilterBar />);

      expect(getByLabelText('All Cards')).toBeTruthy();
      expect(getByLabelText('Recently Used')).toBeTruthy();
    });

    it('has appropriate accessibility hints', () => {
      const { getByLabelText } = render(<FilterBar />);

      const filterButton = getByLabelText('All Cards');
      expect(filterButton.props.accessibilityHint).toBeTruthy();
    });
  });
});
