import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { CardsHeader } from '@/components/cards/cards-header';
import { SheetContainer } from '@/components/ui/sheet-container';
import { InstacardColors } from '@/constants/colors';

const CARD_TYPES = [
  { id: 'debit', label: 'Debit Card' },
  { id: 'credit', label: 'Credit Card' },
  { id: 'prepaid', label: 'Pre-Paid Card' },
  { id: 'gift', label: 'Gift A Card' },
] as const;

export default function AddInstacardTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<(typeof CARD_TYPES)[number]['id']>(
    'debit'
  );

  return (
    <View style={styles.container}>
      <CardsHeader
        subtitle="Add Instacard"
        onSearchPress={() => {
          // TODO: Implement search functionality
        }}
        onHelpPress={() => {
          // TODO: Implement help/support screen
        }}
        onAvatarPress={() => {
          // TODO: Navigate to profile screen
        }}
      />

      <SheetContainer>
        <ScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            Select the type of Instacard you would like to be issued
          </Text>

          <View style={styles.options} accessibilityRole="radiogroup">
            {CARD_TYPES.map((option) => {
              const isSelected = option.id === selectedType;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedType(option.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={option.label}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => router.push('/add-instacard-debit')}
            accessibilityRole="button"
            accessibilityLabel="Continue to next step"
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SheetContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.primary,
  },
  sheetContent: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 16,
    color: InstacardColors.textPrimary,
    lineHeight: 22,
  },
  options: {
    gap: 12,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: InstacardColors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: InstacardColors.white,
  },
  optionCardSelected: {
    borderColor: InstacardColors.primary,
  },
  optionText: {
    fontSize: 15,
    color: InstacardColors.textPrimary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: InstacardColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: InstacardColors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: InstacardColors.primary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  primaryButton: {
    backgroundColor: InstacardColors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: InstacardColors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
