import api from '../lib/api';
import type { Range, CreateRangeRequest } from '../types/models';

export const getRanges = (): Promise<Range[]> =>
  api.get('/range').then((r) => r.data);

export const getRange = (id: number): Promise<Range> =>
  api.get(`/range/${id}`).then((r) => r.data);

export const createRange = (data: CreateRangeRequest): Promise<{ id: number }> =>
  api.post('/range', data).then((r) => r.data);

export const updateRange = (id: number, data: Partial<Range>): Promise<void> =>
  api.put(`/range/${id}`, data);

export const deleteRange = (id: number): Promise<void> =>
  api.delete(`/range/${id}`);
