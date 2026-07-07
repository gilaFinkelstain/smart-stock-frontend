import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductById, createProduct, updateProduct, clearSelectedProduct } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import PageHeader from '../components/shared/PageHeader';
import { Loader2, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateProductRequest } from '../types/models';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading } = useAppSelector((s) => s.products);
  const { items: categories } = useAppSelector((s) => s.categories);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProductRequest>();

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEdit) {
      dispatch(fetchProductById(Number(id)));
    }
    return () => { dispatch(clearSelectedProduct()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedProduct) {
      reset({
        name: selectedProduct.name,
        category_id: selectedProduct.category_id,
        volume_ml: selectedProduct.volume_ml ?? undefined,
        code: selectedProduct.code ?? undefined,
      });
    }
  }, [isEdit, selectedProduct, reset]);

  const onSubmit = async (data: CreateProductRequest) => {
    if (isEdit) {
      await dispatch(updateProduct({ id: Number(id), data }));
      toast.success('המוצר עודכן בהצלחה');
    } else {
      await dispatch(createProduct(data));
      toast.success('המוצר נוצר בהצלחה');
    }
    navigate('/products');
  };

  return (
    <div className="max-w-xl">
      <PageHeader
        title={isEdit ? 'עריכת מוצר' : 'מוצר חדש'}
        description={isEdit ? `עריכת "${selectedProduct?.name}"` : 'הוספת מוצר חדש למערכת'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/50 rounded-2xl p-6 shadow-card space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">שם המוצר *</label>
          <input
            {...register('name', { required: 'שם המוצר נדרש' })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder="למשל: חלב טרה 3%"
          />
          {errors.name && <p className="text-destructive text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">ברקוד</label>
          <input
            {...register('code')}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder="729..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">קטגוריה *</label>
          <select
            {...register('category_id', { required: 'נא לבחור קטגוריה', valueAsNumber: true })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          >
            <option value="">בחרי קטגוריה...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-destructive text-xs mt-1.5">{errors.category_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">נפח (מ״ל)</label>
          <input
            type="number"
            {...register('volume_ml', { valueAsNumber: true })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder="1000"
          />
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? 'עדכון מוצר' : 'שמירת מוצר'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
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
