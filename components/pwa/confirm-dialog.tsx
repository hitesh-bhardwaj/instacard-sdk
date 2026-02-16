import { useRouter } from 'expo-router';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InstacardColors } from '@/constants/colors';
import { hapticLight } from '@/lib/haptics';
import { CreditCard, Plus, AlertCircle, Home, StepBack, ArrowLeft, LogOut } from 'lucide-react-native';

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
          onPress={() => {}}
        >
          {/* Warning Icon */}
          {/* <View style={dialogStyles.warningIconWrap}> */}
            <AlertCircle style={{marginBottom: 16}} width={32} height={32} color={InstacardColors.primary} />
          {/* </View> */}
          
          <Text style={dialogStyles.title}>Wait!</Text>
          <Text style={dialogStyles.message}>{message}</Text>
          
          <View style={dialogStyles.divider} />
          
          <Text style={dialogStyles.subtitle}>Where would you like to go?</Text>
          
          <View style={dialogStyles.buttonRow}>
            <TouchableOpacity
              style={dialogStyles.optionButton}
              onPress={handleInstacard}
              accessibilityRole="button"
              accessibilityLabel="Add more cards"
            >
              <View style={dialogStyles.optionIconWrap}>
                <LogOut width={28} height={28} color={InstacardColors.white} strokeWidth={2} />
              </View>
              <Text style={dialogStyles.optionText}>Instacard</Text>
              <Text style={dialogStyles.optionSubtext}>Exit To Instacard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={dialogStyles.optionButton}
              onPress={handleHome}
              accessibilityRole="button"
              accessibilityLabel="View your cards"
            >
              <View style={dialogStyles.optionIconWrap}>
                <Home width={26} height={26} color={InstacardColors.white} strokeWidth={2} />
              </View>
              <Text style={dialogStyles.optionText}>Home</Text>
              <Text style={dialogStyles.optionSubtext}>Back To Home</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={dialogStyles.cancelButton}
            onPress={onCancel}
          >
            <Text style={dialogStyles.cancelText}>Stay here</Text>
          </TouchableOpacity>
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
    borderRadius: 28,
    padding: 24,
    paddingTop: 32,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  warningIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${InstacardColors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: InstacardColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 15,
    color: InstacardColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: InstacardColors.lightGray,
    borderRadius: 2,
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 14,
    color: InstacardColors.textSecondary,
    marginBottom: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  optionButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: `${InstacardColors.primary}08`,
    borderWidth: 1.5,
    borderColor: `${InstacardColors.primary}20`,
  },
  optionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: InstacardColors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: InstacardColors.textPrimary,
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 12,
    color: InstacardColors.textSecondary,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 16,
    color: InstacardColors.error,
    fontWeight: '600',
  },
});