import { StyleSheet } from 'react-native';

export const mtdMeterCardStyles = (colors) =>
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
    daysLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.text.secondary,
    },
    mtdValue: {
      marginTop: 8,
      fontSize: 28,
      fontWeight: '700',
      color: colors.text.primary,
    },
    meterTrack: {
      marginTop: 14,
      height: 6,
      width: '100%',
      borderRadius: 3,
      backgroundColor: colors.background.tertiary,
      overflow: 'hidden',
    },
    meterFill: {
      height: '100%',
      borderRadius: 3,
    },
  });
