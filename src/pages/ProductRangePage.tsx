import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductRanges, deleteProductRange } from '../store/slices/productRangeSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchRanges } from '../store/slices/rangesSlice';
import DataTable from '../components/shared/DataTable';
import PageHeader from '../components/shared/PageHeader';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingPage from '../components/shared/LoadingPage';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductRangeForUser } from '../types/models';

export default function ProductRangePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading } = useAppSelector((s) => s.productRange);
  const products = useAppSelector((s) => s.products.items);
  const ranges = useAppSelector((s) => s.ranges.items);
  const [deleteTarget, setDeleteTarget] = useState<ProductRangeForUser | null>(null);

  useEffect(() => {
    dispatch(fetchProductRanges());
    dispatch(fetchProducts());
    dispatch(fetchRanges());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteProductRange(deleteTarget.id));
    toast.success('השיוך נמחק בהצלחה');
    setDeleteTarget(null);
  };

  if (loading) return <LoadingPage message="טוען שיוכים..." />;

  return (
    <div>
      <PageHeader title="שיוך מוצרים למשתמשים" description="הגדרת אילו מוצרים המשתמש קונה ובאיזה מחזור">
        <button
          onClick={() => navigate('/product-range/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          שיוך חדש
        </button>
      </PageHeader>

      <DataTable
        columns={[
          { key: 'id', header: 'מזהה' },
          { key: 'user_id', header: 'משתמש' },
          {
            key: 'product',
            header: 'מוצר',
            className: 'font-medium',
            render: (pr) => {
              const p = products.find((p) => p.id === pr.Products_id);
              return p?.name || `#${pr.Products_id}`;
            },
          },
          {
            key: 'range',
            header: 'טווח',
            render: (pr) => {
              const r = ranges.find((r) => r.id === pr.Range_id);
              return r
                ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 text-xs font-medium">{r.range_name} <span className="text-muted-foreground/50">·</span> {r.Number_of_days} ימים</span>
                : `#${pr.Range_id}`;
            },
          },
          {
            key: 'actions',
            header: '',
            render: (pr) => (
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(pr); }}
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground/60 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        data={items}
        keyExtractor={(pr) => pr.id}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="הסרת שיוך"
        message="האם להסיר שיוך זה? פעולה זו אינה הפיכה."
        variant="danger"
        confirmLabel="הסר"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
