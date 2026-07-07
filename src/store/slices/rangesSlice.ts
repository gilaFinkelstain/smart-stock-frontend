import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as rangesService from '../../services/rangesService';
import type { Range, CreateRangeRequest } from '../../types/models';

interface RangesState {
  items: Range[];
  selectedRange: Range | null;
  loading: boolean;
  error: string | null;
}

const initialState: RangesState = {
  items: [],
  selectedRange: null,
  loading: false,
  error: null,
};

export const fetchRanges = createAsyncThunk('ranges/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await rangesService.getRanges();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchRangeById = createAsyncThunk('ranges/fetchById', async (id: number, { rejectWithValue }) => {
  try {
    return await rangesService.getRange(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createRange = createAsyncThunk('ranges/create', async (data: CreateRangeRequest, { rejectWithValue }) => {
  try {
    return await rangesService.createRange(data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateRange = createAsyncThunk<{ id: number; data: Partial<Range> }, { id: number; data: Partial<Range> }>('ranges/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    await rangesService.updateRange(id, data);
    return { id, data };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteRange = createAsyncThunk('ranges/delete', async (id: number, { rejectWithValue }) => {
  try {
    await rangesService.deleteRange(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const rangesSlice = createSlice({
  name: 'ranges',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRanges.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRanges.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchRanges.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchRangeById.fulfilled, (state, action) => { state.selectedRange = action.payload; })
      .addCase(createRange.fulfilled, (state, action) => {
        state.items.push({ id: action.payload.id, ...action.meta.arg } as Range);
      })
      .addCase(updateRange.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) Object.assign(state.items[idx], action.payload.data);
      })
      .addCase(deleteRange.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default rangesSlice.reducer;
