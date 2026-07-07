import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRangeById, createRange, updateRange } from '../store/slices/rangesSlice';
import PageHeader from '../components/shared/PageHeader';
import { Loader2, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateRangeRequest } from '../types/models';

export default function RangeFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedRange, loading } = useAppSelector((s) => s.ranges);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateRangeRequest>();

  useEffect(() => {
    if (isEdit) dispatch(fetchRangeById(Number(id)));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedRange) {
      reset({ range_name: selectedRange.range_name, Number_of_days: selectedRange.Number_of_days });
    }
  }, [isEdit, selectedRange, reset]);

  const onSubmit = async (data: CreateRangeRequest) => {
    if (isEdit) {
      await dispatch(updateRange({ id: Number(id), data }));
      toast.success('הטווח עודכן בהצלחה');
    } else {
      await dispatch(createRange(data));
      toast.success('הטווח נוצר בהצלחה');
    }
    navigate('/ranges');
  };

  return (
    <div className="max-w-xl">
      <PageHeader
        title={isEdit ? 'עריכת טווח' : 'טווח חדש'}
        description={isEdit ? `עריכת "${selectedRange?.range_name}"` : 'הגדרת מחזור קניה חדש'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/50 rounded-2xl p-6 shadow-card space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">שם *</label>
          <input
            {...register('range_name', { required: 'שם הטווח נדרש' })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder='למשל: "שבועי", "חודשי"'
          />
          {errors.range_name && <p className="text-destructive text-xs mt-1.5">{errors.range_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground/80">מספר ימים *</label>
          <input
            type="number"
            {...register('Number_of_days', { required: 'נדרש להזין מספר ימים', valueAsNumber: true, min: 1 })}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder="7"
          />
          {errors.Number_of_days && <p className="text-destructive text-xs mt-1.5">{errors.Number_of_days.message}</p>}
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
            onClick={() => navigate('/ranges')}
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
