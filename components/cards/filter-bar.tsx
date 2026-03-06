import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import FilterIcon from '@/assets/svg/filter.svg';
import SortIcon from '@/assets/svg/sort.svg';
import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';

import { AnimatedToggle } from '../ui/animated-toggle';
import { CardFilterType, FilterDropdown } from './filter-dropdown';

// Re-export for convenience
export type { CardFilterType };

export type FilterTab = 'all' | 'recent';

interface FilterBarProps {
  /** Currently selected card type filters (multi-select) */
  cardFilters?: CardFilterType[];
  /** Called when user changes filter selection */
  onCardFiltersChange?: (filters: CardFilterType[]) => void;
  /** Whether "Recently Used" filter is active */
  recentFilterActive?: boolean;
  /** Called when user taps Recently Used / Sort icon */
  onRecentFilterPress?: () => void;
  mode: 'virtual' | 'universal';
  onModeChange: (mode: 'virtual' | 'universal') => void;
  isDarkMode?: boolean;
}

export function FilterBar({
  cardFilters = ['all'],
  onCardFiltersChange,
  recentFilterActive = false,
  onRecentFilterPress,
  mode,
  onModeChange,
  isDarkMode,
}: FilterBarProps) {  
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { t } = useTranslation();

  const handleFilterTabPress = () => {
    hapticLight();
    setDropdownVisible(true);
  };

  const colors = useInstacardColors();
  const styles = createStyles(colors);

  const handleFiltersChange = (filters: CardFilterType[]) => {
    onCardFiltersChange?.(filters);
  };

  const getFilterLabel = (filters: CardFilterType[]): string => {
    const labels: Record<CardFilterType, string> = {
      all: t('cards.filters.all'),
      debit: t('cards.filters.debit'),
      credit: t('cards.filters.credit'),
      prepaid: t('cards.filters.prepaid'),
      gift: t('cards.filters.gift'),
    };

    if (filters.includes('all') || filters.length === 0) {
      return t('cards.filters.all');
    }
    if (filters.length === 1) {
      return `${labels[filters[0]]}`;
    }
    if (filters.length === 2) {
      return `${labels[filters[0]]}, ${labels[filters[1]]}`;
    }
    return `${filters.length}`;
  };

  const filterLabel = getFilterLabel(cardFilters);

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <View style={styles.toggleContainer}>
        <AnimatedToggle value={mode} onChange={onModeChange} />
      </View>
      <View style={styles.tabsContainer}>
      <Text style={styles.tabText}>{t('cards.filters.title')}</Text>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={handleFilterTabPress}
          accessibilityRole="tab"
          accessibilityLabel={filterLabel}
          accessibilityHint={t('cards.filters.dropdownHint')}
          activeOpacity={0.7}
        >
          <FilterIcon
            width={16}
            height={16}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, recentFilterActive && styles.tabActive]}
          onPress={() => {
            hapticLight();
            onRecentFilterPress?.();
          }}
          accessibilityRole="tab"
          accessibilityLabel={
            recentFilterActive
              ? t('cards.filters.recentlyUsedActive')
              : t('cards.filters.recentlyUsed')
          }
          accessibilityState={{ selected: recentFilterActive }}
          activeOpacity={0.7}
        >
          <SortIcon
            width={16}
            height={16}
            color={recentFilterActive ? colors.primary : colors.textPrimary}
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

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
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
    borderColor: `${colors.textPrimary}10`,
    backgroundColor: colors.white,
  },
  tabActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  tabText: {
    fontSize: 14,
    marginRight: 5,
    color: colors.textPrimary,
  },
});
