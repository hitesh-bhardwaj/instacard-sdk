import { ArrowRight, HelpCircle, LogOut, Moon, User } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InstacardColors } from '@/constants/colors';
import { LanguageDropdown } from './language-dropdown';
import { ToggleSwitch } from './toggle-switch';
import { MenuRow } from './menu-row';

interface ProfileContentProps {
  userName?: string;
  onClose: () => void;
}

export function ProfileContent({ userName = 'User', onClose }: ProfileContentProps) {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language?.split('-')[0] ?? 'en');

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.header, { paddingTop: insets.top + 20, paddingBottom: 36 }]}>
        <Text style={styles.headerTitle}>{t('profile.settings')}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={12}>
          <ArrowRight size={28} color={'black'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 100, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.avatarName}>{userName}</Text>
          <Text style={styles.avatarEmail}>user@example.com</Text>
        </View>

        <View style={styles.menuList}>
          <MenuRow
            icon={<User size={20} color={InstacardColors.primary} />}
            label={t('profile.profileSettings')}
            onPress={() => {}}
          />
          <LanguageDropdown
            selectedLang={selectedLang}
            onSelect={setSelectedLang}
          />
          <MenuRow
            icon={<Moon size={20} color={InstacardColors.primary} />}
            label={t('profile.darkMode')}
            onPress={() => {}}
            showChevron={false}
            rightElement={
              <ToggleSwitch value={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
            }
          />
          <MenuRow
            icon={<HelpCircle size={20} color={InstacardColors.primary} />}
            label={t('profile.helpSupport')}
            onPress={() => {}}
          />
          <MenuRow
            icon={<LogOut size={20} color={InstacardColors.error} />}
            label={t('profile.signOut')}
            onPress={() => onClose()}
            showChevron={false}
            danger
          />
        </View>

        <Text style={styles.versionText}>{t('profile.version')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 40,
    backgroundColor: '#6b6b6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: InstacardColors.textOnPrimary,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: '600',
    color: InstacardColors.textPrimary,
    marginBottom: 4,
  },
  avatarEmail: {
    fontSize: 14,
    color: InstacardColors.textSecondary,
  },
  menuList: {
    backgroundColor: InstacardColors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: InstacardColors.textSecondary,
  },
});
