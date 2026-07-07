import api from '../lib/api';
import type { ShoppingListItem, CreateShoppingListItemRequest, GenerateShoppingListResponse } from '../types/models';

export const getShoppingList = (userId: number): Promise<ShoppingListItem[]> =>
  api.get(`/shopping/user/${userId}`).then((r) => r.data);

export const createShoppingItem = (data: CreateShoppingListItemRequest): Promise<{ id: number }> =>
  api.post('/shopping', data).then((r) => r.data);

export const updateShoppingItem = (id: number, data: Partial<ShoppingListItem>): Promise<void> =>
  api.put(`/shopping/${id}`, data);

export const deleteShoppingItem = (id: number): Promise<void> =>
  api.delete(`/shopping/${id}`);

export const generateShoppingList = (userId: number): Promise<GenerateShoppingListResponse> =>
  api.post(`/shopping/generate/${userId}`).then((r) => r.data);
