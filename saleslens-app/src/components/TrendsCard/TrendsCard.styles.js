import { StyleSheet } from 'react-native';

export const trendsCardStyles = (colors) =>
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
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    title: {
      flex: 1,
      fontSize: 11,
      fontWeight: '600',
      color: colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    daysSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: colors.background.secondary,
    },
    daysSelectorText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text.primary,
    },
    chartContainer: {
      marginTop: 10,
      width: '100%',
      height: 168,
    },
    chartLoading: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
