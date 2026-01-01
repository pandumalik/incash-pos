import React from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '../theme/colors';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    rightIcon,
    onRightIconPress,
    multiline,
    keyboardType,
    containerStyle,
    style,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.wrapper}>
            {label && <Text variant="label">{label}</Text>}
            <View style={[
                styles.container,
                { backgroundColor: colors.inputBackground, borderColor: colors.border },
                multiline && styles.multiline,
                containerStyle
            ]}>
                {icon && (
                    <Ionicons name={icon} size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
                )}
                <TextInput
                    style={[styles.input, { color: colors.textPrimary }, style]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    multiline={multiline}
                    keyboardType={keyboardType}
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress}>
                        <Ionicons name={rightIcon} size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.m,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s + 4, // 12px
        minHeight: 48,
    },
    multiline: {
        alignItems: 'flex-start',
        height: 100,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
});
