import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileSectionProps {
  name: string;
  phone: string;
  upiId: string;
  initials: string;
}

export function ProfileSection({ name, phone, upiId, initials }: ProfileSectionProps) {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
        </View>
      </View>
      <Text style={styles.phone}>{phone}</Text>
      <View style={styles.upiRow}>
        <Text style={styles.upiId}>{upiId}</Text>
        <View style={styles.upiVerifiedBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#4CAF50" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: AppFonts.medium,
    color: '#4CAF50',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  phone: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
    marginBottom: 2,
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upiId: {
    fontSize: 12,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  upiVerifiedBadge: {
    marginLeft: 4,
  },
});
