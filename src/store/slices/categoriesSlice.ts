import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoriesService from '../../services/categoriesService';
import type { Category, CreateCategoryRequest } from '../../types/models';

interface CategoriesState {
  items: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await categoriesService.getCategories();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchCategoryById = createAsyncThunk('categories/fetchById', async (id: number, { rejectWithValue }) => {
  try {
    return await categoriesService.getCategory(id);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createCategory = createAsyncThunk('categories/create', async (data: CreateCategoryRequest, { rejectWithValue }) => {
  try {
    return await categoriesService.createCategory(data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchCategoryById.fulfilled, (state, action) => { state.selectedCategory = action.payload; })
      .addCase(createCategory.fulfilled, (state, action) => { state.items.push(action.payload); });
  },
});

export default categoriesSlice.reducer;
