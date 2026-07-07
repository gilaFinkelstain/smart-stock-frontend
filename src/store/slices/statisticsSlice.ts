import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as statisticsService from '../../services/statisticsService';
import type { ProductStatistic } from '../../types/models';

export interface StatisticsSummary {
  total_products_analyzed: number;
  urgent_items: number;
  average_cycle: number;
  most_stable_product: { product_id: number; stability: number } | null;
}

interface StatisticsState {
  productStats: ProductStatistic[];
  summary: StatisticsSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  productStats: [],
  summary: null,
  loading: false,
  error: null,
};

function computeSummary(stats: ProductStatistic[]): StatisticsSummary {
  if (stats.length === 0) {
    return { total_products_analyzed: 0, urgent_items: 0, average_cycle: 0, most_stable_product: null };
  }
  const urgent = stats.filter((s) => s.score > 1.5).length;
  const avgCycle = stats.reduce((sum, s) => sum + s.cycle, 0) / stats.length;
  let best: { product_id: number; stability: number } | null = null;
  for (const s of stats) {
    if (!best || s.stability > best.stability) {
      best = { product_id: s.product_id, stability: s.stability };
    }
  }
  return {
    total_products_analyzed: stats.length,
    urgent_items: urgent,
    average_cycle: Math.round(avgCycle * 10) / 10,
    most_stable_product: best,
  };
}

export const fetchStatistics = createAsyncThunk('statistics/fetch', async (userId: number, { rejectWithValue }) => {
  try {
    return await statisticsService.getStatistics(userId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.productStats = action.payload.products;
        state.summary = computeSummary(action.payload.products);
      })
      .addCase(fetchStatistics.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default statisticsSlice.reducer;
