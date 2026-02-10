import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

import { CardsHeader } from '@/components/cards/cards-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SheetContainer } from '@/components/ui/sheet-container';
import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import {
  buildPWAUrl,
  CardAddedData,
  createWebViewMessage,
  parseWebViewMessage,
  SDKConfig,
  SDKResult,
} from '@/lib/instacard-sdk';
import { ConfirmDialog } from './confirm-dialog';

interface PWAWebViewModalProps {
  visible: boolean;
  config: SDKConfig;
  onClose: (result: SDKResult) => void;
  /**
   * Optional route inside the PWA to open, e.g. '/card-detail'.
   * If not provided, root ('/') is used.
   */
  route?: string;
}



export function PWAWebViewModal({ visible, config, onClose, route }: PWAWebViewModalProps) {
  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('Instacard');
  const [error, setError] = useState<string | null>(null);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const router = useRouter();

  const pwaUrl = buildPWAUrl({ ...config, route });

  useEffect(() => {
    if (!visible || Platform.OS !== 'android') {
      return;
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBackRef.current && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }

      webViewRef.current?.postMessage(createWebViewMessage('USER_CANCELLED'));
      return false;
    });

    return () => backHandler.remove();
  }, [visible]);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    canGoBackRef.current = navState.canGoBack;
  }, []);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseWebViewMessage(event.nativeEvent.data);
      if (!message) return;

      const { event: eventType, data, error: eventError } = message.payload;

      switch (eventType) {
        case 'READY':
          setIsLoading(false);
          setCurrentScreen('Select Card Type');
          break;

        case 'NAVIGATION':
          if (data?.screen) {
            const screenNames: Record<string, string> = {
              'select-card-type': 'Select Card Type',
              'add-debit': 'Add Debit Card',
              'add-credit': 'Add Credit Card',
              'add-prepaid': 'Add Prepaid Card',
              'add-gift': 'Gift a Card',
              'otp-verification': 'Verify Phone',
              success: 'Success',
            };
            setCurrentScreen(screenNames[data.screen as string] || 'Instacard');
          }
          break;

        case 'CARD_ADDED':
          onClose({
            success: true,
            data: data as unknown as CardAddedData,
          });
          break;

        case 'CARD_ADDITION_FAILED':
          onClose({
            success: false,
            error: eventError || { code: 'UNKNOWN', message: 'Card addition failed' },
          });
          break;

        case 'USER_CANCELLED':
          onClose({
            success: false,
            cancelled: true,
          });
          break;

        case 'ERROR':
          setError(eventError?.message || 'An error occurred');
          break;
      }
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    if (canGoBackRef.current && webViewRef.current) {
      webViewRef.current.goBack();
      return;
    }

    onClose({
      success: false,
      cancelled: true,
    });
  }, [onClose]);

  const handleHomePress = useCallback(() => {
    hapticLight();
    setShowHomeConfirm(true);
  }, []);

  const handleHomeCancel = useCallback(() => {
    setShowHomeConfirm(false);
  }, []);

  const handleHomeConfirm = useCallback(() => {
    setShowHomeConfirm(false);
    onClose({
      success: false,
      cancelled: true,
    });
    router.replace('/cards');
  }, [onClose, router]);

  const handleRetry = useCallback(() => {
    hapticLight();
    setError(null);
    setIsLoading(true);
    webViewRef.current?.reload();
  }, []);

  const handleLoadError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load. Please check your connection and try again.');
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <CardsHeader
          subtitle={currentScreen}
          onBackPress={handleClose}
          showHomeIcon={true}
          onHomePress={handleHomePress}
        />

        <SheetContainer>
          <View style={styles.webViewContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <IconSymbol
                  name="exclamationmark.triangle"
                  size={48}
                  color={InstacardColors.error}
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetry}
                  accessibilityLabel="Retry"
                  accessibilityRole="button"
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <WebView
                ref={webViewRef}
                source={{ uri: pwaUrl }}
                style={styles.webView}
                onMessage={handleMessage}
                onLoadEnd={() => setIsLoading(false)}
                onError={handleLoadError}
                onHttpError={handleLoadError}
                onNavigationStateChange={handleNavigationStateChange}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                scalesPageToFit
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={['*']}
                injectedJavaScript={`
                  document.body.style.overscrollBehavior = 'none';
                  true;
                `}
              />
            )}

            {isLoading && !error && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={InstacardColors.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
          </View>
        </SheetContainer>
      </View>

      <ConfirmDialog
        visible={showHomeConfirm}
        title="Go to Home"
        message="Are you sure you want to leave this screen and go to back?"
        onCancel={handleHomeCancel}
        onConfirm={handleHomeConfirm}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.primary,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: InstacardColors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: InstacardColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: InstacardColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: InstacardColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: InstacardColors.primary,
    borderRadius: 24,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: InstacardColors.textOnPrimary,
  },
});
