import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import rangesReducer from './slices/rangesSlice';
import receiptsReducer from './slices/receiptsSlice';
import shoppingListReducer from './slices/shoppingListSlice';
import productRangeReducer from './slices/productRangeSlice';
import statisticsReducer from './slices/statisticsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
    ranges: rangesReducer,
    receipts: receiptsReducer,
    shoppingList: shoppingListReducer,
    productRange: productRangeReducer,
    statistics: statisticsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
