import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategoryById, createCategory } from '../store/slices/categoriesSlice';
import { fetchRanges } from '../store/slices/rangesSlice';
import PageHeader from '../components/shared/PageHeader';
import { Loader2, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateCategoryRequest } from '../types/models';

export default function CategoryFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedCategory, loading } = useAppSelector((s) => s.categories);
  const { items: ranges } = useAppSelector((s) => s.ranges);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCategoryRequest>();

  useEffect(() => {
    dispatch(fetchRanges());
    if (isEdit) dispatch(fetchCategoryById(Number(id)));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedCategory) {
      reset({ name: selectedCategory.name, range_id: selectedCategory.range_id });
    }
  }, [isEdit, selectedCategory, reset]);

  const onSubmit = async (data: CreateCategoryRequest) => {
    await dispatch(createCategory(data));
    toast.success(isEdit ? 'הקטגוריה עודכנה' : 'הקטגוריה נוצרה בהצלחה');
    navigate('/categories');
  };

  return (
    <div className="max-w-xl">
      <PageHeader
        title={isEdit ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}
        description={isEdit ? `עריכת "${selectedCategory?.name}"` : 'הוספת קטגוריה חדשה'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/50 rounded-2xl p-6 shadow-card space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">שם *</label>
          <input
            {...register('name', { required: 'שם הקטגוריה נדרש' })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder='למשל: "מוצרי חלב", "חומרי ניקוי"'
          />
          {errors.name && <p className="text-destructive text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">טווח קניה *</label>
          <select
            {...register('range_id', { required: 'נא לבחור טווח', valueAsNumber: true })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          >
            <option value="">בחרי טווח...</option>
            {ranges.map((r) => (
              <option key={r.id} value={r.id}>{r.range_name} ({r.Number_of_days} ימים)</option>
            ))}
          </select>
          {errors.range_id && <p className="text-destructive text-xs mt-1.5">{errors.range_id.message}</p>}
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            שמירה
          </button>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border border-border/60 hover:bg-muted/70 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}
