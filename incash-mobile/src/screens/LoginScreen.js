import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';
import { spacing } from '../theme/colors';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeContext';

export default function LoginScreen() {
    const { login } = useStore();
    const { colors, theme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        // Mock Delay
        setTimeout(() => {
            // Simple logic: admin/admin or cashier/cashier
            if (username.toLowerCase() === 'admin') {
                login({ name: 'Admin User', id: 'ADM-001', role: 'admin' });
            } else if (username.toLowerCase() === 'cashier') {
                login({ name: 'Jane Cashier', id: 'CSH-002', role: 'cashier' });
            } else {
                alert('Invalid credentials. Try admin or cashier.');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={theme === 'dark' ? require('../../assets/logo-dark.png') : require('../../assets/logo-light.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Username"
                        placeholder="Enter username"
                        icon="person-outline"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <Input
                        label="Password"
                        placeholder="Enter password"
                        icon="lock-closed-outline"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        style={{ marginTop: spacing.m }}
                    />

                    <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
                        Hint: Use 'admin' or 'cashier'
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: spacing.l,
        justifyContent: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },

    form: {
        width: '100%',
    },
    logoContainer: {
        width: 300,
        height: 100,
        marginBottom: 20,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 300,
        height: 100,
        transform: [{ scale: 1.25 }],
    }
});
