import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState('dark');

    // Effect to update if system theme changes, but only if user hasn't manually overridden 
    // (For simplicity in this MVP, we'll just track manual state. 
    // If we wanted to track "system" vs "manual", we'd need another state variable)
    // For now, let's just default to one state.

    const colors = theme === 'dark' ? darkColors : lightColors;

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setMode = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setTheme(mode);
        }
    };

    const value = {
        theme,
        colors,
        toggleTheme,
        setMode,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
