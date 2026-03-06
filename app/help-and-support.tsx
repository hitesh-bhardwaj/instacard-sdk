import { InstacardColors, useInstacardColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardsHeader } from '@/components/cards/cards-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { hapticLight } from '@/lib/haptics';
import { useThemeStore } from '@/hooks/use-theme-store';
import { useTranslation } from 'react-i18next';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolation,
    Easing,
} from 'react-native-reanimated';

interface FAQRowProps {
    id: string;
    isExpanded: boolean;
    onToggle: () => void;
}

function FAQRow({ id, isExpanded, onToggle }: FAQRowProps) {
    const colors = useInstacardColors();
    const { isDarkMode } = useThemeStore();
    const { t } = useTranslation();

    const animationProgress = useSharedValue(isExpanded ? 1 : 0);
    const measuredHeight = useSharedValue(0);

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
            [0, measuredHeight.value],
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

    const handleContentLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0) {
            measuredHeight.value = height;
        }
    };

    return (
        <Animated.View style={[rowStyles.container, { backgroundColor: colors.cardBackground }, containerStyle]}>
            <Pressable
                style={rowStyles.header}

                accessibilityRole="button"
                accessibilityLabel={t(`cards.help.faq.${id}.question`)}
            >
                <Text style={[rowStyles.question, { color: colors.textPrimary }]}>
                    {t(`cards.help.faq.${id}.question`)}
                </Text>
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
                <View onLayout={handleContentLayout} style={rowStyles.answerInner}>
                    <Text style={[rowStyles.answer, { color: colors.textSecondary }]}>
                        {t(`cards.help.faq.${id}.answer`)}
                    </Text>
                </View>
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
        overflow: 'hidden',
    },
    answerInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
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
    const { t } = useTranslation();

    const handleToggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <StatusBar style="light" />
            <CardsHeader
                subtitle={t('cards.header.helpSupport')}
                showHomeIcon={false}
            />

            <View style={[styles.content, { backgroundColor: colors.cardBackground }]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.headingText, { color: colors.textPrimary }]}>
                        {t('cards.helpTopics')}
                    </Text>

                    {['1', '2', '3', '4', '5'].map((id) => (
                        <FAQRow
                            key={id}
                            id={id}
                            isExpanded={expandedId === id}
                            onToggle={() => handleToggle(id)}
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
