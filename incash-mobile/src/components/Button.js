import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors as staticColors, spacing } from '../theme/colors'; // Keep spacing
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export const Button = ({
    title,
    onPress,
    variant = 'primary', // primary, secondary, outline, ghost, danger
    size = 'large', // large, small
    icon,
    loading = false,
    style,
    disabled
}) => {
    const { colors } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return colors.textSecondary;
        if (variant === 'primary') return colors.primary;
        if (variant === 'secondary') return colors.secondary;
        if (variant === 'outline') return 'transparent';
        if (variant === 'ghost') return 'transparent';
        if (variant === 'danger') return colors.danger;
        return colors.primary;
    };

    const getTextColor = () => {
        if (variant === 'outline' || variant === 'ghost') return colors.primary;
        return colors.textLight;
    };

    const containerStyles = [
        styles.container,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && { borderWidth: 1, borderColor: colors.primary },
        size === 'small' && styles.small,
        style,
    ];

    return (
        <TouchableOpacity
            style={containerStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon && <Ionicons name={icon} size={20} color={getTextColor()} style={{ marginRight: 8 }} />}
                    <Text style={{ color: getTextColor(), fontWeight: '600' }}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        borderRadius: 12,
    },
    small: {
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
    }
});
