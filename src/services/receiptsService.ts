import api from '../lib/api';
import type { Receipt, ReceptionProduct, UploadReceiptResponse } from '../types/models';

export const getReceiptsByUser = (userId: number): Promise<Receipt[]> =>
  api.get(`/receipts/user/${userId}`).then((r) => r.data);

export const getReceiptProducts = (receiptId: number): Promise<ReceptionProduct[]> =>
  api.get(`/receipts/${receiptId}/products`).then((r) => r.data);

export const uploadReceipt = (
  file: File,
  userId: number,
  onProgress?: (pct: number) => void
): Promise<UploadReceiptResponse> => {
  const formData = new FormData();
  formData.append('receipt', file);
  formData.append('user_id', String(userId));
  return api.post('/receipts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100));
    },
  }).then((r) => r.data);
};

export const deleteReceipt = (id: number): Promise<void> =>
  api.delete(`/receipts/${id}`);
