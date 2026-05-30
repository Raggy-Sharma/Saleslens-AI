import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { individualDetailCardStyles } from './IndividualDetailCard.styles';
import { useTheme } from '../../hooks/useTheme';
import { formatPercent } from '../../utils/formatNumber';

function IndividualDetailCard({ title, value, vsValue, dayOfWeek, vsLabel, style }) {
  const { colors } = useTheme();
  const styles = useMemo(() => individualDetailCardStyles(colors), [colors]);

  const vsComparison = useMemo(() => {
    const num = Number(vsValue);
    if (vsValue == null || Number.isNaN(num)) return null;

    const isPositive = num > 0;
    const statusColor = isPositive ? colors.status.positive : colors.status.behind;

    return {
      percentLabel: formatPercent(num),
      icon: isPositive ? 'arrow-up' : 'arrow-down',
      statusColor,
      vsLabel:
        vsLabel !== undefined
          ? vsLabel
          : dayOfWeek
            ? `vs last ${dayOfWeek}`
            : 'vs last week',
    };
  }, [vsValue, dayOfWeek, vsLabel, colors]);

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.card} mode="elevated" elevation={4}>
        <Card.Content style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
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
              {vsComparison.vsLabel ? (
                <Text style={styles.comparisonVsLabel}>{vsComparison.vsLabel}</Text>
              ) : null}
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

export default IndividualDetailCard;
