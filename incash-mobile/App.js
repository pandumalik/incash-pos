import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from './src/context/StoreContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </StoreProvider>
  );
}
