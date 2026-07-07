import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as receiptsService from '../../services/receiptsService';
import type { Receipt, ReceptionProduct } from '../../types/models';

interface ReceiptsState {
  items: Receipt[];
  selectedReceipt: Receipt | null;
  receiptProducts: ReceptionProduct[];
  uploadProgress: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReceiptsState = {
  items: [],
  selectedReceipt: null,
  receiptProducts: [],
  uploadProgress: null,
  loading: false,
  error: null,
};

export const fetchReceiptsByUser = createAsyncThunk('receipts/fetchByUser', async (userId: number, { rejectWithValue }) => {
  try {
    return await receiptsService.getReceiptsByUser(userId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchReceiptProducts = createAsyncThunk('receipts/fetchProducts', async (receiptId: number, { rejectWithValue }) => {
  try {
    return await receiptsService.getReceiptProducts(receiptId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const uploadReceipt = createAsyncThunk('receipts/upload', async (
  { file, userId, onProgress }: { file: File; userId: number; onProgress?: (pct: number) => void },
  { rejectWithValue }
) => {
  try {
    return await receiptsService.uploadReceipt(file, userId, onProgress);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteReceipt = createAsyncThunk('receipts/delete', async (id: number, { rejectWithValue }) => {
  try {
    await receiptsService.deleteReceipt(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const receiptsSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    clearUploadProgress: (state) => { state.uploadProgress = null; },
    clearSelectedReceipt: (state) => { state.selectedReceipt = null; state.receiptProducts = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceiptsByUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReceiptsByUser.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchReceiptsByUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchReceiptProducts.fulfilled, (state, action) => { state.receiptProducts = action.payload; })
      .addCase(uploadReceipt.pending, (state) => { state.uploadProgress = 0; state.error = null; })
      .addCase(uploadReceipt.fulfilled, (state, action) => {
        state.uploadProgress = 100;
        state.items.unshift({ id: action.payload.receipt_id, user_id: action.meta.arg.userId });
      })
      .addCase(uploadReceipt.rejected, (state, action) => { state.uploadProgress = null; state.error = action.payload as string; })
      .addCase(deleteReceipt.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearUploadProgress, clearSelectedReceipt } = receiptsSlice.actions;
export default receiptsSlice.reducer;
