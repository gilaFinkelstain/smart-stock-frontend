import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReceiptsByUser, uploadReceipt, deleteReceipt, clearUploadProgress } from '../store/slices/receiptsSlice';
import DataTable from '../components/shared/DataTable';
import PageHeader from '../components/shared/PageHeader';
import FileUploader from '../components/shared/FileUploader';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingPage from '../components/shared/LoadingPage';
import { Trash2, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { Receipt } from '../types/models';

export default function ReceiptsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((s) => s.auth.userId)!;
  const { items, uploadProgress, loading, error } = useAppSelector((s) => s.receipts);
  const [deleteTarget, setDeleteTarget] = useState<Receipt | null>(null);

  useEffect(() => { dispatch(fetchReceiptsByUser(userId)); }, [dispatch, userId]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleUpload = async (file: File) => {
    const result = await dispatch(uploadReceipt({ file, userId, onProgress: () => {} }));
    if (uploadReceipt.fulfilled.match(result)) {
      toast.success(`הקבלה עובדה — ${result.payload.products.length} מוצרים זוהו`);
      dispatch(fetchReceiptsByUser(userId));
      dispatch(clearUploadProgress());
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteReceipt(deleteTarget.id));
    toast.success('הקבלה נמחקה בהצלחה');
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader title="קבלות" description="העלאה, צפייה וניתוח קבלות קניה" />

      <div className="mb-8 max-w-xl">
        <FileUploader onUpload={handleUpload} progress={uploadProgress} />
      </div>

      {loading ? (
        <LoadingPage message="טוען קבלות..." />
      ) : (
        <DataTable
          columns={[
            { key: 'id', header: 'מזהה' },
            {
              key: 'receipt_date',
              header: 'תאריך',
              className: 'font-medium',
              render: (r) => r.receipt_date
                ? <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground/40" />{new Date(r.receipt_date).toLocaleDateString('he-IL')}</span>
                : '—',
            },
            {
              key: 'actions',
              header: '',
              render: (r) => (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/receipts/${r.id}`); }}
                    className="p-2 rounded-lg hover:bg-muted/70 transition-colors text-muted-foreground/60 hover:text-foreground"
                    title="צפה בפרטים"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground/60 hover:text-destructive"
                    title="מחק"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={items}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => navigate(`/receipts/${r.id}`)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="מחיקת קבלה"
        message={`האם למחוק קבלה #${deleteTarget?.id}? הפעולה תסיר גם את כל המוצרים המשויכים.`}
        variant="danger"
        confirmLabel="מחק"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
