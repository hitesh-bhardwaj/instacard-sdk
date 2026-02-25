import { StyleSheet, Text, View } from 'react-native';

import { InstacardColors, useInstacardColors } from '@/constants/colors';

interface DrawerHeaderProps {
  amount: string;
  onClose: () => void;
}

export function DrawerHeader({ amount, onClose }: DrawerHeaderProps) {
  const colors = useInstacardColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select bank</Text>
      </View>
      <Text style={styles.subtitle}>
        Pay <Text style={styles.strikethrough}>N</Text>{amount} via UPI
      </Text>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  container: {
    display: 'flex',
    paddingTop: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    paddingRight: 4,
  },
});
