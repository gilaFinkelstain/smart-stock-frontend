import api from '../lib/api';
import type { Product, CreateProductRequest } from '../types/models';

export const getProducts = (): Promise<Product[]> =>
  api.get('/products').then((r) => r.data);

export const getProduct = (id: number): Promise<Product> =>
  api.get(`/products/${id}`).then((r) => r.data);

export const createProduct = (data: CreateProductRequest): Promise<Product> =>
  api.post('/products', data).then((r) => r.data);

export const updateProduct = (id: number, data: Partial<Product>): Promise<Product> =>
  api.put(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: number): Promise<void> =>
  api.delete(`/products/${id}`);
