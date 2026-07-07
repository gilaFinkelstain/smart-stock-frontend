import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchRanges } from '../store/slices/rangesSlice';
import DataTable from '../components/shared/DataTable';
import PageHeader from '../components/shared/PageHeader';
import LoadingPage from '../components/shared/LoadingPage';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useAppSelector((s) => s.categories);
  const ranges = useAppSelector((s) => s.ranges.items);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRanges());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <LoadingPage message="טוען קטגוריות..." />;

  return (
    <div>
      <PageHeader title="קטגוריות" description="ניהול קטגוריות המוצרים במשק הבית">
        <button
          onClick={() => navigate('/categories/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          קטגוריה חדשה
        </button>
      </PageHeader>

      <DataTable
        columns={[
          { key: 'id', header: 'מזהה' },
          { key: 'name', header: 'שם', className: 'font-medium' },
          {
            key: 'range',
            header: 'טווח קניה',
            render: (c) => {
              const r = ranges.find((r) => r.id === c.range_id);
              return r
                ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 text-xs font-medium">{r.range_name} <span className="text-muted-foreground/50">·</span> {r.Number_of_days} ימים</span>
                : '—';
            },
          },
        ]}
        data={items}
        keyExtractor={(c) => c.id}
      />
    </div>
  );
}
