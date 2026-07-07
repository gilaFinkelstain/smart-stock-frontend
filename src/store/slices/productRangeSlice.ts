import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productRangeService from '../../services/productRangeService';
import type { ProductRangeForUser, CreateProductRangeRequest } from '../../types/models';

interface ProductRangeState {
  items: ProductRangeForUser[];
  selectedItem: ProductRangeForUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductRangeState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

export const fetchProductRanges = createAsyncThunk('productRange/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await productRangeService.getProductRanges();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchProductRangeById = createAsyncThunk('productRange/fetchById', async (id: number, { rejectWithValue }) => {
  try {
    return await productRangeService.getProductRange(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createProductRange = createAsyncThunk('productRange/create', async (data: CreateProductRangeRequest, { rejectWithValue }) => {
  try {
    return await productRangeService.createProductRange(data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateProductRange = createAsyncThunk<{ id: number; data: Partial<ProductRangeForUser> }, { id: number; data: Partial<ProductRangeForUser> }>('productRange/update', async (
  { id, data },
  { rejectWithValue }
) => {
  try {
    await productRangeService.updateProductRange(id, data);
    return { id, data };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteProductRange = createAsyncThunk('productRange/delete', async (id: number, { rejectWithValue }) => {
  try {
    await productRangeService.deleteProductRange(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const productRangeSlice = createSlice({
  name: 'productRange',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductRanges.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductRanges.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProductRanges.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchProductRangeById.fulfilled, (state, action) => { state.selectedItem = action.payload; })
      .addCase(createProductRange.fulfilled, (state, action) => {
        state.items.push({ id: action.payload.id, ...action.meta.arg } as ProductRangeForUser);
      })
      .addCase(updateProductRange.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) Object.assign(state.items[idx], action.payload.data);
      })
      .addCase(deleteProductRange.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default productRangeSlice.reducer;
