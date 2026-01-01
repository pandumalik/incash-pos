import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const Text = ({ style, variant = 'body', color, children, ...props }) => {
    const { colors } = useTheme();

    const getTextColor = () => {
        if (color) return color;
        if (variant === 'caption') return colors.textSecondary;
        return colors.textPrimary;
    };

    const textStyles = [
        styles[variant],
        { color: getTextColor() },
        style
    ];
    return <RNText style={textStyles} {...props}>{children}</RNText>;
};

const styles = StyleSheet.create({
    h1: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    h2: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 6,
    },
    h3: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    body: {
        fontSize: 16,
        lineHeight: 22,
    },
    caption: {
        fontSize: 14,
        lineHeight: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
    }
});
