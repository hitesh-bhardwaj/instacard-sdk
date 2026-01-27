import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';

export type FilterTab = 'all' | 'recent';

interface FilterBarProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  onSettingsPress?: () => void;
  onGridPress?: () => void;
}

export function FilterBar({
  activeTab,
  onTabChange,
  onSettingsPress,
  onGridPress,
}: FilterBarProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.tabActive]}
        onPress={() => onTabChange('all')}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'all' }}
        accessibilityLabel="All Cards"
      >
        <IconSymbol
          name="slider.horizontal.3"
          size={16}
          color={activeTab === 'all' ? InstacardColors.tabActive : InstacardColors.tabInactive}
        />
        <Text
          style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}
        >
          All Cards
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
