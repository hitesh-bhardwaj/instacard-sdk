import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { InstacardColors } from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/cards')}>
        <Text style={styles.buttonText}>Cards</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: InstacardColors.white,
  },
  button: {
    backgroundColor: InstacardColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: InstacardColors.textOnPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
});
