import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../theme/ThemeContext';

// Screens
import InventoryListScreen from '../screens/InventoryListScreen';
import CashierScreen from '../screens/CashierScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddItemScreen from '../screens/AddItemScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';

import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    const { userRole } = useStore();
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Inventory') {
                        iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
                    } else if (route.name === 'Cashier') {
                        iconName = focused ? 'calculator' : 'calculator-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.tabBarActive,
                tabBarInactiveTintColor: colors.tabBarInactive,
                tabBarStyle: {
                    borderTopColor: colors.border,
                    backgroundColor: colors.surface,
                }
            })}
        >
            {(userRole === 'admin' || userRole === 'inventory_manager') && (
                <Tab.Screen name="Inventory" component={InventoryListScreen} />
            )}

            {(userRole === 'admin' || userRole === 'cashier') && (
                <Tab.Screen name="Cashier" component={CashierScreen} />
            )}

            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { user } = useStore();
    const { theme, colors } = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: colors.surface,
                    },
                    headerTintColor: colors.primary,
                    headerTitleStyle: {
                        color: colors.textPrimary,
                        presentation: 'transparentModal'
                    },
                }}
            >
                {!user ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />

                        <Stack.Screen
                            name="AddItem"
                            component={AddItemScreen}
                            options={{
                                presentation: 'modal',
                                headerShown: true,
                                title: 'Add New Item',
                                headerBackTitleVisible: false,
                            }}
                        />

                        <Stack.Screen
                            name="ItemDetails"
                            component={ItemDetailScreen}
                            options={{
                                headerShown: true,
                                title: 'Item Details',
                                headerBackTitleVisible: false,
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
