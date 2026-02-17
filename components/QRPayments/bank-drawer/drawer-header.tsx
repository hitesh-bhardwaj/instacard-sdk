import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import { bankDrawerStyles as styles } from './styles';

interface DrawerHeaderProps {
  amount: string;
  onClose: () => void;
}

export function DrawerHeader({ amount, onClose }: DrawerHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextCol}>
        <Text style={styles.title}>Select bank</Text>
        <Text style={styles.subtitle}>Pay <Text style={{textDecorationLine:'line-through', paddingRight: 4}}>N</Text>{amount} via UPI</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          hapticLight();
          onClose();
        }}
        hitSlop={12}
        style={styles.close}
      >
        <Ionicons name="close" size={18} color={InstacardColors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

