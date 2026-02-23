import { Stack } from 'expo-router';

export default function QRPaymentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false , contentStyle: { backgroundColor: 'black', flex: 1, height: '100%' }}}>
      <Stack.Screen name="scan" options={{ animation: 'fade', animationDuration: 300 }} />
      <Stack.Screen name="payment-amount" options={{ animation: 'slide_from_bottom', animationDuration: 300 }} />
      <Stack.Screen name="pin-auth" options={{ animation: 'slide_from_bottom', animationDuration: 300 }} />
      <Stack.Screen name="payment-success" options={{ animation: 'fade', animationDuration: 300 }} />
    </Stack>
  );
}
