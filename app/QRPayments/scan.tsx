import { CardsHeader } from '@/components/cards/cards-header';
import { InstacardColors } from '@/constants/colors';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Flashlight } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import GalleryIcon from '@/assets/svg/gallery.svg';
import ThunderIconOff from '@/assets/svg/thunder-off.svg';
import ThunderIconOn from '@/assets/svg/thunder-on.svg';
import MaskedView from '@react-native-masked-view/masked-view';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAMERA_HEIGHT = SCREEN_WIDTH * 1.9;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const hasScanned = useRef(false);

  // Scanning line animation
  const scanLinePosition = useSharedValue(0);

  // Breathing scale animation
  const breathingScale = useSharedValue(1);

  // Corner border animation
  const cornerSize = useSharedValue(CORNER_SIZE);

  // Start scanning animation
  useEffect(() => {
    scanLinePosition.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );

    // Start breathing animation
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Start corner border animation (shrink then expand back)
    cornerSize.value = withRepeat(
      withSequence(
        withTiming(CORNER_SIZE * 0.8, { duration: 1000 }),
        withTiming(CORNER_SIZE, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value * 200 }],
  }));

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
  }));

  const topLeftCornerStyle = useAnimatedStyle(() => ({
    width: cornerSize.value,
    height: cornerSize.value,
  }));

  const topRightCornerStyle = useAnimatedStyle(() => ({
    width: cornerSize.value,
    height: cornerSize.value,
  }));

  const bottomLeftCornerStyle = useAnimatedStyle(() => ({
    width: cornerSize.value,
    height: cornerSize.value,
  }));

  const bottomRightCornerStyle = useAnimatedStyle(() => ({
    width: cornerSize.value,
    height: cornerSize.value,
  }));

  const handleFlashToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlashOn(!flashOn);
  };

  const handleGalleryPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      console.log('Selected image:', result.assets[0].uri);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleBarcodeScanned = (data: string) => {
    if (hasScanned.current) return;
    hasScanned.current = true;

    setResult(data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      router.replace('/QRPayments/payment-amount');
    }, 1500);
  };


  if (!permission) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to scan QR codes
          </Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.backLink} onPress={handleClose}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header - Background Layer (z-index: 0) */}
      <CardsHeader
        subtitle="Scan QR Code"
        showHomeIcon={false}
      />
      Camera View - Middle Layer with rounded top
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={flashOn}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={(result) => {
            handleBarcodeScanned(result.data);
          }}
        />

        {/* Scanner Frame Overlay */}
        <View style={styles.scannerOverlay}>

          {/* SCANNER BOX */}
          <Animated.View style={[{padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 24 }, breathingStyle]}>

            <View style={[styles.scannerFrame, ]}>
              {/* Corner Brackets */}

              <Animated.View style={[styles.corner, styles.topLeft, topLeftCornerStyle]} />
              <Animated.View style={[styles.corner, styles.topRight, topRightCornerStyle]} />
              <Animated.View style={[styles.corner, styles.bottomLeft, bottomLeftCornerStyle]} />
              <Animated.View style={[styles.corner, styles.bottomRight, bottomRightCornerStyle]} />


              {result && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.resultContainer}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Linking.openURL(result);
                  }}
                >
                  <BlurView
                    intensity={90}
                    tint="light"
                    experimentalBlurMethod='dimezisBlurView'
                    blurReductionFactor={6}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View style={styles.resultContent}>
                    <Text style={styles.resultText} numberOfLines={1} ellipsizeMode="tail">
                      {truncateText(result)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Scanning Line */}
              <Animated.View style={[styles.scanLine, scanLineStyle]} />
            </View>
          </Animated.View>

        </View>
      </View>

      {/* Bottom Section - Top Layer (z-index: 2) */}
      <View style={styles.bottomSection}>
        <View

          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.bottomContent}>
          <Text style={styles.instructionText}>
            Align the QR code within the frame to scan
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionButton}
              // onPress={handleGalleryPress}
              onPress={() => {
                router.push('/QRPayments/payment-amount');
              }}
            >
              <View style={styles.actionButtonInner}>
                <GalleryIcon width={24} height={24} color={InstacardColors.white} />
              </View>
              <Text style={styles.actionButtonLabel}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionButton}
              onPress={handleFlashToggle}
            >
              <View style={[styles.actionButtonInner, flashOn && styles.actionButtonActive]}>
                {flashOn ? (
                  <ThunderIconOn width={24} height={24} color={InstacardColors.white} />
                ) : (
                  <ThunderIconOff width={24} height={24} color={InstacardColors.white} />
                )}
              </View>
              <Text style={styles.actionButtonLabel}>
                {flashOn ? 'Flash On' : 'Flash Off'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const SCANNER_SIZE = 260;
const CORNER_SIZE = 45;
const CORNER_BORDER_WIDTH = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.primary,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    height: CAMERA_HEIGHT,
    zIndex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingBottom: "40%",
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scannerFrame: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'relative',
    zIndex: 10,
  },
  corner: {
    position: 'absolute',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderBottomRightRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: InstacardColors.white,
    borderRadius: 2,
    shadowColor: InstacardColors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    top: 24,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  bottomContent: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 120 : 110,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '500',
    color: InstacardColors.white,
    textAlign: 'center',
    marginBottom: 28,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 56,
  },
  actionButton: {
    alignItems: 'center',
    gap: 10,
  },
  actionButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${InstacardColors.white}70`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonActive: {
    backgroundColor: InstacardColors.primaryLight,
  },
  actionButtonLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: InstacardColors.white,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#000',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: InstacardColors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: InstacardColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: InstacardColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: InstacardColors.white,
  },
  backLink: {
    marginTop: 24,
    padding: 12,
  },
  backLinkText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  resultContainer: {
    position: 'absolute',
    top: '110%',
    left: -10,
    right: -10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 14,
    fontWeight: '500',
    color: InstacardColors.textPrimary,
    textAlign: 'center',
  },
});
