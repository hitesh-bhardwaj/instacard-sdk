import { IconSymbol } from '@/components/ui/icon-symbol'
import { InstacardColors } from '@/constants/colors'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { useEffect, useMemo, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface FAQData {
    heading: string;
    bulletPoints: string[];
}

const DEFAULT_FAQ_DATA: FAQData = {
    heading: 'Link to a Physical Universal or Sigma Instacard',
    bulletPoints: [
        'You can purchase a Universal Card or a Sigma card from your Bank or any Agent, Marketplace or order online.',
        'Universal Card or Sigma Card offer unified card experience such that you can link any Virtual Instacard to them to start using the virtual Instacard on any POS/ATM through the linked Universal or Sigma Instacard.',
        'Sigma Card is a physical card variant of Instacard that is issued by a Bank/ FinTech to allow users to link any Virtual Instacard issued by them for making Domestic as well as International payments.',
        'Universal Card is another physical card variant of Instacard that users can link any virtual Instacard issued by any Bank/ FinTech in your country for making Domestic Payments through a single Physical Card.',
        'You can simply link any one Virtual Instacard to a Universal or Sigma Cards to start using the linked Virtual Instacard from the physical card. When you link a new Virtual Instacard to a Universal or Sigma card, previously linked Virtual Instacard is de-linked and you can start using the newly linked Virtual Card from the physical Universal / Sigma card.',
    ],
}

interface FAQModalProps {
    visible: boolean;
    onClose: () => void;
    data?: FAQData;
}

export default function FAQModal({ visible, onClose, data = DEFAULT_FAQ_DATA }: FAQModalProps) {
    const sheetRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ['75%'], [])

    useEffect(() => {
        if (visible) {
            sheetRef.current?.present()
        } else {
            sheetRef.current?.dismiss()
        }
    }, [visible])

    return (
        <BottomSheetModal
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            enableDismissOnClose
            handleIndicatorStyle={styles.handleIndicator}
            backgroundStyle={styles.sheetBackground}
            backdropComponent={() => null}
            onDismiss={onClose}
        >
            <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.iconContainer}>
                            <IconSymbol name="creditcard" size={30} color={InstacardColors.textPrimary} />
                        </View>
                        <Text style={styles.headerTitle}>
                            Link to a Physical <Text style={styles.highlightText}>Universal</Text> or <Text style={styles.highlightText}>Sigma</Text> Instacard
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close">
                        <IconSymbol name="xmark" size={20} color={InstacardColors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Bullet Points */}
                <View style={styles.bulletContainer}>
                    {data.bulletPoints.map((point: string, index: number) => (
                        <View key={index} style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>{point}</Text>
                        </View>
                    ))}
                </View>
            </BottomSheetScrollView>
        </BottomSheetModal>
    )
}


const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: InstacardColors.white,
        borderColor: InstacardColors.border,
        borderWidth: 1,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    handleIndicator: {
        width: 42,
        height: 5,
        borderRadius: 3,
        backgroundColor: InstacardColors.border,
    },
    sheetContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 25,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '400',
        color: InstacardColors.textPrimary,
        flex: 1,
        lineHeight: 20,
    },
    highlightText: {
        color: InstacardColors.shadow,
        fontWeight: '700',
    },
    closeButton: {
        width: 32,
        height: 32,
        fontWeight:600,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: InstacardColors.border,
        marginVertical: 16,
    },
    bulletContainer: {
        gap: 20,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    bulletDot: {
        fontSize: 22,
        color: InstacardColors.textPrimary,
        lineHeight: 22,
    },
    bulletText: {
        fontSize: 14,
        color: InstacardColors.textPrimary,
        lineHeight: 16,
        flex: 1,
    },
})