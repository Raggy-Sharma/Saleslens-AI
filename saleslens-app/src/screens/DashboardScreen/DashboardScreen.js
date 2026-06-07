import { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Switch, ScrollView, RefreshControl } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDashboardStore from '../../store/useDashboardStore';
import { fetchSummary, fetchTrend, fetchMTD, fetchSameDayHistory, fetchWeekdayAverage } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';
import { createDashboardScreenStyles } from './DashboardScreen.styles';
import { darkColors, lightColors } from '../../theme/colors';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import IndividualDetailCard from '../../components/IndividualDetailCard/IndividualDetailCard';
import LastFourDOW from '../../components/LastFourDOW/LastFourDOW';
import MTDMeterCard from '../../components/MTDMeterCard/MTDMeterCard';
import TrendsCard from '../../components/TrendsCard/TrendsCard';
import { formatIndianCurrency, formatIndianNumber } from '../../utils/formatNumber';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createDashboardScreenStyles(colors), [colors]);
  const [refreshing, setRefreshing] = useState(false);
  const {
    summary,
    loading,
    salesType,
    salesTypeLabel,
    setSalesType,
    setSummary,
    setTrend,
    setMTD,
    setSameDayHistory,
    weekdayAverage,
    setWeekdayAverage,
    setLoading,
    setError,
  } = useDashboardStore();
  const route = useRoute();

  const loadDashboard = useCallback(async ({ showLoader = true } = {}) => {
    if (showLoader) setLoading(true);
    try {
      const [summaryRes, trendRes, mtdRes, historyRes, avgRes] = await Promise.all([
        fetchSummary(), fetchTrend(7), fetchMTD(), fetchSameDayHistory(4), fetchWeekdayAverage(),
      ]);
      setSummary(summaryRes.data);
      setTrend(trendRes.data);
      setMTD(mtdRes.data);
      setSameDayHistory(historyRes.data);
      console.log(historyRes.data);
      setWeekdayAverage(avgRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [setLoading, setSummary, setTrend, setMTD, setSameDayHistory, setWeekdayAverage, setError]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDashboard({ showLoader: false });
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboard]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (route.params?.reload) {
      onRefresh();
    }
  }, [route.params?.reload, onRefresh]);

  const detailCards = useMemo(() => {
    if (!summary) return [];

    const isNet = salesType === 'net';
    const dayOfWeek = summary.day_of_week;

    const avgApc =
      weekdayAverage?.avg_foot_fall > 0
        ? weekdayAverage.avg_net_sales / weekdayAverage.avg_foot_fall
        : null;

    return [
      {
        key: 'sales',
        title: salesTypeLabel,
        value: formatIndianCurrency(isNet ? summary.net_sales : summary.gross_sales),
        vsValue: isNet ? summary.vs_last_weekday_net : summary.vs_last_weekday_gross,
        dayOfWeek,
      },
      {
        key: 'footfall',
        title: 'Footfall',
        value: formatIndianNumber(summary.foot_fall, { fractionDigits: 0 }),
        vsValue: summary.vs_last_weekday_foot_fall,
        dayOfWeek,
      },
      {
        key: 'transactions',
        title: 'Transactions',
        value: formatIndianNumber(summary.transactions, { fractionDigits: 0 }),
        vsValue: summary.vs_last_weekday_transactions,
        dayOfWeek,
      },
      {
        key: 'apc',
        title: 'APC',
        value: formatIndianCurrency(summary.apc),
        vsValue: summary.vs_last_weekday_apc,
        vsLabel:
          avgApc != null
            ? `Avg APC ${formatIndianCurrency(avgApc)}`
            : 'Avg APC —',
        dayOfWeek,
      },
    ];
  }, [summary, salesType, salesTypeLabel, weekdayAverage]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.text.accent} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{summary?.report_date || 'No data'}</Text>
            <View style={styles.salesTypeContainer}>
              <Text style={styles.salesTypeText}>{salesTypeLabel}</Text>
              <Switch
                trackColor={{false: lightColors.background.accent, true: darkColors.background.accent}}
                thumbColor={'#f5dd4b'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(isNet) => setSalesType(isNet ? 'net' : 'gross')}
                value={salesType === 'net'}
              />
            </View>
          </View>
          <SummaryCard />
          <View style={styles.detailCardsSection}>
            <View style={styles.detailCardsRow}>
              {detailCards.slice(0, 2).map((card) => (
                <View key={card.key} style={styles.detailCardSlot}>
                  <IndividualDetailCard
                    title={card.title}
                    value={card.value}
                    vsValue={card.vsValue}
                    dayOfWeek={card.dayOfWeek}
                    vsLabel={card.vsLabel}
                  />
                </View>
              ))}
            </View>
            <View style={styles.detailCardsRow}>
              {detailCards.slice(2, 4).map((card) => (
                <View key={card.key} style={styles.detailCardSlot}>
                  <IndividualDetailCard
                    title={card.title}
                    value={card.value}
                    vsValue={card.vsValue}
                    dayOfWeek={card.dayOfWeek}
                    vsLabel={card.vsLabel}
                  />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.lastFourDOWSection}>
            <LastFourDOW />
          </View>
          <View style={styles.mtdMeterSection}>
            <MTDMeterCard />
          </View>
          <View style={styles.trendsSection}>
            <TrendsCard />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
