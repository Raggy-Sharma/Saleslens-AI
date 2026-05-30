export function getMeterStatusColor(currentAvg, prevAvg, colors) {
  const current = Number(currentAvg);
  const prev = Number(prevAvg);

  if (Number.isNaN(current) || Number.isNaN(prev) || prev <= 0) {
    return colors.status.caution;
  }

  if (current > prev) {
    return colors.status.positive;
  }

  const ratio = current / prev;
  if (ratio >= 0.8 && ratio < 1) {
    return colors.status.caution;
  }

  return colors.status.behind;
}
