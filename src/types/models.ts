// ============================================================
// Smart Stock — Client Type Definitions
// ============================================================

// === User ===
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// === Category ===
export interface Category {
  id: number;
  name: string;
  range_id: number;
}

export interface CreateCategoryRequest {
  name: string;
  range_id: number;
}

// === Product ===
export interface Product {
  id: number;
  name: string;
  category_id: number;
  volume_ml: number | null;
  code?: string | null;
}

export interface CreateProductRequest {
  name: string;
  category_id: number;
  volume_ml?: number;
  code?: string;
}

// === Range ===
export interface Range {
  id: number;
  range_name: string;
  Number_of_days: number;
}

export interface CreateRangeRequest {
  range_name: string;
  Number_of_days: number;
}

// === Receipt ===
export interface Receipt {
  id: number;
  user_id: number;
  receipt_date?: string;
}

// === ReceptionProduct (line item in a receipt) ===
export interface ReceptionProduct {
  id: number;
  receipt_id: number;
  product_id: number;
  product_code: string | null;
  product_name: string;
  volume_ml: number | null;
  amount: number;
}

export interface UploadReceiptResponse {
  receipt_id: number;
  products: Array<{
    reception_id: number;
    product_id: number;
    product_code: string | null;
    name: string;
    amount: number;
  }>;
}

// === ShoppingList ===
export interface ShoppingListItem {
  id: number;
  product_id: number;
  product_name?: string;
  amount: number;
  range_enum: number;
  range_name?: string;
}

export interface CreateShoppingListItemRequest {
  user_id: number;
  product_id: number;
  amount?: number;
  range_enum?: number;
}

export interface GenerateShoppingListResponse {
  message: string;
  user_id: number;
  products_added: Array<{ product_id: number; product_name: string | null }>;
  total_added: number;
}

// === ProductRangeForUser ===
export interface ProductRangeForUser {
  id: number;
  user_id: number;
  Products_id: number;
  Range_id: number;
}

export interface CreateProductRangeRequest {
  user_id: number;
  Products_id: number;
  Range_id: number;
}

// === Statistics ===
export interface ProductStatistic {
  product_id: number;
  cycle: number;
  stability: number;
  trend: number;
  days_since: number;
  score: number;
  n: number;
}

export interface StatisticsResponse {
  user_id: number;
  products: ProductStatistic[];
  total_analyzed: number;
}

// === Rami Levy Cart ===
export interface FillCartResponse {
  message: string;
  results: Array<{
    product_id: number;
    product_name: string;
    success: boolean;
    error?: string;
  }>;
}

// === API Error ===
export interface ApiError {
  error: string;
}
