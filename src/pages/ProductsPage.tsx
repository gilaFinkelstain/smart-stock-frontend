import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, deleteProduct } from '../store/slices/productsSlice';
import DataTable from '../components/shared/DataTable';
import PageHeader from '../components/shared/PageHeader';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingPage from '../components/shared/LoadingPage';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../types/models';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useAppSelector((s) => s.products);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteProduct(deleteTarget.id));
    toast.success('המוצר נמחק בהצלחה');
    setDeleteTarget(null);
  };

  if (loading) return <LoadingPage message="טוען מוצרים..." />;

  return (
    <div>
      <PageHeader title="מוצרים" description="ניהול המוצרים במשק הבית">
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          מוצר חדש
        </button>
      </PageHeader>

      <DataTable
        columns={[
          { key: 'id', header: 'מזהה' },
          { key: 'name', header: 'שם מוצר', className: 'font-medium' },
          { key: 'code', header: 'ברקוד', render: (p) => p.code || '—' },
          { key: 'category_id', header: 'קטגוריה' },
          { key: 'volume_ml', header: 'נפח (מ״ל)', render: (p) => p.volume_ml || '—' },
          {
            key: 'actions',
            header: '',
            render: (p) => (
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/products/${p.id}/edit`); }}
                  className="p-2 rounded-lg hover:bg-muted/70 transition-colors text-muted-foreground/60 hover:text-foreground"
                  title="ערוך"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
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
        keyExtractor={(p) => p.id}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="מחיקת מוצר"
        message={`האם למחוק את "${deleteTarget?.name}"? פעולה זו אינה הפיכה.`}
        variant="danger"
        confirmLabel="מחק"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
