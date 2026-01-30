import { BlurView } from 'expo-blur';
import { useCallback } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';
import { hapticLight, hapticSelection } from '@/lib/haptics';

export type CardFilterType = 'all' | 'debit' | 'credit' | 'prepaid' | 'gift';

interface FilterOption {
  id: CardFilterType;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Cards' },
  { id: 'debit', label: 'Debit Card' },
  { id: 'credit', label: 'Credit Card' },
  { id: 'prepaid', label: 'Pre-Paid Card' },
  { id: 'gift', label: 'Gift Card' },
];

interface FilterDropdownProps {
  visible: boolean;
  selectedFilters: CardFilterType[];
  onSelectionChange: (filters: CardFilterType[]) => void;
  onClose: () => void;
}

export function FilterDropdown({
  visible,
  selectedFilters,
  onSelectionChange,
  onClose,
}: FilterDropdownProps) {
  const handleToggle = useCallback(
    (filter: CardFilterType) => {
      hapticSelection();
      
      if (filter === 'all') {
        // "All Cards" clears other selections
        onSelectionChange(['all']);
        return;
      }

      // Remove 'all' if selecting a specific filter
      let newFilters: CardFilterType[] = selectedFilters.filter((f) => f !== 'all');

      if (newFilters.includes(filter)) {
        // Deselect: remove from array
        newFilters = newFilters.filter((f) => f !== filter);
        // If nothing selected, default back to 'all'
        if (newFilters.length === 0) {
          newFilters = ['all'];
        }
      } else {
        // Select: add to array
        newFilters = [...newFilters, filter];
      }

      onSelectionChange(newFilters);
    },
    [selectedFilters, onSelectionChange]
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.dropdownContainer}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.dropdownWrapper}>
              <BlurView
                intensity={90}
                tint="light"
                experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.dropdownContent}>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerTitle}>
                    <IconSymbol
                      name="slider.horizontal.3"
                      size={18}
                      color={InstacardColors.textPrimary}
                    />
                    <Text style={styles.headerText}>Filters</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      hapticLight();
                      onClose();
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel="Close filters"
                    accessibilityRole="button"
                  >
                    <IconSymbol
                      name="xmark"
                      size={18}
                      color={InstacardColors.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

               

                {/* Options */}
                <View style={styles.optionsList}>
                  {FILTER_OPTIONS.map((option) => {
                    const isSelected = selectedFilters.includes(option.id);
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.option}
                        onPress={() => handleToggle(option.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                        accessibilityLabel={option.label}
                      >
                        <Text style={styles.optionText}>{option.label}</Text>
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {isSelected && (
                            <IconSymbol
                              name="checkmark"
                              size={14}
                              
                              color={InstacardColors.white}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-start',
    paddingTop: 280,
    paddingHorizontal: 16,
  },
  dropdownContainer: {
    alignItems: 'flex-start',
  },
  dropdownWrapper: {
    borderRadius: 16,
    minWidth: 280,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownContent: {
    paddingVertical: 16,
    paddingTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: InstacardColors.textPrimary,
  },
  
  optionsList: {
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 15,
    color: InstacardColors.textPrimary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: InstacardColors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FF8303',
    borderColor: '#FF8303',
  },
});
