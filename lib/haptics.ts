/**
 * Haptic feedback utilities using expo-haptics
 * Provides consistent haptic feedback across the app
 */

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/** Light tap - for buttons, tabs, selections */
export function hapticLight() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

/** Medium tap - for toggles, significant actions */
export function hapticMedium() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

/** Heavy tap - for destructive actions, confirmations */
export function hapticHeavy() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}

/** Selection feedback - for picker/checkbox changes */
export function hapticSelection() {
  if (Platform.OS !== "web") {
    Haptics.selectionAsync();
  }
}

/** Success notification */
export function hapticSuccess() {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

/** Warning notification */
export function hapticWarning() {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}

/** Error notification */
export function hapticError() {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}
