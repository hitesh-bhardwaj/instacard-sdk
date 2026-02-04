import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FilterIcon from '@/assets/svg/filter.svg';
import SortIcon from '@/assets/svg/sort.svg';
import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';

import { CardFilterType, FilterDropdown } from './filter-dropdown';
import { AnimatedToggle } from '../ui/animated-toggle';

// Re-export for convenience
export type { CardFilterType };

export type FilterTab = 'all' | 'recent';

/** Labels for card filter types */
const FILTER_LABELS: Record<CardFilterType, string> = {
  all: 'All Cards',
  debit: 'Debit',
  credit: 'Credit',
  prepaid: 'Pre-Paid',
  gift: 'Gift',
};

/** Get display label for selected filters */
function getFilterLabel(filters: CardFilterType[]): string {
  if (filters.includes('all') || filters.length === 0) {
    return 'All Cards';
  }
  if (filters.length === 1) {
    return `${FILTER_LABELS[filters[0]]} Cards`;
  }
  if (filters.length === 2) {
    return `${FILTER_LABELS[filters[0]]}, ${FILTER_LABELS[filters[1]]}`;
  }
  return `${filters.length} Selected`;
}

interface FilterBarProps {
  /** Currently selected card type filters (multi-select) */
  cardFilters?: CardFilterType[];
  /** Called when user changes filter selection */
  onCardFiltersChange?: (filters: CardFilterType[]) => void;
  mode: 'virtual' | 'universal';
  onModeChange: (mode: 'virtual' | 'universal') => void;
}

export function FilterBar({
  cardFilters = ['all'],
  onCardFiltersChange,
  mode,
  onModeChange,
}: FilterBarProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleFilterTabPress = () => {
    hapticLight();
    setDropdownVisible(true);
  };

  const handleFiltersChange = (filters: CardFilterType[]) => {
    onCardFiltersChange?.(filters);
  };

  const filterLabel = getFilterLabel(cardFilters);

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <View style={styles.toggleContainer}>
        <AnimatedToggle value={mode} onChange={onModeChange} />
      </View>
      <View style={styles.tabsContainer}>
      <Text style={styles.tabText}>Filters</Text>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={handleFilterTabPress}
          accessibilityRole="tab"
          accessibilityLabel={filterLabel}
          accessibilityHint="Opens card type filter dropdown"
          activeOpacity={0.7}
        >
          <FilterIcon
            width={16}
            height={16}
            color={InstacardColors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            hapticLight();
          }}
          accessibilityRole="tab"
          accessibilityLabel="Recently Used"
          activeOpacity={0.7}
        >
          <SortIcon
            width={16}
            height={16}
            color={InstacardColors.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <FilterDropdown
        visible={dropdownVisible}
        selectedFilters={cardFilters}
        onSelectionChange={handleFiltersChange}
        onClose={() => setDropdownVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingRight:16,
    paddingVertical: 8,
    gap: 8,
  },
  toggleContainer: {
     width: 'auto',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: `${InstacardColors.textPrimary}10`,
    backgroundColor: InstacardColors.white,
  },
  tabText: {
    fontSize: 14,
    marginRight: 5,
    color: InstacardColors.textPrimary,
  },
});
