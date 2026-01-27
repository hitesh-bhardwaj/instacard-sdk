import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CardsHeader } from '@/components/cards/cards-header';
import { SheetContainer } from '@/components/ui/sheet-container';
import { InstacardColors } from '@/constants/colors';

const MAX_CODE_LENGTH = 6;

const KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [' ', '0', 'del'],
] as const;

export default function AddInstacardOtpScreen() {
  const [code, setCode] = useState('');

  const codeDigits = useMemo(() => {
    return Array.from({ length: MAX_CODE_LENGTH }, (_, index) => code[index] ?? '');
  }, [code]);

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      setCode((prev) => prev.slice(0, -1));
      return;
    }
    if (key.trim() === '') {
      return;
    }
    setCode((prev) => {
      if (prev.length >= MAX_CODE_LENGTH) {
        return prev;
      }
      return `${prev}${key}`;
    });
  };

  return (
    <View style={styles.container}>
      <CardsHeader
        subtitle="Verify Phone"
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
        <View style={styles.sheetContent}>
          <Text style={styles.title} accessibilityRole="header">
            Verify your Phone Number
          </Text>
          <Text style={styles.subtitle}>
            We have sent you a 6-digit code to your number
          </Text>
          <Text style={styles.phone}>+234 802-397-0955</Text>
          <Text style={styles.subtitle}>Please check your messages and enter it here</Text>

          <View
            style={styles.codeRow}
            accessibilityLabel={`Verification code: ${code.length} of ${MAX_CODE_LENGTH} digits entered`}
            accessibilityRole="text"
          >
            {codeDigits.map((digit, index) => (
              <View key={`digit-${index}`} style={styles.codeBox}>
                <Text style={styles.codeText}>{digit}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, code.length < MAX_CODE_LENGTH && styles.primaryButtonDisabled]}
            activeOpacity={0.9}
            disabled={code.length < MAX_CODE_LENGTH}
            accessibilityRole="button"
            accessibilityLabel="Continue with verification"
            accessibilityState={{ disabled: code.length < MAX_CODE_LENGTH }}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>

          <Text style={styles.resend}>
            Didn&apos;t receive the Code?{' '}
            <Text
              style={styles.resendLink}
              accessibilityRole="link"
              accessibilityLabel="Resend verification code"
            >
              Resend
            </Text>
          </Text>
        </View>

        <View style={styles.keypad} accessibilityRole="keyboardkey">
          {KEY_ROWS.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.keyRow}>
              {row.map((key) => {
                if (key === ' ') {
                  return <View key={`empty-${rowIndex}`} style={styles.keySpacer} />;
                }
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.keyButton, key === 'del' && styles.keyButtonDelete]}
                    activeOpacity={0.8}
                    onPress={() => handleKeyPress(key)}
                    accessibilityRole="button"
                    accessibilityLabel={key === 'del' ? 'Delete' : `Number ${key}`}
                  >
                    <Text style={styles.keyText}>{key === 'del' ? 'x' : key}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
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
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: InstacardColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: InstacardColors.textSecondary,
    textAlign: 'center',
  },
  phone: {
    fontSize: 13,
    color: InstacardColors.textPrimary,
    fontWeight: '600',
  },
  codeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  codeBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: InstacardColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 16,
    color: InstacardColors.textPrimary,
  },
  primaryButton: {
    marginTop: 8,
    width: '100%',
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
  resend: {
    marginTop: 12,
    fontSize: 12,
    color: InstacardColors.textSecondary,
  },
  resendLink: {
    color: InstacardColors.primary,
    fontWeight: '600',
  },
  keypad: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyButton: {
    width: 90,
    height: 54,
    borderRadius: 12,
    backgroundColor: InstacardColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonDelete: {
    backgroundColor: InstacardColors.white,
    borderWidth: 1,
    borderColor: InstacardColors.border,
  },
  keyText: {
    fontSize: 18,
    color: InstacardColors.textPrimary,
  },
  keySpacer: {
    width: 90,
    height: 54,
  },
});
