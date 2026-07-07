import api from '../lib/api';
import type { Category, CreateCategoryRequest } from '../types/models';

export const getCategories = (): Promise<Category[]> =>
  api.get('/category').then((r) => r.data);

export const getCategory = (id: number): Promise<Category> =>
  api.get(`/category/${id}`).then((r) => r.data);

export const createCategory = (data: CreateCategoryRequest): Promise<Category> =>
  api.post('/category', data).then((r) => r.data);
