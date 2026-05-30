import { StyleSheet } from 'react-native';

export const createDashboardScreenStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.tertiary,
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    salesTypeContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    },
    salesTypeText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    detailCardsSection: {
      marginTop: 8,
      gap: 10,
      flexShrink: 0,
    },
    lastFourDOWSection: {
      marginTop: 10,
    },
    mtdMeterSection: {
      marginTop: 10,
    },
    trendsSection: {
      marginTop: 10,
    },
    detailCardsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    detailCardSlot: {
      flex: 1,
      minWidth: 0,
    },
  });
