import { InstacardColors } from "@/constants/colors";
import { AppFonts } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const bankDrawerStyles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  blurBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    borderColor: InstacardColors.border,
    borderWidth: 1,
  },
  handleIndicator: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: InstacardColors.border,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  close: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: `${InstacardColors.border}55`,
    alignItems: "center",
    justifyContent: "center",
  },

  list: {
    gap: 10,
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: InstacardColors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: InstacardColors.border,
    gap: 12,
  },
  bankRowSelected: {
    borderColor: InstacardColors.primary,
    backgroundColor: `${InstacardColors.primary}08`,
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${InstacardColors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  bankIconText: {
    fontSize: 18,
    fontFamily: AppFonts.bold,
    color: InstacardColors.primary,
  },
  bankText: {
    flex: 1,
    gap: 2,
  },
  bankTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  bankName: {
    flex: 1,
    fontSize: 15,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textPrimary,
  },
  bankSub: {
    fontSize: 12,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: InstacardColors.textPrimary,
  },
  radioOuterUnselected: {
    borderColor: InstacardColors.border,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: InstacardColors.orange,
  },

  balanceChip: {
    height: 28,
    borderRadius: 999,
    justifyContent: "center",
    overflow: "hidden",
  },
  balanceChipText: {
    fontSize: 12,
    fontFamily: AppFonts.regular,
    color: InstacardColors.textSecondary,
  },
  balanceChipTextRevealed: {
    position: "absolute",
    left: 0,
    right: 10,
    color: InstacardColors.textPrimary,
    fontFamily: AppFonts.medium,
  },

  addNewBtn: {
    marginTop: 2,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: InstacardColors.white,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: InstacardColors.border,
  },
  addNewText: {
    fontSize: 14,
    fontFamily: AppFonts.medium,
    color: InstacardColors.primary,
  },

  confirmBtn: {
    marginBottom: 16,
    backgroundColor: InstacardColors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: AppFonts.medium,
    color: InstacardColors.textOnPrimary,
  },
});
