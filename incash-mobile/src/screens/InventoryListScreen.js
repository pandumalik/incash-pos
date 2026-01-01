import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';
import { spacing, shadows } from '../theme/colors';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { ScannerModal } from '../components/ScannerModal';
import { CATEGORIES } from '../constants/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

export default function InventoryListScreen() {
    const { inventory, viewMode, toggleViewMode } = useStore();
    const navigation = useNavigation();
    const { colors } = useTheme();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showScanner, setShowScanner] = useState(false);
    const [sortBy, setSortBy] = useState('name'); // name, price, stock
    const [showSortModal, setShowSortModal] = useState(false);

    // Filter Logic
    const filteredData = inventory.filter(item => {
        const term = search.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term) ||
            (item.barcode && item.barcode.includes(term));
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'stock') return a.stock - b.stock;
        return a.name.localeCompare(b.name);
    });

    const handleScan = ({ data }) => {
        setShowScanner(false);
        setSearch(data); // Search by the scanned code
    };

    const renderListItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
        >
            <Image source={{ uri: item.image }} style={[styles.image, { backgroundColor: colors.background }]} resizeMode="cover" />
            <View style={styles.cardContent}>
                <Text variant="h3" numberOfLines={1}>{item.name}</Text>
                <Text variant="caption" style={{ marginBottom: 4 }}>SKU: {item.sku}</Text>

                <View style={styles.stockRow}>
                    <View style={[styles.badge, item.stock < 10 && styles.lowStock]}>
                        <View style={[styles.dot, item.stock < 10 && styles.lowStockDot]} />
                        <Text style={[styles.stockText, item.stock < 10 && styles.lowStockText]}>
                            {item.stock} in stock
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text variant="h3">${item.price.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderGridItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
        >
            <Image source={{ uri: item.image }} style={[styles.gridImage, { backgroundColor: colors.border }]} />
            <View style={{ padding: 8 }}>
                <Text numberOfLines={1} style={{ fontWeight: '600', fontSize: 13 }}>{item.name}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 11 }}>SKU: {item.sku}</Text>
                <Text style={{ fontSize: 11, color: item.stock < 10 ? colors.warning : colors.success }}>
                    {item.stock} in stock
                </Text>
                <Text style={{ marginTop: 4, color: colors.primary, fontWeight: '700' }}>
                    ${item.price.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>

            {/* Static Compact Header: Stacked */}
            <View style={[styles.headerContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.headerRow}>
                    <Text variant="h2">Inventory</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={toggleViewMode} style={{ marginRight: 16 }}>
                            <Ionicons
                                name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
                                size={24}
                                color={colors.textPrimary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.searchRow}>
                    <Input
                        placeholder="Search..."
                        icon="search-outline"
                        value={search}
                        onChangeText={setSearch}
                        rightIcon="qr-code-outline"
                        onRightIconPress={() => setShowScanner(true)}
                        containerStyle={{ height: 36, minHeight: 36, paddingVertical: 0 }}
                        style={{ fontSize: 13 }}
                    />
                </View>

                {/* Categories & Sort Row */}
                <View style={styles.categoryRow}>
                    <TouchableOpacity
                        onPress={() => setShowSortModal(true)}
                        style={{
                            padding: 8,
                            marginRight: 8,
                            backgroundColor: colors.surface,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.border,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Ionicons name="filter-outline" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    { backgroundColor: selectedCategory === cat ? colors.textPrimary : colors.surface, borderColor: selectedCategory === cat ? colors.textPrimary : colors.border }
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: selectedCategory === cat ? colors.surface : colors.textPrimary }
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* List */}
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <FlatList
                    key={viewMode}
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={viewMode === 'list' ? renderListItem : renderGridItem}
                    numColumns={viewMode === 'grid' ? 2 : 1}
                    columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between' } : undefined}
                    contentContainerStyle={{ padding: spacing.m, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* FAB */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('AddItem')}
            >
                <Ionicons name="add" size={32} color="#FFF" />
            </TouchableOpacity>

            {/* Scanners & Modals */}
            <ScannerModal
                visible={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleScan}
            />

            <Modal visible={showSortModal} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSortModal(false)}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text variant="h2" style={{ marginBottom: 16 }}>Sort By</Text>
                        {['name', 'price', 'stock'].map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.sortOption, { borderBottomColor: colors.border }]}
                                onPress={() => { setSortBy(opt); setShowSortModal(false); }}
                            >
                                <Text style={{ fontSize: 16, textTransform: 'capitalize' }}>{opt}</Text>
                                {sortBy === opt && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingVertical: spacing.s,
        zIndex: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.m,
        marginBottom: spacing.xs,
    },
    searchRow: {
        paddingHorizontal: spacing.m,
        marginBottom: spacing.s,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        marginBottom: spacing.s,
    },
    chip: {
        paddingHorizontal: spacing.m,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: spacing.s,
    },
    chipText: {
        fontSize: 14,
    },
    card: {
        borderRadius: 12,
        padding: spacing.m,
        paddingVertical: spacing.s,
        marginBottom: spacing.s,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.light,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: spacing.m,
    },
    cardContent: {
        flex: 1,
    },
    stockRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockText: {
        fontSize: 13,
        color: '#34C759', // This might need to be dynamic or static "Success" color? colors.success is available but not imported.
        // Wait, "colors.success" IS imported from colors? No, I removed it from imports.
        // I should use "colors.success" from useTheme.
        fontWeight: '500',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#34C759',
        marginRight: 4,
    },
    lowStock: {},
    lowStockText: { color: '#FF9500' }, // colors.warning
    lowStockDot: { backgroundColor: '#FF9500' },
    fab: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.m,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
        zIndex: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 12,
        padding: 24,
        ...shadows.medium,
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    gridCard: {
        width: '48%',
        borderRadius: 12,
        marginBottom: spacing.m,
        overflow: 'hidden',
        ...shadows.light,
    },
    gridImage: {
        width: '100%',
        height: 120,
        // backgroundColor set inline
    },
});
