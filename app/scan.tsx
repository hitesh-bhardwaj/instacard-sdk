import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Flashlight, FlashlightOff, Image, X } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { InstacardColors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';



export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  
  // Scanning line animation
  const scanLinePosition = useSharedValue(0);
  
  // Start scanning animation
  useState(() => {
    scanLinePosition.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
  });

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value * 200 }],
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

      {/* Camera View */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashOn}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={(result) => {
          setResult(result.data);
        }}
      />

      {/* Dark Overlay with Cutout */}
      <View style={styles.overlay}>
        {/* Top Section */}
        <View style={styles.overlaySection}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.8} style={styles.closeButton} onPress={handleClose}>
              <X size={20} color={InstacardColors.white} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* Middle Section with Scanner Frame */}
        <View style={styles.middleSection}>
          {/* <View style={styles.sideOverlay} /> */}
          <View style={styles.scannerFrame}>
            {/* Corner Brackets */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {result && (
                <TouchableOpacity activeOpacity={0.8} style={styles.resultText} onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(result);
                }}>
                  <Text style={{color: InstacardColors.white, textAlign: 'center'}} numberOfLines={1} ellipsizeMode="tail">{truncateText(result)}</Text>
                </TouchableOpacity>
            )}  
            
            {/* Scanning Line */}
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
          </View>
          {/* <View style={styles.sideOverlay} /> */}
        </View>

        {/* Bottom Section */}
        <View style={styles.overlaySection}>
          <Text style={styles.instructionText}>
            Align the QR code within the frame to scan
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionButton}
              onPress={handleGalleryPress}
            >
              <View style={styles.actionButtonInner}>
                <Image size={24} color={InstacardColors.white} strokeWidth={1.5} />
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
                  <Flashlight size={24} color={InstacardColors.primary} strokeWidth={1.5} />
                ) : (
                  <FlashlightOff size={24} color={InstacardColors.white} strokeWidth={1.5} />
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

const SCANNER_SIZE = 250;
const CORNER_SIZE = 40;
const CORNER_BORDER_WIDTH = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  overlaySection: {
    backgroundColor: `${InstacardColors.primary}`,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: InstacardColors.white,
  },
  placeholder: {
    width: 44,
  },
  middleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: SCANNER_SIZE,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scannerFrame: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
    borderColor: InstacardColors.white,
    borderBottomRightRadius: 16,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: InstacardColors.white,
    borderRadius: 1,
    shadowColor: InstacardColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    top: 20,
  },
  instructionText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    paddingBottom: 60,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonActive: {
    backgroundColor: InstacardColors.white,
    borderColor: InstacardColors.white,
  },
  actionButtonLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 22,
    color: InstacardColors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: InstacardColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    color: InstacardColors.white,
  },
  backLink: {
    marginTop: 20,
    padding: 12,
  },
  backLinkText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
 
  resultText: {
    position: 'absolute',
    top: '120%',
    left: 0,
    right: 0,
    backgroundColor: `${InstacardColors.primary}95`,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 100,
    textAlign: 'center',
    fontSize: 12,
    color: InstacardColors.white,
  },
});
