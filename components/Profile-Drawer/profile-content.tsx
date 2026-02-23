import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { useThemeStore } from '@/hooks/use-theme-store';
import { ArrowLeft, ArrowRight, HelpCircle, LogOut, Moon, User } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageDropdown } from './language-dropdown';
import { MenuRow } from './menu-row';
import { ToggleSwitch } from './toggle-switch';

const RTL_LANGUAGES = ['ar'];

interface ProfileContentProps {
  userName?: string;
  onClose: () => void;
}

export function ProfileContent({ userName = 'User', onClose }: ProfileContentProps) {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  const [selectedLang, setSelectedLang] = useState(i18n.language?.split('-')[0] ?? 'en');

  const isRTL = RTL_LANGUAGES.includes(selectedLang);

  const handleDarkModeToggle = () => {
    toggleTheme();
    console.log('Dark mode toggled:', !isDarkMode);
  };

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const CloseArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <View style={[styles.wrapper, isRTL && styles.rtl]}>
      <View style={[styles.header, { paddingTop: insets.top + 20, paddingBottom: 36 }, isRTL && styles.rtl]}>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('profile.settings')}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={12}>
          <CloseArrow size={28} color={colors.textPrimary} />
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

        <View style={[styles.menuList, isRTL && styles.rtl]}>
          <MenuRow
            icon={<User size={20} color={isDarkMode ? '#ffffff' : colors.primary} />}
            label={t('profile.profileSettings')}
            onPress={() => {}}
            isRTL={isRTL}
          />
          <LanguageDropdown
            selectedLang={selectedLang}
            onSelect={setSelectedLang}
            isRTL={isRTL}
            isDarkMode={isDarkMode}
          />
          <MenuRow
            icon={<Moon size={20} color={isDarkMode ? '#ffffff' : colors.primary}  />}
            label={t('profile.darkMode')}
            onPress={() => {}}
            showChevron={false}
            rightElement={
              <ToggleSwitch isRTL={isRTL} value={isDarkMode} onToggle={handleDarkModeToggle} />
            }
            isRTL={isRTL}
          />
          <MenuRow
            icon={<HelpCircle size={20} color={isDarkMode ? '#ffffff' : colors.primary} />}
            label={t('profile.helpSupport')}
            onPress={() => {}}
            isRTL={isRTL}
          />
          <MenuRow
            icon={<LogOut size={20} color={InstacardColors.error} />}
            label={t('profile.signOut')}
            onPress={() => onClose()}
            showChevron={false}
            danger
            isRTL={isRTL}
          />
        </View>

        <Text style={styles.versionText}>{t('profile.version')}</Text>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.cardBackground,
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
      color: colors.textPrimary,
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
      backgroundColor: colors.shadow,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textOnPrimary,
    },
    avatarName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    avatarEmail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    menuList: {
      // backgroundColor: colors.white,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 32,
    },
    versionText: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.textSecondary,
    },
    rtl: {
      direction: 'rtl',
    },
    rtlText: {
      writingDirection: 'rtl',
    },
  });
