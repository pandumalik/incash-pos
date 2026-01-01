import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { spacing } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export const ScannerModal = ({ visible, onClose, onScan, title = 'Scan Barcode' }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const { colors } = useTheme();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) return;
        setScanned(true);
        // Vibrate or sound could go here
        onScan({ type, data });
        // Reset scanned after delay or keep it true until close? 
        // Usually close immediately or wait.
        setTimeout(() => setScanned(false), 2000);
    };

    if (!visible) return null;

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return (
            <Modal visible={visible} animationType="slide">
                <View style={[styles.center, { backgroundColor: colors.background }]}>
                    <Text>No access to camera</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text color={colors.primary}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "ean8", "upc_e", "code128"],
                    }}
                />

                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeCircle}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.scanAreaContainer}>
                        <View style={[styles.scanArea, { borderColor: colors.primary }]} />
                        <Text style={styles.hint}>Align code within frame</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.l,
        paddingTop: 50,
        alignItems: 'center',
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    closeCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanAreaContainer: {
        alignItems: 'center',
        marginBottom: 100,
    },
    scanArea: {
        width: SCAN_SIZE,
        height: SCAN_SIZE,
        borderWidth: 2,
        backgroundColor: 'transparent',
        borderRadius: 12,
    },
    hint: {
        color: '#FFF',
        marginTop: spacing.m,
        fontSize: 16,
    },
    closeBtn: {
        marginTop: 20,
        padding: 10,
    }
});
