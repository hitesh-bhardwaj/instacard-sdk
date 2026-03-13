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
import { BarChart2, Clock3, X } from 'lucide-react-native';

import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { hapticLight, hapticSelection } from '@/lib/haptics';
import { useThemeStore } from '@/hooks/use-theme-store';
import { useTranslation } from 'react-i18next';

export type SortByValue = 'recent' | 'most-used';

interface SortOption {
  id: SortByValue;
  labelKey: 'recent' | 'mostUsed';
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'recent', labelKey: 'recent', Icon: Clock3 },
  { id: 'most-used', labelKey: 'mostUsed', Icon: BarChart2 },
];

interface SortDropdownProps {
  visible: boolean;
  selectedSort: SortByValue;
  onSelect: (sort: SortByValue) => void;
  onClose: () => void;
}

export function SortDropdown({
  visible,
  selectedSort,
  onSelect,
  onClose,
}: SortDropdownProps) {
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();

  const handleSelect = useCallback(
    (value: SortByValue) => {
      hapticSelection();
      onSelect(value);
    },
    [onSelect],
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
                tint={isDarkMode ? 'dark' : 'light'}
                experimentalBlurMethod={
                  Platform.OS === 'android' ? 'dimezisBlurView' : 'dimezisBlurView'
                }
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.dropdownContent}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>
                    {t('cards.sortDropdown.title')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      hapticLight();
                      onClose();
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={t('cards.sortDropdown.close')}
                    accessibilityRole="button"
                  >
                    <X
                      size={22}
                      color={isDarkMode ? 'black' : colors.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.optionsList}>
                  {SORT_OPTIONS.map(({ id, labelKey, Icon }) => {
                    const label = t(`cards.sortDropdown.${labelKey}`);
                    const isSelected = selectedSort === id;

                    return (
                      <TouchableOpacity
                        key={id}
                        style={[
                          styles.option,
                          isSelected && styles.optionSelected,
                        ]}
                        onPress={() => handleSelect(id)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        accessibilityLabel={label}
                      >
                        <View style={styles.optionLeft}>
                          <Icon
                            size={18}
                            color={
                              isSelected ? InstacardColors.primary : colors.textPrimary
                            }
                          />
                          <Text
                            style={[
                              styles.optionText,
                              isSelected && styles.optionTextSelected,
                            ]}
                          >
                            {label}
                          </Text>
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

const createStyles = (colors: typeof InstacardColors) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, .2)',
    },
    dropdownContainer: {
      position: 'absolute',
      top: '27%',
      right: '5%',
      alignItems: 'flex-start',
    },
    dropdownWrapper: {
      borderRadius: 16,
      minWidth: 220,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    dropdownContent: {
      paddingVertical: 16,
      paddingTop: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
      color: InstacardColors.textPrimary,
    },
    optionsList: {
      paddingHorizontal: 20,
      paddingTop: 4,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    optionSelected: {
      backgroundColor: `${InstacardColors.primary}12`,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    optionText: {
      fontSize: 15,
      color: colors.textPrimary,
    },
    optionTextSelected: {
      color: InstacardColors.primary,
      fontWeight: '600',
    },
  });

