import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import useThemeStore from '../store/useThemeStore';

/** Keeps the theme store aligned with the device light / dark setting. */
export default function ThemeSync() {
  const deviceScheme = useColorScheme();
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    setTheme(deviceScheme === 'dark' ? 'dark' : 'light');
  }, [deviceScheme, setTheme]);

  return null;
}
