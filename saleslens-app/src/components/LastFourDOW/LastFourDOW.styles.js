import { StyleSheet } from 'react-native';

export const lastFourDOWStyles = (colors) =>
  StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      width: '100%',
      minWidth: 0,
    },
    card: {
      width: '100%',
      backgroundColor: colors.background.primary,
      borderRadius: 16,
    },
    content: {
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    title: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    row: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    item: {
      flex: 1,
      alignItems: 'center',
      minWidth: 0,
    },
    value: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text.primary,
      textAlign: 'center',
    },
    date: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: '400',
      color: colors.text.primary,
      textAlign: 'center',
    },
    separator: {
      marginHorizontal: 2,
      flexShrink: 0,
    },
  });
