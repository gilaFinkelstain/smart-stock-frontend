import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRanges, deleteRange } from '../store/slices/rangesSlice';
import DataTable from '../components/shared/DataTable';
import PageHeader from '../components/shared/PageHeader';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingPage from '../components/shared/LoadingPage';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Range } from '../types/models';

function CycleBadge({ days }: { days: number }) {
  if (days <= 7) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">
      <Clock className="h-3 w-3" /> קצר
    </span>
  );
  if (days <= 30) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
      <Clock className="h-3 w-3" /> בינוני
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-medium">
      <Clock className="h-3 w-3" /> ארוך
    </span>
  );
}

export default function RangesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useAppSelector((s) => s.ranges);
  const [deleteTarget, setDeleteTarget] = useState<Range | null>(null);

  useEffect(() => { dispatch(fetchRanges()); }, [dispatch]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteRange(deleteTarget.id));
    toast.success('הטווח נמחק בהצלחה');
    setDeleteTarget(null);
  };

  if (loading) return <LoadingPage message="טוען טווחי קניה..." />;

  return (
    <div>
      <PageHeader title="טווחי קניה" description="ניהול מחזורי קניה — שבועי, חודשי, רבעוני">
        <button
          onClick={() => navigate('/ranges/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          טווח חדש
        </button>
      </PageHeader>

      <DataTable
        columns={[
          { key: 'id', header: 'מזהה' },
          { key: 'range_name', header: 'שם', className: 'font-medium' },
          {
            key: 'Number_of_days',
            header: 'ימי מחזור',
            render: (r) => (
              <div className="flex items-center gap-2">
                <span>{r.Number_of_days} ימים</span>
                <CycleBadge days={r.Number_of_days} />
              </div>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/ranges/${r.id}/edit`); }}
                  className="p-2 rounded-lg hover:bg-muted/70 transition-colors text-muted-foreground/60 hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground/60 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={items}
        keyExtractor={(r) => r.id}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="מחיקת טווח"
        message={`האם למחוק את "${deleteTarget?.range_name}"? פעולה זו אינה הפיכה.`}
        variant="danger"
        confirmLabel="מחק"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
