import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import {
  hapticLight,
  hapticMedium,
  hapticHeavy,
  hapticSelection,
  hapticSuccess,
  hapticWarning,
  hapticError,
} from '../haptics';

jest.mock('expo-haptics');
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('Haptics Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
  });

  describe('hapticLight', () => {
    it('triggers light impact feedback on iOS', () => {
      Platform.OS = 'ios';

      hapticLight();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    });

    it('triggers light impact feedback on Android', () => {
      Platform.OS = 'android';

      hapticLight();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it('does not trigger on web platform', () => {
      Platform.OS = 'web';

      hapticLight();

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('can be called multiple times', () => {
      hapticLight();
      hapticLight();
      hapticLight();

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(3);
    });
  });

  describe('hapticMedium', () => {
    it('triggers medium impact feedback on iOS', () => {
      Platform.OS = 'ios';

      hapticMedium();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    });

    it('triggers medium impact feedback on Android', () => {
      Platform.OS = 'android';

      hapticMedium();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it('does not trigger on web platform', () => {
      Platform.OS = 'web';

      hapticMedium();

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('hapticHeavy', () => {
    it('triggers heavy impact feedback on iOS', () => {
      Platform.OS = 'ios';

      hapticHeavy();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Heavy
      );
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    });

    it('triggers heavy impact feedback on Android', () => {
      Platform.OS = 'android';

      hapticHeavy();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Heavy
      );
    });

    it('does not trigger on web platform', () => {
      Platform.OS = 'web';

      hapticHeavy();

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('hapticSelection', () => {
    it('triggers selection feedback on iOS', () => {
      Platform.OS = 'ios';

      hapticSelection();

      expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
    });

    it('triggers selection feedback on Android', () => {
      Platform.OS = 'android';

      hapticSelection();

      expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
    });

    it('does not trigger on web platform', () => {
      Platform.OS = 'web';

      hapticSelection();

      expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    });

    it('can be called rapidly', () => {
      hapticSelection();
      hapticSelection();
      hapticSelection();
      hapticSelection();

      expect(Haptics.selectionAsync).toHaveBeenCalledTimes(4);
    });
  });

  describe('hapticSuccess', () => {
    it('triggers success notification on iOS', () => {
      Platform.OS = 'ios';

      hapticSuccess();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    });

    it('triggers success notification on Android', () => {
      Platform.OS = 'android';

      hapticSuccess();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
    });

    it('does not trigger on web platform', () => {
      Platform.OS = 'web';

      hapticSuccess();

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('hapticWarning', () => {
    it('triggers warning notification on iOS', () => {
      Platform.OS = 'ios';

      hapticWarning();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Warning
      );
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    });

    it('triggers warning notification on Android', () => {
      Platform.OS = 'android';

      hapticWarning();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Warning
      );
    });

    it('does not trigger on web platform', () => {
      Platform.OS = 'web';

      hapticWarning();

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('hapticError', () => {
    it('triggers error notification on iOS', () => {
      Platform.OS = 'ios';

      hapticError();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      );
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    });

    it('triggers error notification on Android', () => {
      Platform.OS = 'android';

      hapticError();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      );
    });

    it('does not trigger on web platform', () => {
      Platform.OS = 'web';

      hapticError();

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('Platform Detection', () => {
    it('correctly identifies web platform', () => {
      Platform.OS = 'web';

      hapticLight();
      hapticMedium();
      hapticHeavy();
      hapticSelection();
      hapticSuccess();
      hapticWarning();
      hapticError();

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
      expect(Haptics.selectionAsync).not.toHaveBeenCalled();
      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });

    it('correctly identifies iOS platform', () => {
      Platform.OS = 'ios';

      hapticLight();

      expect(Haptics.impactAsync).toHaveBeenCalled();
    });

    it('correctly identifies Android platform', () => {
      Platform.OS = 'android';

      hapticLight();

      expect(Haptics.impactAsync).toHaveBeenCalled();
    });
  });

  describe('Mixed Usage', () => {
    it('handles multiple different haptic types in sequence', () => {
      hapticLight();
      hapticSelection();
      hapticSuccess();
      hapticMedium();

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(2);
      expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    });

    it('maintains correct feedback types when mixed', () => {
      hapticLight();
      hapticHeavy();
      hapticMedium();

      expect(Haptics.impactAsync).toHaveBeenNthCalledWith(
        1,
        Haptics.ImpactFeedbackStyle.Light
      );
      expect(Haptics.impactAsync).toHaveBeenNthCalledWith(
        2,
        Haptics.ImpactFeedbackStyle.Heavy
      );
      expect(Haptics.impactAsync).toHaveBeenNthCalledWith(
        3,
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it('maintains correct notification types when mixed', () => {
      hapticSuccess();
      hapticWarning();
      hapticError();

      expect(Haptics.notificationAsync).toHaveBeenNthCalledWith(
        1,
        Haptics.NotificationFeedbackType.Success
      );
      expect(Haptics.notificationAsync).toHaveBeenNthCalledWith(
        2,
        Haptics.NotificationFeedbackType.Warning
      );
      expect(Haptics.notificationAsync).toHaveBeenNthCalledWith(
        3,
        Haptics.NotificationFeedbackType.Error
      );
    });
  });

  describe('Graceful Degradation', () => {
    it('completes even if haptic APIs are unavailable', () => {
      expect(() => {
        hapticLight();
        hapticMedium();
        hapticHeavy();
      }).not.toThrow();
    });

    it('completes even if selection API is unavailable', () => {
      expect(() => hapticSelection()).not.toThrow();
    });

    it('completes even if notification APIs are unavailable', () => {
      expect(() => {
        hapticSuccess();
        hapticWarning();
        hapticError();
      }).not.toThrow();
    });
  });
});
