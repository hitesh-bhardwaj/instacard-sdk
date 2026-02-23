import { InstacardColors } from '@/constants/colors';
import { AppFonts } from '@/constants/fonts';
import { hapticLight } from '@/lib/haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const COLLAPSED_HEIGHT = 40;
const EXPANDED_HEIGHT = 160;

const MESSAGE_SUGGESTIONS = [
  'Dinner 🍽️',
  'Rent',
  'Thanks',
  'Gift 🎁',
  'Coffee ☕',
  'Groceries 🛒',
  'Utilities',
  'Birthday 🎂',
];

export function MessageInput({ value, onChangeText }: MessageInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useSharedValue(COLLAPSED_HEIGHT);
  const opacity = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);

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

  const displayText = value.trim() ? value : '+ Add Message';
  const hasMessage = value.trim().length > 0;

  return (
    <View style={styles.messageSection}>
      <Animated.View style={[styles.messageContainer, containerStyle]}>
        {!isExpanded ? (
          <TouchableOpacity
            onPress={handleToggle}
            style={[styles.addMessageButton, hasMessage && styles.messageButtonWithText]}
            activeOpacity={0.7}
          >
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
              <Text style={styles.messageLabel}>Message</Text>
              <TouchableOpacity
                onPress={handleToggle}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={InstacardColors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Animated.View style={[styles.inputContainer, inputStyle]}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                placeholder="Enter message (optional)"
                placeholderTextColor={InstacardColors.textSecondary}
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
                {MESSAGE_SUGGESTIONS.map((suggestion) => (
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

const styles = StyleSheet.create({
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
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignSelf: 'center',
    maxWidth: '80%',
  },
  messageButtonWithText: {
    backgroundColor: '#F5F5F5',
  },
  addMessageText: {
    fontSize: 14,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  messageText: {
    color: InstacardColors.textPrimary,
  },
  expandedContainer: {
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
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
    color: InstacardColors.textSecondary,
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
    color: InstacardColors.textPrimary,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suggestionChipActive: {
    backgroundColor: InstacardColors.primary,
    borderColor: InstacardColors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  suggestionTextActive: {
    color: '#FFFFFF',
  },
});
