import api from '../lib/api';
import type { ProductRangeForUser, CreateProductRangeRequest } from '../types/models';

export const getProductRanges = (): Promise<ProductRangeForUser[]> =>
  api.get('/product-range-for-user').then((r) => r.data);

export const getProductRange = (id: number): Promise<ProductRangeForUser> =>
  api.get(`/product-range-for-user/${id}`).then((r) => r.data);

export const createProductRange = (data: CreateProductRangeRequest): Promise<{ id: number }> =>
  api.post('/product-range-for-user', data).then((r) => r.data);

export const updateProductRange = (id: number, data: Partial<ProductRangeForUser>): Promise<void> =>
  api.put(`/product-range-for-user/${id}`, data);

export const deleteProductRange = (id: number): Promise<void> =>
  api.delete(`/product-range-for-user/${id}`);
