import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticLight } from '@/lib/haptics';
import { Ionicons } from '@expo/vector-icons';
import { PlusIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const COLLAPSED_HEIGHT = 40;
const EXPANDED_HEIGHT = 160;

export function MessageInput({ value, onChangeText }: MessageInputProps) {
  const colors = useInstacardColors();
  const styles = createStyles(colors);
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useSharedValue(COLLAPSED_HEIGHT);
  const opacity = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  const collapse = () => {
    setIsExpanded(false);
    opacity.value = withTiming(0, { duration: 200, easing: Easing.linear });
    height.value = withTiming(COLLAPSED_HEIGHT, {
      duration: 200,
      easing: Easing.linear,
    });
    Keyboard.dismiss();
  };

  const handleToggle = () => {
    hapticLight();
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    if (newExpanded) {
      height.value = withTiming(EXPANDED_HEIGHT, {
        duration: 200,
        easing: Easing.linear,
      });
      opacity.value = withTiming(1, { duration: 200, easing: Easing.linear });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      collapse();
    }
  };

  const handleSubmitEditing = () => {
    hapticLight();
    collapse();
  };

  const handleSuggestionPress = (suggestion: string) => {
    hapticLight();
    onChangeText(suggestion);
  };

  const containerStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const displayText = value.trim() ? value : t('cards.message.addMessage');
  const hasMessage = value.trim().length > 0;

  const suggestions = [
    t('cards.message.suggestions.dinner'),
    t('cards.message.suggestions.rent'),
    t('cards.message.suggestions.thanks'),
    t('cards.message.suggestions.gift'),
    t('cards.message.suggestions.coffee'),
    t('cards.message.suggestions.groceries'),
    t('cards.message.suggestions.utilities'),
    t('cards.message.suggestions.birthday'),
  ];

  return (
    <View style={styles.messageSection}>
      <Animated.View style={[styles.messageContainer, containerStyle]}>
        {!isExpanded ? (
          <TouchableOpacity
            onPress={handleToggle}
            style={[styles.addMessageButton, hasMessage && styles.messageButtonWithText]}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <PlusIcon width={14} height={14} color={colors.textSecondary} />
            </View>
            <Text
              style={[styles.addMessageText, hasMessage && styles.messageText]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayText}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.expandedContainer}>
            <View style={styles.expandedHeader}>
              <Text style={styles.messageLabel}>{t('cards.message.label')}</Text>
              <TouchableOpacity
                onPress={handleToggle}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Animated.View style={[styles.inputContainer, inputStyle]}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                placeholder={t('cards.message.placeholder')}
                placeholderTextColor={colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                multiline
                maxLength={100}
                blurOnSubmit
                onSubmitEditing={handleSubmitEditing}
                returnKeyType="done"
              />
            </Animated.View>
            <Animated.View style={[styles.suggestionsContainer, inputStyle]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsContent}
              >
                {suggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={[
                      styles.suggestionChip,
                      value === suggestion && styles.suggestionChipActive,
                    ]}
                    onPress={() => handleSuggestionPress(suggestion)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.suggestionText,
                        value === suggestion && styles.suggestionTextActive,
                      ]}
                    >
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: typeof InstacardColors) => StyleSheet.create({
  messageSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  messageContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  addMessageButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center',
    maxWidth: '80%',
  },
  messageButtonWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMessageText: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  messageText: {
    color: colors.textPrimary,
  },
  expandedContainer: {
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 12,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageLabel: {
    fontSize: 12,
    fontFamily: AppFonts.medium,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    height: 50,
  },
  textInput: {
    height: '100%',
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsContent: {
    gap: 8,
    paddingRight: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: AppFonts.regular,
    color: colors.textSecondary,
  },
  suggestionTextActive: {
    color: colors.white,
  },
});
