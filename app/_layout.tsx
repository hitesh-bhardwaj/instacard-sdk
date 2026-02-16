import '@/lib/i18n';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { AppFonts } from '@/constants/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    [AppFonts.thin]: require('@/assets/fonts/HelveticaNeueThin.otf'),
    [AppFonts.light]: require('@/assets/fonts/HelveticaNeueLight.otf'),
    [AppFonts.regular]: require('@/assets/fonts/HelveticaNeueRoman.otf'),
    [AppFonts.medium]: require('@/assets/fonts/HelveticaNeueMedium.otf'),
    [AppFonts.bold]: require('@/assets/fonts/HelveticaNeueBold.otf'),
  });

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ErrorBoundary>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="cards"
                options={{
                  headerShown: false,
                  animation: 'fade',
                  animationDuration:300,      
                }}
              />
              <Stack.Screen
                name="card-detail"
                options={{
                  headerShown: false,
                  animation: 'fade',
                  animationDuration:300,
                }}
              />
              <Stack.Screen
                name="add-instacard-type"
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="add-instacard-debit"
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="add-instacard-otp"
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="scan"
                options={{
                  headerShown: false,
                  animation: 'fade',
                  animationDuration:300,
                }}
              />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ErrorBoundary>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
