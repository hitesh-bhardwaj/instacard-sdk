import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NumberPad } from '@/components/QRPayments/number-pad';
import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticLight } from '@/lib/haptics';

const PIN_LENGTH = 4;
const CORRECT_PIN = '0000';

type CardPinAuthProps = {
  title?: string;
  cardImageSrc?: any;
  maskedNumber?: string;
  onVerified?: () => void;
  verifyPin?: (pin: string) => boolean;
};

function PinInputBoxes({ length, filled, shake }: { length: number; filled: number; shake: boolean }) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (shake) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [shake, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.pinBoxesContainer, animatedStyle]}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.pinBox,
            index < filled && styles.pinBoxFilled,
          ]}
        >
          {index < filled && <View style={styles.pinDotInside} />}
        </View>
      ))}
    </Animated.View>
  );
}

export default function CardPinAuth({
  title = 'Enter PIN for Selected Instacard',
  cardImageSrc = require('@/assets/images/cards/Instacard_1.png'),
  onVerified = () => {},
  verifyPin = (pin: string) => pin === CORRECT_PIN,
}: CardPinAuthProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const rawParams = useLocalSearchParams<{
    amount?: string | string[];
    message?: string | string[];
    bankId?: string | string[];
    recipientName?: string | string[];
    upiId?: string | string[];
  }>();

  const normalizeParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const amount = normalizeParam(rawParams.amount) ?? '0';
  const message = normalizeParam(rawParams.message) ?? '';
  const bankId = normalizeParam(rawParams.bankId) ?? '';
  const recipientName = normalizeParam(rawParams.recipientName) ?? '';
  const upiId = normalizeParam(rawParams.upiId) ?? '';

  const handleContinue = useCallback(() => {
    if (verifyPin(pin)) {
      hapticLight();
      const transactionId = 'TXN' + Date.now().toString().slice(-10);
      const date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      router.push({
        pathname: '/QRPayments/payment-success',
        params: {
          amount,
          message,
          bankId,
          recipientName,
          upiId,
          transactionId,
          date,
        },
      });
      onVerified();
    } else {
      setError('Incorrect PIN. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 300);
      setPin('');
    }
  }, [pin, verifyPin, onVerified, router]);

  const isComplete = pin.length === PIN_LENGTH;

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleContinue();
    }
  }, [pin, handleContinue]);

  const handleNumberPress = (num: string) => {
    if (num === '.') return; // Ignore decimal for PIN
    if (pin.length < PIN_LENGTH) {
      setError('');
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setError('');
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            hapticLight();
            router.back();
          }}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={InstacardColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Payment</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.cardContainer}>
          <Image
            source={cardImageSrc}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>


        <View style={styles.pinSection}>
          <Text style={styles.enterPinText}>Enter your 4-digit PIN</Text>
          <PinInputBoxes length={PIN_LENGTH} filled={pin.length} shake={shake} />
          <View style={styles.errorContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </View>
      </View>

      {/* Footer with Number Pad */}
      <View style={styles.footer}>

        <NumberPad onNumberPress={handleNumberPress} onBackspace={handleBackspace} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  cardContainer: {
    width: '65%',
    aspectRatio: 1.586,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  maskedNumber: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
    letterSpacing: 2,
  },
  pinSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    gap: 16,
  },
  enterPinText: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
    textAlign: 'center',
  },
  pinBoxesContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  pinBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: InstacardColors.border,
    backgroundColor: InstacardColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBoxFilled: {
    borderColor: InstacardColors.primary,
  },
  pinDotInside: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: InstacardColors.primary,
  },
  errorContainer: {
    height: 20,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 13,
    fontFamily: AppFonts.regular,
    color: '#EF4444',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
  },
  forgotPinBtn: {
    alignSelf: 'center',
    padding: 12,
    marginBottom: 8,
  },
  forgotPinText: {
    fontSize: 14,
    fontFamily: AppFonts.medium,
    color: InstacardColors.primary,
  },
});