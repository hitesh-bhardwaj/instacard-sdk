import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { CardsHeader } from '@/components/cards/cards-header';
import { SheetContainer } from '@/components/ui/sheet-container';
import { InstacardColors } from '@/constants/colors';

const ACCOUNT_OPTIONS = ['0123456789', '0987654321', '0918273645'] as const;

const TERMS = [
  'xxxxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxxxx',
] as const;

export default function AddInstacardDebitScreen() {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_OPTIONS[0]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
            Select the Bank Account you want to link with this Debit Instacard
          </Text>

          <View style={styles.options} accessibilityRole="radiogroup">
            {ACCOUNT_OPTIONS.map((option) => {
              const isSelected = option === selectedAccount;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedAccount(option)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`Bank account ${option}`}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.terms}>
            <Text style={styles.termsTitle}>
              Please agree to Terms & Conditions for getting this Instacard issued
            </Text>
            <View style={styles.termsList}>
              {TERMS.map((term, index) => (
                <Text key={`${term}-${index}`} style={styles.termItem}>
                  - {term}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.termsCheck}
              activeOpacity={0.9}
              onPress={() => setAcceptedTerms((prev) => !prev)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptedTerms }}
              accessibilityLabel="I agree to the terms and conditions"
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms ? <View style={styles.checkboxInner} /> : null}
              </View>
              <Text style={styles.termsCheckText}>
                I agree the above terms & conditions. Please issue this Instacard
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryButton, !acceptedTerms && styles.primaryButtonDisabled]}
            activeOpacity={0.9}
            disabled={!acceptedTerms}
            onPress={() => router.push('/add-instacard-otp')}
            accessibilityRole="button"
            accessibilityLabel="Continue to verification"
            accessibilityState={{ disabled: !acceptedTerms }}
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
    gap: 20,
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
  terms: {
    gap: 12,
  },
  termsTitle: {
    fontSize: 14,
    color: InstacardColors.textPrimary,
  },
  termsList: {
    gap: 6,
  },
  termItem: {
    fontSize: 13,
    color: InstacardColors.textSecondary,
  },
  termsCheck: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  termsCheckText: {
    flex: 1,
    fontSize: 13,
    color: InstacardColors.textSecondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: InstacardColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: InstacardColors.primary,
    backgroundColor: InstacardColors.primary,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    backgroundColor: InstacardColors.white,
    borderRadius: 2,
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: InstacardColors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
