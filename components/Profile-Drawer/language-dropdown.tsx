import { Check, ChevronDown, Globe } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import { useTranslation } from 'react-i18next';
import { menuRowStyles } from './menu-row';

type Language = { code: string; name: string; native: string };

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fr', name: 'French', native: 'Français' },
];

const ANIM_DURATION = 400;
const ANIM_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

interface LanguageDropdownProps {
  selectedLang: string;
  onSelect: (code: string) => void;
  isRTL?: boolean;
}

export function LanguageDropdown({ selectedLang, onSelect, isRTL = false }: LanguageDropdownProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const measuredHeight = useSharedValue(0);
  const animHeight = useSharedValue(0);
  const chevronRotate = useSharedValue(0);

  const normalizedLang = selectedLang?.split('-')[0] ?? 'en';
  const currentLang = LANGUAGES.find((l) => l.code === normalizedLang) ?? LANGUAGES[0];

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) measuredHeight.value = h;
  }, [measuredHeight]);

  const toggle = useCallback(() => {
    hapticLight();
    const opening = !isOpen;
    setIsOpen(opening);
    animHeight.value = withTiming(opening ? measuredHeight.value : 0, {
      duration: ANIM_DURATION,
      easing: ANIM_EASING,
    });
    chevronRotate.value = withTiming(opening ? 180 : 0, {
      duration: ANIM_DURATION,
      easing: ANIM_EASING,
    });
  }, [isOpen, animHeight, measuredHeight, chevronRotate]);

  const handleSelect = useCallback((code: string) => {
    hapticLight();
    i18n.changeLanguage(code);
    onSelect(code);
    setIsOpen(false);
    animHeight.value = withTiming(0, { duration: ANIM_DURATION, easing: ANIM_EASING });
    chevronRotate.value = withTiming(0, { duration: ANIM_DURATION, easing: ANIM_EASING });
  }, [onSelect, animHeight, chevronRotate, i18n]);

  const clipStyle = useAnimatedStyle(() => ({
    height: animHeight.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotate.value}deg` }],
  }));

  return (
    <View>
      <TouchableOpacity
        style={[menuRowStyles.menuRow, isRTL && menuRowStyles.menuRowRTL]}
        onPress={toggle}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel="Languages"
      >
        <View style={menuRowStyles.iconBox}>
          <Globe size={20} color={InstacardColors.primary} />
        </View>
        <Text style={[menuRowStyles.menuLabel, isRTL && menuRowStyles.menuLabelRTL]}>{t('profile.languages')}</Text>
        <Text style={styles.langBadge}>{currentLang.native}</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color={InstacardColors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.langClip, clipStyle]}>
        <View style={styles.langInner} onLayout={handleLayout}>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === normalizedLang;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langOption, isSelected && styles.langOptionSelected, isRTL && styles.langOptionRTL]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.6}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.langOptionLeft}>
                  <Text style={[styles.langName, isSelected && styles.langNameSelected, isRTL && styles.langTextRTL]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.langNative, isRTL && styles.langTextRTL]}>{lang.native}</Text>
                </View>
                {isSelected && (
                  <View style={styles.langCheck}>
                    <Check size={14} color={InstacardColors.textOnPrimary} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  langClip: {
    overflow: 'hidden',
  },
  langInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f9f9f9',
    paddingVertical: 6,
    borderRadius: 12,
  },
  langBadge: {
    fontSize: 13,
    color: InstacardColors.textSecondary,
    marginRight: 2,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 2,
    borderRadius: 12,
  },
  langOptionSelected: {
    backgroundColor: `${InstacardColors.primary}10`,
  },
  langOptionLeft: {
    gap: 2,
  },
  langName: {
    fontSize: 14,
    fontWeight: '500',
    color: InstacardColors.textPrimary,
  },
  langNameSelected: {
    color: InstacardColors.primary,
    fontWeight: '600',
  },
  langNative: {
    fontSize: 12,
    color: InstacardColors.textSecondary,
  },
  langCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: InstacardColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langOptionRTL: {
    direction: 'rtl',
  },
  langTextRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
