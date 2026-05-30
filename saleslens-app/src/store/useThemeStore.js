import { Appearance } from 'react-native';
import { create } from 'zustand';
import { getTheme } from '../theme';

const initialScheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

const useThemeStore = create((set) => ({
  colorScheme: initialScheme,
  colors: getTheme(initialScheme),
  setTheme: (colorScheme) =>
    set({
      colorScheme,
      colors: getTheme(colorScheme),
    }),
}));

export default useThemeStore;
