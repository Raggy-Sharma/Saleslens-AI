import { Fragment, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { lastFourDOWStyles } from './LastFourDOW.styles';
import useDashboardStore from '../../store/useDashboardStore';
import { useTheme } from '../../hooks/useTheme';
import { formatIndianCurrency } from '../../utils/formatNumber';

function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function LastFourDOW() {
  const { colors } = useTheme();
  const styles = useMemo(() => lastFourDOWStyles(colors), [colors]);
  const { sameDayHistory, salesType, summary } = useDashboardStore();

  const { entries, dayOfWeek, lastValueColor } = useMemo(() => {
    const raw = sameDayHistory?.data ?? sameDayHistory;
    const list = Array.isArray(raw) ? [...raw] : [];
    const valueKey = salesType === 'net' ? 'net_sales' : 'gross_sales';

    list.sort((a, b) => {
      const dateA = new Date(a.report_date ?? a.date).getTime();
      const dateB = new Date(b.report_date ?? b.date).getTime();
      return dateA - dateB;
    });

    const entries = list.slice(-4).map((item) => ({
      value: item[valueKey],
      date: item.report_date ?? item.date,
    }));

    const dayOfWeek =
      sameDayHistory?.day_of_week ?? summary?.day_of_week ?? 'day';

    let lastValueColor = colors.text.primary;
    if (entries.length >= 2) {
      const last = Number(entries[entries.length - 1].value);
      const previous = Number(entries[entries.length - 2].value);
      if (!Number.isNaN(last) && !Number.isNaN(previous)) {
        if (last > previous) {
          lastValueColor = colors.status.positive.main;
        } else if (last < previous) {
          lastValueColor = colors.status.behind.main;
        }
      }
    }

    return { entries, dayOfWeek, lastValueColor };
  }, [sameDayHistory, salesType, summary, colors]);

  if (!entries.length) {
    return null;
  }

  const title = `Last 4 ${dayOfWeek}s`;

  return (
      <View style={styles.container}>
        <Card style={styles.card} mode="elevated" elevation={4}>
          <Card.Content style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.row}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {entries.map((entry, index) => {
                  const isLast = index === entries.length - 1;
                  const valueStyle = isLast ? { color: lastValueColor } : undefined;
                  return (
                    <Fragment key={entry.date ?? index}>
                      {index > 0 ? (
                        <MaterialCommunityIcons
                          name="arrow-right"
                          size={12}
                          color={colors.text.secondary}
                          style={styles.separator}
                        />
                      ) : null}
                      <View style={styles.item}>
                        <Text style={[styles.value, valueStyle]}>
                          {formatIndianCurrency(entry.value)}
                        </Text>
                        <Text style={[styles.date, valueStyle]}>
                          {formatShortDate(entry.date)}
                        </Text>
                      </View>
                    </Fragment>
                  );
                })}
              </ScrollView>
            </View>
          </Card.Content>
        </Card>
      </View>
  );
}

export default LastFourDOW;
