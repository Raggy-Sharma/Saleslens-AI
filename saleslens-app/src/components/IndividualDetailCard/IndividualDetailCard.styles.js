import { StyleSheet } from 'react-native';

export const individualDetailCardStyles = (colors) =>
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
      fontSize: 13,
      fontWeight: '600',
      color: colors.text.secondary,
    },
    value: {
      marginTop: 2,
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    comparisonSection: {
      marginTop: 6,
      alignItems: 'flex-start',
    },
    comparisonChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      height: 24,
      paddingHorizontal: 8,
      borderRadius: 13,
    },
    comparisonChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text.primary,
    },
    comparisonVsLabel: {
      marginTop: 4,
      fontSize: 11,
      color: colors.text.tertiary,
    },
  });
