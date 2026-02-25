import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardsHeader } from '@/components/cards/cards-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { hapticLight } from '@/lib/haptics';
import { useThemeStore } from '@/hooks/use-theme-store';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolation,
    Easing,
} from 'react-native-reanimated';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: '1',
        question: 'How do I add a new card?',
        answer: 'To add a new card, tap the "+" button on the cards screen. You can then choose to add a virtual or physical card by following the on-screen instructions.',
    },
    {
        id: '2',
        question: 'How do I view my card details?',
        answer: 'Tap on any card in your wallet to view its details. You can see the card number, expiry date, and CVV by authenticating with your biometrics or PIN.',
    },
    {
        id: '3',
        question: 'Is my card information secure?',
        answer: 'Yes, all your card information is encrypted and stored securely. We use industry-standard encryption and never store your full card details on our servers.',
    },
    {
        id: '4',
        question: 'How do I make a payment?',
        answer: 'You can make payments by selecting a card and tapping the "Pay" button. You can also use QR code scanning for quick payments at supported merchants.',
    },
    {
        id: '5',
        question: 'How do I contact support?',
        answer: 'You can reach our support team by emailing support@instacard.com or calling our 24/7 helpline at 1-800-INSTACARD.',
    },
];

interface FAQRowProps {
    item: FAQItem;
    isExpanded: boolean;
    onToggle: () => void;
}

function FAQRow({ item, isExpanded, onToggle }: FAQRowProps) {
    const colors = useInstacardColors();
    const { isDarkMode } = useThemeStore();

    const animationProgress = useSharedValue(isExpanded ? 1 : 0);
    const contentHeight = useSharedValue(0);

    // Update animation when isExpanded changes
    React.useEffect(() => {
        animationProgress.value = withTiming(isExpanded ? 1 : 0, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
        });
    }, [isExpanded]);

    const chevronStyle = useAnimatedStyle(() => {
        const rotation = interpolate(
            animationProgress.value,
            [0, 1],
            [0, 180],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ rotate: `${rotation}deg` }],
        };
    });

    const contentStyle = useAnimatedStyle(() => {
        const height = interpolate(
            animationProgress.value,
            [0, 1],
            [0, 80],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            animationProgress.value,
            [0, 0.5, 1],
            [0, 0, 1],
            Extrapolation.CLAMP
        );
        return {
            height,
            opacity,
            overflow: 'hidden',
        };
    });

    const containerStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            animationProgress.value,
            [0, 1],
            [1, 1],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ scale }],
        };
    });

    return (
        <Animated.View style={[rowStyles.container, { backgroundColor: colors.cardBackground }, containerStyle]}>
            <Pressable
                style={rowStyles.header}

                accessibilityRole="button"
                accessibilityLabel={item.question}
            >
                <Text style={[rowStyles.question, { color: colors.textPrimary }]}>{item.question}</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={() => {
                    hapticLight();
                    onToggle();
                }}>
                    <Animated.View style={chevronStyle}>
                        <ChevronDown size={18} color={colors.textSecondary} />
                    </Animated.View>
                </TouchableOpacity>
            </Pressable>
            <Animated.View style={[rowStyles.answerContainer, contentStyle]}>
                <Text style={[rowStyles.answer, { color: colors.textSecondary }]}>{item.answer}</Text>
            </Animated.View>
        </Animated.View>
    );
}

import React from 'react';

const rowStyles = StyleSheet.create({
    container: {
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: InstacardColors.border,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,

        paddingHorizontal: 20,
        gap: 14,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    question: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    answerContainer: {
        paddingHorizontal: 16,
        paddingLeft: 16,
    },
    answer: {
        fontSize: 14,
        lineHeight: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
});

export default function HelpAndSupportScreen() {
    const insets = useSafeAreaInsets();
    const colors = useInstacardColors();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <StatusBar style="light" />
            <CardsHeader
                subtitle={'Help & Support'}
                showHomeIcon={false}
            />

            <View style={[styles.content, { backgroundColor: colors.cardBackground }]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.headingText, { color: colors.textPrimary }]}>Help Topics</Text>

                    {FAQ_DATA.map((item) => (
                        <FAQRow
                            key={item.id}
                            item={item}
                            isExpanded={expandedId === item.id}
                            onToggle={() => handleToggle(item.id)}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: -16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    headingText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
        marginBottom: 24,
    },
});
