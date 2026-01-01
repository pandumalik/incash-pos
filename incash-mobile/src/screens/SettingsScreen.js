import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../theme/ThemeContext';
import { spacing, shadows } from '../theme/colors';
import { Text } from '../components/Text';
import { Button } from '../components/Button';

export default function SettingsScreen() {
    const { user, logout } = useStore();
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.content}>

                <View>
                    <Text variant="h1" style={{ marginBottom: 20 }}>Settings</Text>

                    {/* Profile Photo Placeholder */}
                    <View style={styles.profileHeader}>
                        <View style={[styles.photoPlaceholder, { borderColor: colors.primary, backgroundColor: isDark ? '#333' : '#E1F5FE' }]}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primary }}>
                                {user?.name ? user.name.charAt(0) : 'U'}
                            </Text>
                        </View>
                        <View>
                            <Text variant="h2">{user?.name || 'Guest'}</Text>
                            <Text variant="caption">ID: {user?.id || '--'}</Text>
                        </View>
                    </View>

                    {user && (
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            <Text variant="label" style={{ marginBottom: 12 }}>Session Details</Text>

                            <View style={styles.row}>
                                <Text color={colors.textSecondary}>Role</Text>
                                <Text style={{ textTransform: 'capitalize' }}>{user.role}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text color={colors.textSecondary}>Last Login</Text>
                                <Text>{new Date(user.lastLogin).toLocaleString()}</Text>
                            </View>
                        </View>
                    )}

                    <View style={[styles.card, { backgroundColor: colors.surface, marginTop: 20 }]}>
                        <View style={[styles.row, { marginBottom: 0, alignItems: 'center' }]}>
                            <Text>Dark Mode</Text>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={"#f4f3f4"}
                            />
                        </View>
                    </View>
                </View>

                <View>
                    <Text style={{ marginBottom: 20, textAlign: 'center', color: colors.textSecondary }}>v1.0.2 (Rev 12)</Text>
                    <Button
                        title="Log Out"
                        variant="danger"
                        onPress={logout}
                        icon="log-out-outline"
                    />
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1, // Full height
        padding: spacing.m,
        justifyContent: 'space-between', // Push logout to bottom
        paddingBottom: spacing.xl,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    photoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20, // Rounded Rect
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
        borderWidth: 1,
    },
    card: {
        borderRadius: 12,
        padding: spacing.m,
        ...shadows.light
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    }
});
