import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_INVENTORY } from '../constants/mockData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [inventory, setInventory] = useState(MOCK_INVENTORY);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const login = (userData) => {
        setUser({
            ...userData,
            lastLogin: new Date().toISOString()
        });
    };

    const logout = () => {
        setUser(null);
    };

    const addToInventory = (item) => {

        const newItem = { ...item, id: Date.now().toString() };
        setInventory((prev) => [newItem, ...prev]);
    };

    const updateStock = (itemId, quantity) => {
        setInventory(prev => prev.map(item =>
            item.id === itemId ? { ...item, stock: quantity } : item
        ));
    };

    const updateInventoryItem = (itemId, updatedFields) => {
        setInventory(prev => prev.map(item =>
            item.id === itemId ? { ...item, ...updatedFields } : item
        ));
    };

    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateCartQuantity = (itemId, change) => {
        setCart(prev => prev.map(i => {
            if (i.id === itemId) {
                const newQty = Math.max(0, i.quantity + change);
                return { ...i, quantity: newQty };
            }
            return i;
        }).filter(i => i.quantity > 0));
    };

    const checkout = () => {

        setInventory(prevInv => {
            return prevInv.map(item => {
                const cartItem = cart.find(c => c.id === item.id);
                if (cartItem) {
                    return { ...item, stock: Math.max(0, item.stock - cartItem.quantity) };
                }
                return item;
            });
        });
        setCart([]);
    };


    const toggleViewMode = () => {
        setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
    };

    const value = {
        inventory,
        addToInventory,
        updateStock,
        updateInventoryItem,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQuantity,
        checkout,
        user,
        login,
        logout,
        userRole: user?.role,
        viewMode,
        toggleViewMode
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within StoreProvider');
    return context;
};
