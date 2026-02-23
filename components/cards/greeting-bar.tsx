import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';

interface GreetingBarProps {
  userName: string;
  onSearchPress?: () => void;
  onHelpPress?: () => void;
  onAvatarPress?: () => void;
  isDarkMode?: boolean;
}

export function GreetingBar({
  userName,
  onSearchPress,
  onHelpPress,
  onAvatarPress,
  isDarkMode,
}: GreetingBarProps) {

  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, { color: isDarkMode ? InstacardColors.white : InstacardColors.textPrimary }]} accessibilityRole="text">
        Hello, {userName}
      </Text>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            hapticLight();
            onSearchPress?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <IconSymbol
            name="magnifyingglass"
            size={27}
            color={isDarkMode ? InstacardColors.white : InstacardColors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            hapticLight();
            onHelpPress?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Help"
        >
          <IconSymbol
            name="questionmark.circle"
            size={27}
            color={isDarkMode ? InstacardColors.white : InstacardColors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => {
            hapticLight();
            onAvatarPress?.();
          }}
        >
          <Image
            source={require('@/assets/images/profile.png')}
            style={styles.avatarImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 0,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 16,
    color: InstacardColors.textPrimary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    padding: 4,
  },
  avatarButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
