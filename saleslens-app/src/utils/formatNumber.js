const indianCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatIndianNumber(value, { fractionDigits = 2 } = {}) {
  if (value == null || value === '') return '—';

  const num = Number(value);
  if (Number.isNaN(num)) return '—';

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(value, { fractionDigits = 1 } = {}) {
  if (value == null || value === '') return '—';

  const num = Number(value);
  if (Number.isNaN(num)) return '—';

  return `${Math.abs(num).toFixed(fractionDigits)}%`;
}

export function formatChartAxisValue(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '';

  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(num >= 1000000 ? 1 : 0)}L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(0)}K`;
  }
  return `₹${Math.round(num)}`;
}

export function formatIndianCurrency(value, { fractionDigits = 0 } = {}) {
  if (value == null || value === '') return '—';

  const num = Number(value);
  if (Number.isNaN(num)) return '—';

  if (fractionDigits === 0) {
    return indianCurrencyFormatter.format(num);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(num);
}
