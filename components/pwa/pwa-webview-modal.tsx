import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { CardsHeader } from '@/components/cards/cards-header';
import { SheetContainer } from '@/components/ui/sheet-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';
import {
  buildPWAUrl,
  parseWebViewMessage,
  SDKConfig,
  SDKResult,
  CardAddedData,
} from '@/lib/instacard-sdk';

interface PWAWebViewModalProps {
  visible: boolean;
  config: SDKConfig;
  onClose: (result: SDKResult) => void;
}

export function PWAWebViewModal({ visible, config, onClose }: PWAWebViewModalProps) {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('Instacard');
  const [error, setError] = useState<string | null>(null);

  const pwaUrl = buildPWAUrl(config);

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
    onClose({
      success: false,
      cancelled: true,
    });
  }, [onClose]);

  const handleRetry = useCallback(() => {
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
          onSearchPress={() => {
            // TODO: Implement search inside PWA
          }}
          onHelpPress={() => {
            // TODO: Implement help/support inside PWA
          }}
          onAvatarPress={() => {
            // TODO: Implement profile inside PWA
          }}
        />

        <SheetContainer>
          {/* WebView Container */}
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
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                scalesPageToFit
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={['*']}
                // Inject CSS to hide any native scrollbars
                injectedJavaScript={`
                  document.body.style.overscrollBehavior = 'none';
                  true;
                `}
              />
            )}

            {/* Loading Overlay */}
            {isLoading && !error && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={InstacardColors.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
          </View>
        </SheetContainer>
      </View>
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
