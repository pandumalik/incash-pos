import React from 'react';
import { View, ScrollView, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../context/StoreContext';
import { spacing, shadows } from '../theme/colors';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function ItemDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { inventory, addToCart } = useStore();
    const { colors } = useTheme();
    const item = inventory.find(i => i.id === route.params?.itemId);

    if (!item) return <View><Text>Item not found</Text></View>;

    const handleAddToSale = () => {
        addToCart(item);
        Alert.alert('Success', 'Added to cart!');
        // Optionally navigate to Cashier
        // navigation.navigate('Cashier');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView>
                <Image source={{ uri: item.image }} style={[styles.heroImage, { backgroundColor: colors.surface }]} />

                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text variant="h1">{item.name}</Text>
                            <Text variant="caption">SKU: #{item.sku}</Text>
                        </View>
                        <View style={styles.stockBadge}>
                            <View style={styles.dot} />
                            <Text style={styles.badgeText}>{item.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                            <Ionicons name="cube-outline" size={20} color={colors.primary} />
                            <Text variant="caption" style={{ marginTop: 4 }}>Stock Level</Text>
                            <Text variant="h2">{item.stock}</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                            <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                            <Text variant="caption" style={{ marginTop: 4 }}>Selling</Text>
                            <Text variant="h2" color={colors.primary}>${item.price.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                            <Ionicons name="bag-handle-outline" size={20} color={colors.textSecondary} />
                            <Text variant="caption" style={{ marginTop: 4 }}>Purchase</Text>
                            <Text variant="h2">${item.cost.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={[styles.section, { backgroundColor: colors.surface }]}>
                        <Text variant="h3">Product Info</Text>
                        <Text style={{ marginTop: 8, color: colors.textSecondary }}>
                            {item.description}
                        </Text>
                    </View>

                    <View style={[styles.section, { backgroundColor: colors.surface }]}>
                        <View style={[styles.listItem, { borderBottomColor: colors.background }]}>
                            <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
                                <Ionicons name="grid" size={18} color={colors.textSecondary} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text variant="label">Category</Text>
                                <Text variant="caption">{item.category}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                        </View>

                        <View style={[styles.listItem, { borderBottomColor: colors.background }]}>
                            <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
                                <Ionicons name="qr-code" size={18} color={colors.textSecondary} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text variant="label">Barcode</Text>
                                <Text variant="caption">{item.barcode || 'N/A'}</Text>
                            </View>
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>Print</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

            <View style={[styles.footerActions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <Button
                    title="Edit Stock"
                    variant="outline"
                    style={{ flex: 1, marginRight: 8 }}
                    icon="create-outline"
                    onPress={() => navigation.navigate('AddItem', { item })}
                />
                <Button
                    title="Add to Sale"
                    style={{ flex: 1, marginLeft: 8 }}
                    icon="cart-outline"
                    onPress={handleAddToSale}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroImage: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: spacing.m,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.l,
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#34C759', // Success green static is fine forbadge
        marginRight: 6,
    },
    badgeText: {
        color: '#34C759',
        fontWeight: '700',
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: spacing.l,
    },
    statCard: {
        flex: 1,
        padding: spacing.m,
        borderRadius: 12,
        marginRight: spacing.s,
        ...shadows.light,
    },
    section: {
        borderRadius: 12,
        padding: spacing.m,
        marginBottom: spacing.m,
        ...shadows.light,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.s,
        borderBottomWidth: 1,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerActions: {
        flexDirection: 'row',
        padding: spacing.m,
        borderTopWidth: 1,
        paddingBottom: 34,
    }
});
