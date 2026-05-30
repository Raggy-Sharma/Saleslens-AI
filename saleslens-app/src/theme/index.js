import { darkColors, lightColors } from './colors';

export { darkColors, lightColors } from './colors';

export const themes = {
  light: lightColors,
  dark: darkColors,
};

/** Returns the color token object for the active theme (`light` | `dark`). */
export function getTheme(colorScheme) {
  return themes[colorScheme === 'dark' ? 'dark' : 'light'];
}
