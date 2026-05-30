import { StyleSheet } from 'react-native';

export const createHomeScreenStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.tertiary,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text.primary,
    },
  });
