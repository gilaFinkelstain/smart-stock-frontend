import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchShoppingList,
  generateShoppingList,
  deleteShoppingItem,
  updateShoppingItem,
  fillCartWithRamiLevy,
  clearGenerateResult,
  clearCartResult,
} from '../store/slices/shoppingListSlice';
import DataTable from '../components/shared/DataTable';
import PageHeader from '../components/shared/PageHeader';
import LoadingPage from '../components/shared/LoadingPage';
import { ListPlus, ShoppingCart, Trash2, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoppingListItem } from '../types/models';

export default function ShoppingListPage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.userId)!;
  const { items, loading, generateLoading, generateResult, cartFilling, cartResult } = useAppSelector((s) => s.shoppingList);
  const [showCartResults, setShowCartResults] = useState(false);

  useEffect(() => { dispatch(fetchShoppingList(userId)); }, [dispatch, userId]);

  useEffect(() => {
    if (generateResult) {
      toast.success(`נוספו ${generateResult.total_added} מוצרים לרשימה`);
      dispatch(fetchShoppingList(userId));
      dispatch(clearGenerateResult());
    }
  }, [generateResult, dispatch, userId]);

  useEffect(() => {
    if (cartResult) {
      setShowCartResults(true);
      dispatch(fetchShoppingList(userId));
    }
  }, [cartResult, dispatch, userId]);

  const handleGenerate = () => dispatch(generateShoppingList(userId));
  const handleFillCart = () => dispatch(fillCartWithRamiLevy(userId));

  const handleDelete = async (item: ShoppingListItem) => {
    await dispatch(deleteShoppingItem(item.id));
    toast.success('הפריט הוסר מהרשימה');
  };

  if (loading) return <LoadingPage message="טוען רשימת קניות..." />;

  return (
    <div>
      <PageHeader title="רשימת קניות" description="רשימת הקניות החכמה שלך — מבוססת על דפוסי הצריכה">
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={generateLoading}
            className="flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2.5 text-sm font-medium hover:bg-muted/70 disabled:opacity-50 transition-colors"
          >
            {generateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListPlus className="h-4 w-4" />}
            צור רשימה
          </button>
          <button
            onClick={handleFillCart}
            disabled={cartFilling}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
          >
            {cartFilling ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
            מלא עגלה ברמי לוי
          </button>
        </div>
      </PageHeader>

      <DataTable
        columns={[
          {
            key: 'product_name',
            header: 'מוצר',
            className: 'font-medium',
            render: (i) => i.product_name || `מוצר #${i.product_id}`,
          },
          {
            key: 'amount',
            header: 'כמות',
            render: (i) => (
              <input
                type="number"
                value={i.amount}
                min={1}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 1;
                  dispatch(updateShoppingItem({ id: i.id, data: { amount: v } }));
                }}
                className="w-20 rounded-lg border border-border/40 bg-background px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            ),
          },
          {
            key: 'range_name',
            header: 'טווח',
            render: (i) => i.range_name
              ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-muted/50 text-xs font-medium">{i.range_name}</span>
              : `#${i.range_enum}`,
          },
          {
            key: 'actions',
            header: '',
            render: (i) => (
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground/60 hover:text-destructive"
                title="הסר מהרשימה"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        data={items}
        keyExtractor={(i) => i.id}
        emptyMessage="רשימת הקניות ריקה. לחצי על 'צור רשימה' להפקה אוטומטית לפי דפוסי הצריכה שלך."
      />

      {/* Cart fill results dialog */}
      {showCartResults && cartResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            className="fixed inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => { setShowCartResults(false); dispatch(clearCartResult()); }}
          />
          <div className="relative bg-card rounded-2xl shadow-card-lg p-6 w-full max-w-md mx-4 animate-scale-in border border-border/50">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-2xl" />
            <h3 className="text-lg tracking-tight mb-4">תוצאות מילוי עגלה — רמי לוי</h3>
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {cartResult.results.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-medium">{r.product_name}</span>
                  {r.success ? (
                    <Check className="h-5 w-5 text-accent" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowCartResults(false); dispatch(clearCartResult()); }}
              className="mt-5 w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm shadow-primary/15 hover:opacity-95 active:scale-[0.98] transition-all duration-200"
            >
              סגירה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
