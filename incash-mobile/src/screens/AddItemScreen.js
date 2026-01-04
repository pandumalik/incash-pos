import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../context/StoreContext';
import { spacing } from '../theme/colors';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ScannerModal } from '../components/ScannerModal';
import { CATEGORIES } from '../constants/mockData';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';

export default function AddItemScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { addToInventory, updateInventoryItem } = useStore();
    const { colors } = useTheme();


    const editingItem = route.params?.item;
    const isEditMode = !!editingItem;

    const [showScanner, setShowScanner] = useState(false);
    const [form, setForm] = useState({
        name: '',
        sku: '',
        barcode: '',
        description: '',
        category: 'Electronics',
        stock: '1',
        price: '',
        cost: '',
        image: null,
    });

    useEffect(() => {
        if (editingItem) {
            setForm({
                ...editingItem,
                stock: editingItem.stock.toString(),
                price: editingItem.price.toString(),
                cost: editingItem.cost ? editingItem.cost.toString() : '',
                image: editingItem.image
            });
            navigation.setOptions({ title: 'Edit Item' });
        }
    }, [editingItem]);

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({ ...form, image: result.assets[0].uri });
        }
    };

    const handleScan = ({ data }) => {
        setShowScanner(false);
        setForm(prev => ({
            ...prev,
            barcode: data,
            sku: prev.sku || data.substring(0, 6)
        }));
    };

    const handleSave = () => {
        if (!form.name || !form.price) {
            Alert.alert('Error', 'Name and Price are required');
            return;
        }

        const itemData = {
            ...form,
            stock: parseInt(form.stock) || 0,
            price: parseFloat(form.price) || 0,
            cost: parseFloat(form.cost) || 0,
            image: form.image || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400'
        };

        if (isEditMode) {
            updateInventoryItem(editingItem.id, itemData);
            Alert.alert('Success', 'Item updated successfully');
        } else {
            addToInventory(itemData);
            Alert.alert('Success', 'Item added successfully');
        }

        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={100}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    <Text variant="h1" style={{ marginBottom: spacing.m }}>
                        {isEditMode ? 'Edit Item' : 'Add New Item'}
                    </Text>


                    <TouchableOpacity style={[styles.photoUpload, { backgroundColor: colors.border, borderColor: colors.border }]} onPress={pickImage}>
                        {form.image ? (
                            <Image source={{ uri: form.image }} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                        ) : (
                            <>
                                <View style={[styles.photoIcon, { backgroundColor: colors.surface }]}>
                                    <Ionicons name="camera" size={24} color={colors.primary} />
                                </View>
                                <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Add Photo</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Input
                        label="Item Code / Barcode"
                        placeholder="Scan or enter code"
                        value={form.barcode || form.sku}
                        onChangeText={(t) => setForm({ ...form, barcode: t })}
                        rightIcon="qr-code-outline"
                        onRightIconPress={() => setShowScanner(true)}
                    />

                    <Input
                        label="Item Name"
                        placeholder="e.g. Wireless Headphones"
                        value={form.name}
                        onChangeText={(t) => setForm({ ...form, name: t })}
                    />

                    <Input
                        label="Description"
                        placeholder="Add details..."
                        multiline
                        value={form.description}
                        onChangeText={(t) => setForm({ ...form, description: t })}
                    />

                    <Text variant="label" style={{ marginBottom: 8 }}>Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
                        {CATEGORIES.filter(c => c !== 'All').map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    { backgroundColor: form.category === cat ? colors.primary : colors.border },
                                    form.category === cat && styles.chipActive
                                ]}
                                onPress={() => setForm({ ...form, category: cat })}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: form.category === cat ? '#FFF' : colors.textPrimary },
                                        form.category === cat && styles.chipTextActive
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text variant="h3" style={{ marginTop: spacing.l }}>Stock Quantity</Text>
                    <View style={[styles.stockControl, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Current Stock</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={[styles.qtyBtn, { backgroundColor: colors.background }]}
                                onPress={() => setForm({ ...form, stock: Math.max(0, parseInt(form.stock || 0) - 1).toString() })}
                            >
                                <Ionicons name="remove" size={20} color={colors.textPrimary} />
                            </TouchableOpacity>
                            <Text style={{ width: 40, textAlign: 'center', fontSize: 18, fontWeight: '600' }}>
                                {form.stock}
                            </Text>
                            <TouchableOpacity
                                style={[styles.qtyBtn, { backgroundColor: colors.primary }]}
                                onPress={() => setForm({ ...form, stock: (parseInt(form.stock || 0) + 1).toString() })}
                            >
                                <Ionicons name="add" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text variant="h3" style={{ marginTop: spacing.l, marginBottom: spacing.m }}>Pricing Details</Text>
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: spacing.s }}>
                            <Input
                                label="Purchase Price (Cost)"
                                placeholder="0.00"
                                keyboardType="numeric"
                                icon="cash-outline"
                                value={form.cost}
                                onChangeText={(t) => setForm({ ...form, cost: t })}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: spacing.s }}>
                            <Input
                                label="Selling Price"
                                placeholder="0.00"
                                keyboardType="numeric"
                                icon="cash-outline"
                                value={form.price}
                                onChangeText={(t) => setForm({ ...form, price: t })}
                            />
                        </View>
                    </View>


                    <View style={{ height: 100 }} />

                </ScrollView>

                <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                    <Button
                        title={isEditMode ? "Update Item" : "Save Item"}
                        onPress={handleSave}
                        icon="save-outline"
                    />
                </View>
            </KeyboardAvoidingView>

            <ScannerModal
                visible={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleScan}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.m,
    },
    photoUpload: {
        height: 150,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.l,
        overflow: 'hidden'
    },
    photoIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    catRow: {
        flexDirection: 'row',
        marginBottom: spacing.m,
    },
    chip: {
        paddingHorizontal: spacing.l,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: spacing.s,
    },
    chipActive: {

    },
    chipText: {
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#FFF',
    },
    stockControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: spacing.s,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        marginTop: 0,
        borderRadius: 8, // Square-ish
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        padding: spacing.m,
        borderTopWidth: 1,
    }
});
