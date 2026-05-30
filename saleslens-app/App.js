import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import ThemeSync from './src/components/ThemeSync';
import useThemeStore from './src/store/useThemeStore';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';

export default function App() {
  const colors = useThemeStore((state) => state.colors);
  const colorScheme = useThemeStore((state) => state.colorScheme);

  const paperTheme = useMemo(() => {
    const base = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        surface: colors.background.primary,
        elevation: {
          ...base.colors.elevation,
          level1: colors.background.primary,
        },
      },
    };
  }, [colorScheme, colors]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <View style={[styles.container, { backgroundColor: colors.background.tertiary }]}>
          <ThemeSync />
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <HomeScreen />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
