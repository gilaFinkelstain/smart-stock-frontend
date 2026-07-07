import api from '../lib/api';
import type { FillCartResponse } from '../types/models';

export const fillCart = (userId: number): Promise<FillCartResponse> =>
  api.post('/rami-levy/fill-cart', { user_id: userId }).then((r) => r.data);
