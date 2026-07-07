import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductRangeById, createProductRange, updateProductRange } from '../store/slices/productRangeSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchRanges } from '../store/slices/rangesSlice';
import PageHeader from '../components/shared/PageHeader';
import { Loader2, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateProductRangeRequest } from '../types/models';

export default function ProductRangeFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedItem, loading } = useAppSelector((s) => s.productRange);
  const { items: products } = useAppSelector((s) => s.products);
  const { items: ranges } = useAppSelector((s) => s.ranges);
  const userId = useAppSelector((s) => s.auth.userId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProductRangeRequest>({
    defaultValues: { user_id: userId ?? 1 },
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRanges());
    if (isEdit) dispatch(fetchProductRangeById(Number(id)));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedItem) {
      reset({ user_id: selectedItem.user_id, Products_id: selectedItem.Products_id, Range_id: selectedItem.Range_id });
    }
  }, [isEdit, selectedItem, reset]);

  const onSubmit = async (data: CreateProductRangeRequest) => {
    if (isEdit) {
      await dispatch(updateProductRange({ id: Number(id), data }));
      toast.success('השיוך עודכן בהצלחה');
    } else {
      await dispatch(createProductRange(data));
      toast.success('השיוך נוצר בהצלחה');
    }
    navigate('/product-range');
  };

  return (
    <div className="max-w-xl">
      <PageHeader
        title={isEdit ? 'עריכת שיוך' : 'שיוך חדש'}
        description={isEdit ? 'עדכון שיוך מוצר למשתמש' : 'שיוך מוצר למשתמש עם מחזור קניה'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/50 rounded-2xl p-6 shadow-card space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">מזהה משתמש *</label>
          <input
            type="number"
            {...register('user_id', { required: true, valueAsNumber: true })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">מוצר *</label>
          <select
            {...register('Products_id', { required: true, valueAsNumber: true })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          >
            <option value="">בחרי מוצר...</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">טווח *</label>
          <select
            {...register('Range_id', { required: true, valueAsNumber: true })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          >
            <option value="">בחרי טווח...</option>
            {ranges.map((r) => <option key={r.id} value={r.id}>{r.range_name} ({r.Number_of_days} ימים)</option>)}
          </select>
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
            onClick={() => navigate('/product-range')}
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
