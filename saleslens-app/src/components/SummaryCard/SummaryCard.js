import { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import { summaryCardStyles } from './SummaryCard.styles';
import useDashboardStore from '../../store/useDashboardStore';
import { useTheme } from '../../hooks/useTheme';
import { formatIndianCurrency, formatPercent } from '../../utils/formatNumber';

function SummaryCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => summaryCardStyles(colors), [colors]);
  const { salesTypeLabel, mtd, salesType, trend, summary } = useDashboardStore();
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const mtd_value = useMemo(
    () => (salesType === 'net' ? mtd?.net_sales_mtd : mtd?.gross_sales_mtd),
    [mtd, salesType],
  );

  const chartData = useMemo(() => {
    const points = trend?.data ?? [];
    const valueKey = salesType === 'net' ? 'net_sales' : 'gross_sales';
    return points.map((point, index) => ({
      x: index,
      y: point[valueKey] ?? 0,
    }));
  }, [trend, salesType]);

  const vsComparison = useMemo(() => {
    const rawValue =
      salesType === 'net'
        ? summary?.vs_last_weekday_net
        : summary?.vs_last_weekday_gross;
    const value = Number(rawValue);
    if (rawValue == null || Number.isNaN(value)) return null;

    const isPositive = value > 0;
    const statusColor = isPositive ? colors.status.positive : colors.status.behind;

    return {
      percentLabel: formatPercent(value),
      icon: isPositive ? 'arrow-up' : 'arrow-down',
      statusColor,
      vsLabel: summary?.day_of_week
        ? `vs last ${summary.day_of_week}`
        : 'vs last week',
    };
  }, [summary, salesType, colors]);

  return (
    <View style={styles.summaryCardContainer}>
      <Card style={styles.summaryCard} mode="elevated" elevation={4}>
        <Card.Content style={styles.summaryCardContentWrapper}>
          <Text style={styles.summaryCardTitle}>{salesTypeLabel}</Text>

          <View style={styles.summaryCardContent}>
            <View style={styles.summaryCardContentLeft}>
              <Text style={styles.mtdReportValue}>
                {formatIndianCurrency(mtd_value)}
              </Text>
              {vsComparison && (
                <View style={styles.comparisonSection}>
                  <View
                    style={[
                      styles.comparisonChip,
                      { backgroundColor: vsComparison.statusColor.background },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={vsComparison.icon}
                      size={12}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.comparisonChipText}>
                      {vsComparison.percentLabel}
                    </Text>
                  </View>
                  <Text style={styles.comparisonVsLabel}>{vsComparison.vsLabel}</Text>
                </View>
              )}
            </View>

            <View
              style={styles.summaryCardContentRight}
              onLayout={({ nativeEvent: { layout } }) => {
                const { width, height } = layout;
                if (width > 0 && height > 0) {
                  setChartSize({ width, height });
                }
              }}
            >
              {chartSize.width > 0 && chartData.length > 0 && (
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <VictoryAxis
                    dependentAxis
                    style={{
                      axis: { stroke: 'transparent' },
                      tickLabels: { fill: 'transparent' },
                      grid: { stroke: 'transparent' },
                    }}
                  />
                  <VictoryLine
                    data={chartData}
                    interpolation="monotoneX"
                    style={{
                      data: {
                        stroke: colors.chart.primary,
                        strokeWidth: 2,
                      },
                    }}
                  />
                </VictoryChart>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

export default SummaryCard;
