import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import VerifiedIcon from '@/assets/svg/check.svg';

interface ProfileSectionProps {
  name: string;
  phone: string;
  upiId: string;
  initials: string;
}

export function ProfileSection({ name, phone, upiId, initials }: ProfileSectionProps) {
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.verifiedBadge}>
          <VerifiedIcon width={20} height={20} color={InstacardColors.success} />
        </View>
      </View>
      <Text style={styles.phone}>{phone}</Text>
      <View style={styles.upiRow}>
        <Text style={styles.upiId}>{upiId}</Text>
       
      </View>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: AppFonts.medium,
    color: colors.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: AppFonts.medium,
    color: colors.textPrimary,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  phone: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upiId: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: colors.textSecondary,
  },
  upiVerifiedBadge: {
    marginLeft: 4,
  },
});
