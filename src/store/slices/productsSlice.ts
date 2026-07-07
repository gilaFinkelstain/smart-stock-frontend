import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productsService from '../../services/productsService';
import type { Product, CreateProductRequest } from '../../types/models';

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await productsService.getProducts();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: number, { rejectWithValue }) => {
  try {
    return await productsService.getProduct(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createProduct = createAsyncThunk('products/create', async (data: CreateProductRequest, { rejectWithValue }) => {
  try {
    return await productsService.createProduct(data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }: { id: number; data: Partial<Product> }, { rejectWithValue }) => {
  try {
    return await productsService.updateProduct(id, data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id: number, { rejectWithValue }) => {
  try {
    await productsService.deleteProduct(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.selectedProduct = action.payload; })
      .addCase(createProduct.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.selectedProduct = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
