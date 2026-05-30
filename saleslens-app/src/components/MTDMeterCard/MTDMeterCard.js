import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { mtdMeterCardStyles } from './MTDMeterCard.styles';
import useDashboardStore from '../../store/useDashboardStore';
import { useTheme } from '../../hooks/useTheme';
import { formatIndianCurrency } from '../../utils/formatNumber';
import { getMeterStatusColor } from '../../utils/getMeterStatusColor';

function MTDMeterCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => mtdMeterCardStyles(colors), [colors]);
  const { mtd, salesType } = useDashboardStore();

  const meter = useMemo(() => {
    if (!mtd) return null;

    const isNet = salesType === 'net';
    const salesMtd = isNet ? mtd.net_sales_mtd : mtd.gross_sales_mtd;
    const prevMonthDailyAvg = isNet
      ? mtd.prev_month_daily_avg_net
      : mtd.prev_month_daily_avg_gross;

    const daysElapsed = Number(mtd.days_elapsed) || 0;
    const daysRemaining = Number(mtd.days_remaining) || 0;
    const totalDays =
      Number(mtd.total_days_in_month) || daysElapsed + daysRemaining || 0;

    const apiCurrentDailyAvg = isNet
      ? (mtd.current_daily_avg_net ?? mtd.currentDailyAvg_net)
      : (mtd.current_daily_avg_gross ?? mtd.currentDailyAvg_gross);

    const currentDailyAvg =
      apiCurrentDailyAvg ??
      mtd.current_daily_avg ??
      mtd.currentDailyAvg ??
      (daysElapsed > 0 ? Number(salesMtd) / daysElapsed : null);

    const statusColor = getMeterStatusColor(
      currentDailyAvg,
      prevMonthDailyAvg,
      colors,
    );

    const progress =
      totalDays > 0 ? Math.min(Math.max(daysElapsed / totalDays, 0), 1) : 0;

    const monthLabel = mtd.month
      ? `${mtd.month} MTD`
      : 'MTD';

    return {
      title: monthLabel.toUpperCase(),
      daysLabel:
        totalDays > 0
          ? `${daysElapsed} of ${totalDays} days`
          : `${daysElapsed} days`,
      salesMtd,
      progress,
      fillColor: statusColor.main,
    };
  }, [mtd, salesType, colors]);

  if (!meter) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="elevated" elevation={4}>
        <Card.Content style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {meter.title}
            </Text>
            <Text style={styles.daysLabel}>{meter.daysLabel}</Text>
          </View>
          <Text style={styles.mtdValue}>
            {formatIndianCurrency(meter.salesMtd)}
          </Text>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${meter.progress * 100}%`,
                  backgroundColor: meter.fillColor,
                },
              ]}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

export default MTDMeterCard;
