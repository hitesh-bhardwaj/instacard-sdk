import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';

import { CardFilterType, FilterDropdown } from './filter-dropdown';

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
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  /** Currently selected card type filters (multi-select) */
  cardFilters?: CardFilterType[];
  /** Called when user changes filter selection */
  onCardFiltersChange?: (filters: CardFilterType[]) => void;
}

export function FilterBar({
  activeTab,
  onTabChange,
  cardFilters = ['all'],
  onCardFiltersChange,
}: FilterBarProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleFilterTabPress = () => {
    setDropdownVisible(true);
  };

  const handleFiltersChange = (filters: CardFilterType[]) => {
    onCardFiltersChange?.(filters);
  };

  const filterLabel = getFilterLabel(cardFilters);

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.tabActive]}
        onPress={() => onTabChange('all')}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'all' }}
        accessibilityLabel={filterLabel}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          onPress={handleFilterTabPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Open filters"
          accessibilityHint="Opens card type filter dropdown"
          accessibilityRole="button"
        >
          <IconSymbol
            name="slider.horizontal.3"
            size={16}
            color={activeTab === 'all' ? InstacardColors.tabActive : InstacardColors.tabInactive}
          />
        </TouchableOpacity>
        <Text
          style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}
          numberOfLines={1}
        >
          {filterLabel}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'recent' && styles.tabActive]}
        onPress={() => onTabChange('recent')}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'recent' }}
        accessibilityLabel="Recently Used"
      >
        <IconSymbol
          name="arrow.up.arrow.down"
          size={16}
          color={activeTab === 'recent' ? InstacardColors.tabActive : InstacardColors.tabInactive}
        />
        <Text
          style={[styles.tabText, activeTab === 'recent' && styles.tabTextActive]}
        >
          Recently Used
        </Text>
      </TouchableOpacity>

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
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: InstacardColors.tabBorder,
    backgroundColor: InstacardColors.white,
  },
  tabActive: {
    borderColor: InstacardColors.tabActive,
  },
  tabText: {
    fontSize: 14,
    color: InstacardColors.tabInactive,
  },
  tabTextActive: {
    color: InstacardColors.tabActive,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
