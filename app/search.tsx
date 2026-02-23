import { InstacardColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { CardsHeader } from '@/components/cards/cards-header';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CardsHeader
        subtitle={'Search'}
        showHomeIcon={false}
      />

      <View style={styles.content}>
        <Text style={styles.placeholderText}>Search screen (coming soon)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.primary,
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: InstacardColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: InstacardColors.textSecondary,
  },
});
