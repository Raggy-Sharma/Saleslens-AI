import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import useThemeStore from '../store/useThemeStore';

/**
 * Subscribes to the device color scheme and exposes the matching theme colors.
 * @returns {{ colors: import('../theme/colors').lightColors, colorScheme: 'light' | 'dark', isDark: boolean }}
 */
export function useTheme() {
  const deviceScheme = useColorScheme();
  const colors = useThemeStore((state) => state.colors);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const scheme = deviceScheme === 'dark' ? 'dark' : 'light';
    setTheme(scheme);
  }, [deviceScheme, setTheme]);

  return {
    colors,
    colorScheme,
    isDark: colorScheme === 'dark',
  };
}
