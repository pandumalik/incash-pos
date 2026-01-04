import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';
import { spacing, shadows } from '../theme/colors';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { ScannerModal } from '../components/ScannerModal';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CashierScreen() {
    const { inventory, cart, addToCart, removeFromCart, clearCart, updateCartQuantity, checkout, viewMode, toggleViewMode } = useStore();
    const { colors } = useTheme();
    const [search, setSearch] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [isCartExpanded, setIsCartExpanded] = useState(false);

    const cartAnim = useRef(new Animated.Value(0)).current;

    // Pan Responder
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Activate only on vertical swipe > 10px
                return Math.abs(gestureState.dy) > 10;
            },
            onPanResponderRelease: (_, gestureState) => {
                const { dy } = gestureState;
                // Swipe Up (negative dy) -> Expand
                if (dy < -50 && !isCartExpanded) {
                    toggleCart(true);
                }
                // Swipe Down (positive dy) -> Collapse
                else if (dy > 50 && isCartExpanded) {
                    toggleCart(false);
                }

            },
        })
    ).current;


    const filteredItems = inventory.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase()) ||
        (i.barcode && i.barcode.includes(search))
    );

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const totalItemsCount = useMemo(() => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);

    const toggleCart = (forceState) => {
        const nextState = forceState !== undefined ? forceState : !isCartExpanded;

        Animated.spring(cartAnim, {
            toValue: nextState ? 1 : 0,
            useNativeDriver: false,
            friction: 6,
            tension: 40,
        }).start();
        setIsCartExpanded(nextState);
    };


    const handleScan = ({ data }) => {
        const item = inventory.find(i => i.barcode === data || i.sku === data);
        if (item) {
            addToCart(item);
        } else {
            alert('Item not found');
        }
        setShowScanner(false);
    };

    const handleClearCart = () => {
        if (cart.length === 0) return;
        clearCart();
    };

    useEffect(() => {
        if (cart.length === 0 && isCartExpanded) {
            setIsCartExpanded(false);
            cartAnim.setValue(0);
        }
    }, [cart.length]);

    const renderGridItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.surface }]}
            onPress={() => addToCart(item)}
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

    const renderListItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => addToCart(item)}
        >
            <Image source={{ uri: item.image }} style={[styles.image, { backgroundColor: colors.background }]} resizeMode="cover" />
            <View style={styles.cardContent}>
                <Text variant="h3" numberOfLines={1}>{item.name}</Text>
                <Text variant="caption" style={{ marginBottom: 4 }}>SKU: {item.sku}</Text>

                <View style={styles.stockRow}>
                    <View style={[styles.badge, item.stock < 10 && styles.lowStock]}>
                        <View style={[styles.dot, { backgroundColor: item.stock < 10 ? colors.warning : colors.success }]} />
                        <Text style={[styles.stockText, { color: item.stock < 10 ? colors.warning : colors.success }]}>
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

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>

            <Image source={{ uri: item.image }} style={[styles.cartImage, { backgroundColor: colors.background }]} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: colors.textSecondary }}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.qtyControl}>
                <TouchableOpacity
                    style={[styles.miniBtn, { backgroundColor: colors.background }]}
                    onPress={() => updateCartQuantity(item.id, -1)}
                >
                    <Ionicons name="remove" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
                <TouchableOpacity
                    style={[styles.miniBtn, { backgroundColor: colors.primary }]}
                    onPress={() => updateCartQuantity(item.id, 1)}
                >
                    <Ionicons name="add" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const cartHeight = cartAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [170, SCREEN_HEIGHT * 0.7]
    });

    // Backdrop Opacity
    const backdropOpacity = cartAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5]
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>

            {/* Static Compact Header */}
            <View style={[styles.headerContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.headerRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text variant="h2">Sale #2049</Text>
                        <Text variant="body" style={{ color: colors.textSecondary, marginLeft: 8 }}>(Table 4)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={toggleViewMode} style={{ marginRight: 16 }}>
                            <Ionicons
                                name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
                                size={24}
                                color={colors.textPrimary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { handleClearCart() }}>
                            <Ionicons name="trash-outline" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.searchRow}>
                    <Input
                        placeholder="Search/Scan..."
                        value={search}
                        onChangeText={setSearch}
                        rightIcon="qr-code-outline"
                        onRightIconPress={() => setShowScanner(true)}
                        containerStyle={{ height: 36, minHeight: 36, paddingVertical: 0 }}
                        style={{ fontSize: 13 }}
                    />
                </View>
            </View>

            {/* Product Grid/List */}
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <FlatList
                    key={viewMode}
                    data={filteredItems}
                    keyExtractor={item => item.id}
                    renderItem={viewMode === 'list' ? renderListItem : renderGridItem}
                    numColumns={viewMode === 'grid' ? 2 : 1}
                    contentContainerStyle={{ padding: spacing.m, paddingBottom: 150 }}
                    columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between' } : undefined}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {
                isCartExpanded && (
                    <Animated.View
                        style={[
                            styles.backdrop,
                            { opacity: backdropOpacity }
                        ]}
                    >
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            activeOpacity={1}
                            onPress={() => toggleCart(false)}
                        />
                    </Animated.View>
                )
            }
            {cart.length > 0 && (
                <Animated.View
                    style={[styles.cartContainer, { height: cartHeight, backgroundColor: colors.surface }]}
                    {...panResponder.panHandlers}
                >
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => toggleCart()}
                            activeOpacity={0.8}
                            hitSlop={{ top: 15, bottom: 15, left: 20, right: 20 }}
                        >
                            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
                        </TouchableOpacity>

                        <View style={styles.cartHeader}>
                            <View>
                                <Text variant="h3">Current Order</Text>

                                <Text variant="caption" style={{ marginTop: 2 }}>
                                    {totalItemsCount} Total Items
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="h3">${cartTotal.toFixed(2)}</Text>
                                {!isCartExpanded && (
                                    <TouchableOpacity
                                        onPress={() => toggleCart()}
                                        activeOpacity={0.8}
                                        hitSlop={{ top: 15, bottom: 15, left: 20, right: 20 }}
                                    >
                                        <Text style={{ color: colors.primary, fontWeight: '600' }}>Tap to view</Text>

                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        {isCartExpanded && (
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={cart}
                                    keyExtractor={item => item.id}
                                    renderItem={renderCartItem}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                />

                                <View style={[styles.summary, { borderTopColor: colors.border }]}>
                                    <View style={styles.summaryRow}>
                                        <Text>Subtotal</Text>
                                        <Text>${cartTotal.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text>Tax (8%)</Text>
                                        <Text>${(cartTotal * 0.08).toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>

                    <Button
                        title={`Checkout  $${(cartTotal * 1.08).toFixed(2)} `}
                        onPress={checkout}
                        icon="arrow-forward"
                        style={{ marginTop: 10 }}
                    />

                </Animated.View>
            )}

            <ScannerModal
                visible={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleScan}
                title="Scan Item to Add"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingVertical: spacing.s,
        // ...shadows.light,
        height: 100,
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
    gridContent: {
        padding: spacing.m,
        paddingBottom: 200,
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
        fontWeight: '500',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    lowStock: {},
    lowStockText: {},
    lowStockDot: {},
    productImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#EEE',
    },

    cartContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: spacing.m,
        ...shadows.medium,
        // Shadow needs to be strong to see it above list
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.20,
        shadowRadius: 5.00,
        elevation: 20,
        zIndex: 20, // Ensure it sits above backdrop
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.m,
    },
    cartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.m,
        alignItems: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    cartImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summary: {
        borderTopWidth: 1,
        paddingVertical: spacing.m,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cartHeaderArea: {
        paddingBottom: 8,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 15,
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
