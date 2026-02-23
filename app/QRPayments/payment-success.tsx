import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticSuccess } from '@/lib/haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function PaymentSuccess() {
  const insets = useSafeAreaInsets();
  const receiptRef = useRef<View>(null);
  const rawParams = useLocalSearchParams<{
    amount?: string | string[];
    message?: string | string[];
    bankId?: string | string[];
    recipientName?: string | string[];
    upiId?: string | string[];
    transactionId?: string | string[];
    date?: string | string[];
  }>();

  const normalizeParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const amountParam = normalizeParam(rawParams.amount);
  const recipientNameParam = normalizeParam(rawParams.recipientName);
  const upiIdParam = normalizeParam(rawParams.upiId);
  const transactionIdParam = normalizeParam(rawParams.transactionId);
  const dateParam = normalizeParam(rawParams.date);
  const messageParam = normalizeParam(rawParams.message);

  // Animation values
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const circleScale = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);
  const confettiProgress = useSharedValue(0);

  const paymentData = {
    amount:
      amountParam && !Number.isNaN(Number(amountParam))
        ? Number(amountParam).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        : amountParam ?? '0.00',
    recipientName: recipientNameParam ?? 'Nirdesh Malik',
    upiId: upiIdParam ?? 'nirdeshmalik@okaxis',
    transactionId:
      transactionIdParam ??
      'TXN' + Date.now().toString().slice(-10),
    date:
      dateParam ??
      new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    message: messageParam ?? '',
  };

  useEffect(() => {
    // Trigger haptic feedback
    hapticSuccess();

    // Animate circle with bounce
    circleScale.value = withSpring(1, { damping: 8, stiffness: 120 });

    // Animate ring pulse
    ringScale.value = withDelay(100, withSequence(
      withTiming(1.3, { duration: 400, easing: Easing.out(Easing.ease) }),
      withTiming(1.5, { duration: 300 })
    ));
    ringOpacity.value = withDelay(100, withSequence(
      withTiming(0.6, { duration: 200 }),
      withTiming(0, { duration: 500 })
    ));

    // Animate checkmark with bounce
    checkScale.value = withDelay(250, withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    ));
    checkOpacity.value = withDelay(250, withTiming(1, { duration: 200 }));

    // Animate content
    contentOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    contentTranslateY.value = withDelay(500, withSpring(0, { damping: 15, stiffness: 100 }));

    // Animate button
    buttonOpacity.value = withDelay(700, withTiming(1, { duration: 300 }));
    buttonTranslateY.value = withDelay(700, withSpring(0, { damping: 15, stiffness: 100 }));

    // Confetti animation
    confettiProgress.value = withDelay(300, withTiming(1, { duration: 1000 }));
  }, []);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const handleDone = () => {
    router.replace('/cards');
  };

  const handleShareReceipt = useCallback(async () => {
    try {
      if (!receiptRef.current) return;

      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Payment Receipt',
        });
      }
    } catch (error) {
      console.log('Error sharing receipt:', error);
    }
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#E8F5E9', '#FFFFFF', '#FFFFFF']}
        style={styles.backgroundGradient}
        locations={[0, 0.3, 1]}
      />

      <ScrollView
        ref={receiptRef as any}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Capturable Receipt Area */}
        <View collapsable={false} style={styles.receiptContainer}>
          {/* Success Icon */}
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              {/* Animated Ring */}
              <Animated.View style={[styles.successRing, ringAnimatedStyle]} />

              {/* Main Circle */}
              <Animated.View style={[styles.successCircle, circleAnimatedStyle]}>
                <LinearGradient
                  colors={['#66BB6A', '#43A047']}
                  style={styles.circleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Animated.View style={checkAnimatedStyle}>
                    <Ionicons name="checkmark" size={56} color={InstacardColors.white} />
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
            </View>

            <Animated.View style={[styles.successTextContainer, contentAnimatedStyle]}>
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successSubtitle}>Your transaction has been completed</Text>
            </Animated.View>
          </View>

          {/* Amount Card */}
          <Animated.View style={[styles.amountCard, contentAnimatedStyle]}>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <View style={styles.amountRow}>

              <Text style={styles.amountText}> <Text style={{ textDecorationLine: 'line-through' }}>N</Text> {paymentData.amount}</Text>
            </View>
            {paymentData.message ? (
              <Text style={styles.messageText}>{paymentData.message}</Text>
            ) : null}
          </Animated.View>


          {/* Payment Details */}
          <Animated.View style={[styles.contentSection, contentAnimatedStyle]}>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="person-outline" size={18} color={InstacardColors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Paid To</Text>
                  <Text style={styles.detailValue}>{paymentData.recipientName}</Text>
                </View>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="at-outline" size={18} color={InstacardColors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>UPI ID</Text>
                  <Text style={styles.detailValue}>{paymentData.upiId}</Text>
                </View>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="receipt-outline" size={18} color={InstacardColors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Transaction ID</Text>
                  <Text style={styles.detailValueSmall}>{paymentData.transactionId}</Text>
                </View>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="calendar-outline" size={18} color={InstacardColors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>{paymentData.date}</Text>
                </View>
              </View>

            </View>
          </Animated.View>
        </View>

        {/* Action Buttons */}
        <Animated.View style={[styles.buttonSection, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareReceipt}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color={InstacardColors.primary} />
            <Text style={styles.shareButtonText}>Share Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.white,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  receiptContainer: {
    backgroundColor: InstacardColors.white,
  },
  iconSection: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTextContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successTitle: {
    fontSize: 26,
    fontFamily: AppFonts.bold,
    color: InstacardColors.textPrimary,
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  amountCard: {
    marginHorizontal: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: 'rgba(0, 0, 0, 0.8)',
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: AppFonts.bold,
    color: 'black',
    marginTop: 6,
    marginRight: 4,
    textDecorationLine: 'line-through',
  },
  amountText: {
    fontSize: 40,
    fontFamily: AppFonts.bold,
    color: 'black',
  },
  messageText: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
    marginTop: 8,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
  detailValueSmall: {
    fontSize: 13,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginLeft: 48,
  },
  buttonSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: InstacardColors.lightGray,
    borderRadius: 25,
    paddingVertical: 14,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: AppFonts.medium,
    color: InstacardColors.primary,
  },
  doneButton: {
    backgroundColor: InstacardColors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: AppFonts.medium,
    color: InstacardColors.white,
  },
});