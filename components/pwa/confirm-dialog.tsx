import { useRouter } from 'expo-router';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import { Home, LogOut, X } from 'lucide-react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ visible, title, message, onCancel, onConfirm }: ConfirmDialogProps) {
  const router = useRouter();

  if (!visible) return null;

  const handleHome = () => {
    hapticLight();
    onConfirm();
    router.replace('/');
  };

  const handleInstacard = () => {
    hapticLight();
    onConfirm();
    router.replace('/cards');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={dialogStyles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          style={dialogStyles.container}
          activeOpacity={1}
          onPress={() => { }}
        >
          <TouchableOpacity
            style={dialogStyles.closeButton}
            onPress={onCancel}
          >
            <X width={20} height={20} color={InstacardColors.textSecondary} />
          </TouchableOpacity>

          <Text style={dialogStyles.title}>{message}</Text>

          <View style={dialogStyles.buttonRow}>
            <TouchableOpacity
              style={dialogStyles.optionButton}
              onPress={handleInstacard}
              accessibilityRole="button"
              accessibilityLabel="Go to Instacard"
            >
              <Text style={dialogStyles.optionText}>Instacard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={dialogStyles.optionButton}
              onPress={handleHome}
              accessibilityRole="button"
              accessibilityLabel="Go to Home"
            >
              <Text style={dialogStyles.optionText}>Home</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const dialogStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: InstacardColors.white,
    borderRadius: 24,
    padding: 24,
    paddingTop: 40,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    paddingHorizontal: 32,
    // fontWeight: '700',
    color: InstacardColors.textPrimary,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  optionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: InstacardColors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: InstacardColors.white,
  },
});