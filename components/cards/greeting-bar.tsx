import { StyleSheet, Text, View } from 'react-native';

import { AnimatedToggle } from '@/components/ui/animated-toggle';
import { InstacardColors } from '@/constants/colors';

interface GreetingBarProps {
  userName: string;
  mode: 'virtual' | 'universal';
  onModeChange: (mode: 'virtual' | 'universal') => void;
}

export function GreetingBar({ userName, mode, onModeChange }: GreetingBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting} accessibilityRole="text">
        Hello, {userName}
      </Text>
      <AnimatedToggle value={mode} onChange={onModeChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  greeting: {
    fontSize: 16,
    color: InstacardColors.textPrimary,
  },
});
