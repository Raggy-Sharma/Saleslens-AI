import axios from 'axios';
import baseUrl from '../../env.js';

const api = axios.create({ baseURL: 'http://192.168.0.134:8000', timeout: 10000 });

export const fetchSummary = () => api.get('/dashboard/summary');
export const fetchTrend = (days = 7) => api.get(`/dashboard/trend?days=${days}`);
export const fetchMTD = () => api.get('/dashboard/mtd');
export const fetchSameDayHistory = (limit = 4) => api.get(`/dashboard/same-day-history?limit=${limit}`);
export const fetchWeekdayAverage = () => api.get('/dashboard/weekday-average');
export const uploadExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export default api;