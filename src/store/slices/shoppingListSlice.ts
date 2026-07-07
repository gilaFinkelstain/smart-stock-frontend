import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as shoppingListService from '../../services/shoppingListService';
import * as ramiLevyService from '../../services/ramiLevyService';
import type { ShoppingListItem, CreateShoppingListItemRequest, FillCartResponse } from '../../types/models';

interface ShoppingListState {
  items: ShoppingListItem[];
  loading: boolean;
  error: string | null;
  generateLoading: boolean;
  generateResult: { products_added: Array<{ product_id: number; product_name: string | null }>; total_added: number } | null;
  cartFilling: boolean;
  cartResult: FillCartResponse | null;
}

const initialState: ShoppingListState = {
  items: [],
  loading: false,
  error: null,
  generateLoading: false,
  generateResult: null,
  cartFilling: false,
  cartResult: null,
};

export const fetchShoppingList = createAsyncThunk('shopping/fetchAll', async (userId: number, { rejectWithValue }) => {
  try {
    return await shoppingListService.getShoppingList(userId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createShoppingItem = createAsyncThunk('shopping/create', async (data: CreateShoppingListItemRequest, { rejectWithValue }) => {
  try {
    return await shoppingListService.createShoppingItem(data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateShoppingItem = createAsyncThunk('shopping/update', async (
  { id, data }: { id: number; data: Partial<ShoppingListItem> },
  { rejectWithValue }
) => {
  try {
    await shoppingListService.updateShoppingItem(id, data);
    return { id, ...data };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteShoppingItem = createAsyncThunk('shopping/delete', async (id: number, { rejectWithValue }) => {
  try {
    await shoppingListService.deleteShoppingItem(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const generateShoppingList = createAsyncThunk('shopping/generate', async (userId: number, { rejectWithValue }) => {
  try {
    return await shoppingListService.generateShoppingList(userId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fillCartWithRamiLevy = createAsyncThunk('shopping/fillCart', async (userId: number, { rejectWithValue }) => {
  try {
    return await ramiLevyService.fillCart(userId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    clearGenerateResult: (state) => { state.generateResult = null; },
    clearCartResult: (state) => { state.cartResult = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoppingList.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchShoppingList.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchShoppingList.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createShoppingItem.fulfilled, (state, action) => { state.items.push(action.meta.arg as any); })
      .addCase(updateShoppingItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
      })
      .addCase(deleteShoppingItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(generateShoppingList.pending, (state) => { state.generateLoading = true; })
      .addCase(generateShoppingList.fulfilled, (state, action) => { state.generateLoading = false; state.generateResult = action.payload; })
      .addCase(generateShoppingList.rejected, (state, action) => { state.generateLoading = false; state.error = action.payload as string; })
      .addCase(fillCartWithRamiLevy.pending, (state) => { state.cartFilling = true; state.cartResult = null; })
      .addCase(fillCartWithRamiLevy.fulfilled, (state, action) => { state.cartFilling = false; state.cartResult = action.payload; })
      .addCase(fillCartWithRamiLevy.rejected, (state, action) => { state.cartFilling = false; state.error = action.payload as string; });
  },
});

export const { clearGenerateResult, clearCartResult } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
