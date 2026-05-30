import { create } from 'zustand';

const SALES_TYPE_LABELS = {
  net: 'Net Sales',
  gross: 'Gross Sales',
};

const getSalesTypeLabel = (salesType) => SALES_TYPE_LABELS[salesType] ?? SALES_TYPE_LABELS.net;

const useDashboardStore = create((set) => ({
  salesType: 'net',
  salesTypeLabel: getSalesTypeLabel('net'),
  setSalesType: (salesType) =>
    set({ salesType, salesTypeLabel: getSalesTypeLabel(salesType) }),
  toggleSalesType: () =>
    set((state) => {
      const salesType = state.salesType === 'net' ? 'gross' : 'net';
      return { salesType, salesTypeLabel: getSalesTypeLabel(salesType) };
    }),
  // Dashboard data
  summary: null,
  trend: null,
  mtd: null,
  sameDayHistory: null,
  weekdayAverage: null,
  loading: false,
  error: null,

  // Actions
  setSummary: (data) => set({ summary: data }),
  setTrend: (data) => set({ trend: data }),
  setMTD: (data) => set({ mtd: data }),
  setSameDayHistory: (data) => set({ sameDayHistory: data }),
  setWeekdayAverage: (data) => set({ weekdayAverage: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useDashboardStore;
