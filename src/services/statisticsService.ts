import api from '../lib/api';
import type { StatisticsResponse } from '../types/models';

export const getStatistics = (userId: number): Promise<StatisticsResponse> =>
  api.get(`/statistics/${userId}`).then((r) => r.data);
