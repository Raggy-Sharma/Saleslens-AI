import { StyleSheet } from 'react-native';

export const summaryCardStyles = (colors) =>
  StyleSheet.create({
    summaryCardContainer: {
      width: '100%',
      marginVertical: 16,
    },
    summaryCard: {
      width: '100%',
      backgroundColor: colors.background.accent,
      borderRadius: 24,
      overflow: 'hidden',
    },
    summaryCardContentWrapper: {
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    summaryCardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: 8,
    },
    summaryCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 88,
    },
    summaryCardContentLeft: {
      flexShrink: 0,
      maxWidth: '45%',
      paddingRight: 8,
    },
    summaryCardContentRight: {
      flex: 1,
      minHeight: 72,
      minWidth: 0,
      alignItems: 'stretch',
      justifyContent: 'center',
    },
    mtdReportValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    comparisonSection: {
      marginTop: 8,
      alignItems: 'flex-start',
    },
    comparisonChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      height: 26,
      paddingHorizontal: 8,
      borderRadius: 13,
    },
    comparisonChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text.primary,
      marginLeft: 2,
    },
    comparisonVsLabel: {
      marginTop: 4,
      fontSize: 11,
      color: colors.text.tertiary,
    },
  });
