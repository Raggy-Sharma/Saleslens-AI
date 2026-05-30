import { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Card, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import { trendsCardStyles } from './TrendsCard.styles';
import useDashboardStore from '../../store/useDashboardStore';
import { useTheme } from '../../hooks/useTheme';
import { getMeterStatusColor } from '../../utils/getMeterStatusColor';
import { formatChartAxisValue } from '../../utils/formatNumber';
import { fetchTrend } from '../../services/api';

const DAY_OPTIONS = [7, 14, 30];

function formatAxisDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function buildYDomain(values) {
  if (!values.length) return { y: [0, 1] };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.08 || max * 0.1 || 1;
  return { y: [Math.max(0, min - padding), max + padding] };
}

function TrendsCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => trendsCardStyles(colors), [colors]);
  const { trend, mtd, salesType, setTrend } = useDashboardStore();
  const [selectedDays, setSelectedDays] = useState(() => trend?.days ?? 7);
  const [menuVisible, setMenuVisible] = useState(false);
  const [trendLoading, setTrendLoading] = useState(false);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const loadTrend = useCallback(
    async (days) => {
      setTrendLoading(true);
      try {
        const response = await fetchTrend(days);
        setTrend(response.data);
      } finally {
        setTrendLoading(false);
      }
    },
    [setTrend],
  );

  const chartModel = useMemo(() => {
    const points = trend?.data ?? [];
    if (!points.length || trend?.days !== selectedDays) return null;

    const valueKey = salesType === 'net' ? 'net_sales' : 'gross_sales';
    const isNet = salesType === 'net';

    const chartData = points.map((point, index) => ({
      x: index,
      y: Number(point[valueKey]) || 0,
    }));

    const tickLabels = points.map((point) =>
      formatAxisDate(point.date ?? point.report_date),
    );

    const tickStep =
      points.length > 10 ? Math.max(1, Math.ceil(points.length / 7)) : 1;
    const xTickValues = chartData
      .filter((_, index) => index % tickStep === 0 || index === chartData.length - 1)
      .map((point) => point.x);

    const dailyAvg =
      chartData.reduce((sum, point) => sum + point.y, 0) / chartData.length;

    const prevMonthDailyAvg = isNet
      ? mtd?.prev_month_daily_avg_net
      : mtd?.prev_month_daily_avg_gross;

    const statusColor = getMeterStatusColor(
      dailyAvg,
      prevMonthDailyAvg,
      colors,
    );

    return {
      title: `Last ${selectedDays} Days`,
      chartData,
      xTickValues,
      tickLabels,
      lineColor: statusColor.main,
      domain: buildYDomain(chartData.map((point) => point.y)),
    };
  }, [trend, mtd, salesType, colors, selectedDays]);

  const handleSelectDays = (days) => {
    setMenuVisible(false);
    if (days === selectedDays) return;
    setSelectedDays(days);
    loadTrend(days);
  };

  if (!chartModel && !trendLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="elevated" elevation={4}>
        <Card.Content style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {chartModel?.title ?? `Last ${selectedDays} Days`}
            </Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Pressable
                  style={styles.daysSelector}
                  onPress={() => setMenuVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Select number of days"
                >
                  <Text style={styles.daysSelectorText}>{selectedDays} days</Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={16}
                    color={colors.text.secondary}
                  />
                </Pressable>
              }
            >
              {DAY_OPTIONS.map((days) => (
                <Menu.Item
                  key={days}
                  onPress={() => handleSelectDays(days)}
                  title={`${days} days`}
                />
              ))}
            </Menu>
          </View>

          <View
            style={styles.chartContainer}
            onLayout={({ nativeEvent: { layout } }) => {
              const { width, height } = layout;
              if (width > 0 && height > 0) {
                setChartSize({ width, height });
              }
            }}
          >
            {trendLoading && (
              <View style={styles.chartLoading}>
                <ActivityIndicator size="small" color={colors.text.accent} />
              </View>
            )}
            {chartSize.width > 0 && chartModel && !trendLoading && (
              <VictoryChart
                width={chartSize.width}
                height={chartSize.height}
                domain={chartModel.domain}
                padding={{ top: 8, bottom: 36, left: 52, right: 12 }}
              >
                <VictoryAxis
                  dependentAxis
                  tickFormat={formatChartAxisValue}
                  tickCount={4}
                  style={{
                    axis: { stroke: colors.border.primary },
                    tickLabels: {
                      fill: colors.text.tertiary,
                      fontSize: 9,
                    },
                    grid: {
                      stroke: colors.border.primary,
                      strokeDasharray: '4,4',
                      opacity: 0.35,
                    },
                  }}
                />
                <VictoryAxis
                  tickValues={chartModel.xTickValues}
                  tickFormat={(tick) =>
                    chartModel.tickLabels[Math.round(tick)] ?? ''
                  }
                  style={{
                    axis: { stroke: colors.border.primary },
                    tickLabels: {
                      fill: colors.text.tertiary,
                      fontSize: 9,
                      padding: 4,
                    },
                    grid: { stroke: 'transparent' },
                  }}
                />
                <VictoryLine
                  data={chartModel.chartData}
                  interpolation="monotoneX"
                  labels={() => null}
                  style={{
                    data: {
                      stroke: chartModel.lineColor,
                      strokeWidth: 2.5,
                    },
                  }}
                />
              </VictoryChart>
            )}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

export default TrendsCard;
