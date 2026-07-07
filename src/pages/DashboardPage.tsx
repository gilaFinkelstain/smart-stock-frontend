import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchReceiptsByUser } from '../store/slices/receiptsSlice';
import { fetchShoppingList } from '../store/slices/shoppingListSlice';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import LoadingPage from '../components/shared/LoadingPage';
import { Package, Receipt, ShoppingCart, BarChart3, Upload, ListPlus, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const actions = [
  {
    label: 'העלה קבלה',
    description: 'PDF, JSON או קובץ טקסט',
    icon: Upload,
    to: '/receipts',
    color: 'from-primary/15 to-primary/5 border-primary/20 hover:border-primary/35',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    label: 'צור רשימת קניות',
    description: 'הפק רשימה אוטומטית חכמה',
    icon: ListPlus,
    to: '/shopping-list',
    color: 'from-accent/15 to-accent/5 border-accent/20 hover:border-accent/35',
    iconBg: 'bg-accent/10 text-accent',
  },
  {
    label: 'צפה בסטטיסטיקה',
    description: 'ניתוח דפוסי קניה ומגמות',
    icon: BarChart3,
    to: '/statistics',
    color: 'from-secondary/15 to-secondary/5 border-secondary/20 hover:border-secondary/35',
    iconBg: 'bg-secondary/10 text-secondary',
  },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((s) => s.auth.userId);
  const userName = useAppSelector((s) => s.auth.userName);
  const products = useAppSelector((s) => s.products);
  const receipts = useAppSelector((s) => s.receipts);
  const shoppingList = useAppSelector((s) => s.shoppingList);

  const loading = products.loading || receipts.loading || shoppingList.loading;

  useEffect(() => {
    if (userId) {
      dispatch(fetchProducts());
      dispatch(fetchReceiptsByUser(userId));
      dispatch(fetchShoppingList(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <LoadingPage message="טוען דשבורד..." />;

  const firstName = userName?.split(' ')[0] || 'משתמש';

  return (
    <div>
      {/* Warm welcome — more personal */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground/60 tracking-wide uppercase">
            {new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {firstName}, ברוכה הבאה
        </h1>
        <p className="mt-1.5 text-muted-foreground/70 text-sm max-w-lg leading-relaxed">
          הנה מה שקורה במשק הבית שלך. {shoppingList.items.length > 0
            ? `יש ${shoppingList.items.length} פריטים ברשימת הקניות שלך.`
            : 'התחילי בהעלאת קבלה חדשה.'}
        </p>
        <hr className="divider-warm mt-5" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="מוצרים במערכת"
          value={products.items.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="קבלות שהועלו"
          value={receipts.items.length}
          icon={Receipt}
        />
        <StatCard
          title="ברשימת הקניות"
          value={shoppingList.items.length}
          icon={ShoppingCart}
          variant="accent"
        />
        <StatCard
          title="מוצרים לניתוח"
          value={products.items.length > 0 ? `${products.items.length} זמינים` : 'אין'}
          icon={BarChart3}
          description={products.items.length > 0 ? 'לחצי לניתוח דפוסי קניה' : 'העלי קבלות כדי להתחיל'}
        />
      </div>

      {/* Quick actions — redesigned as warm cards */}
      <h2 className="text-lg font-semibold mb-4 tracking-tight">מה תרצי לעשות?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.to}
            onClick={() => navigate(action.to)}
            className={cn(
              'group relative flex items-center gap-4 p-5 rounded-2xl border',
              'bg-gradient-to-br transition-all duration-300',
              'hover:shadow-card-hover hover:-translate-y-0.5',
              action.color
            )}
          >
            <div className={cn(
              'h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110',
              action.iconBg
            )}>
              <action.icon className="h-6 w-6" />
            </div>
            <div className="text-right flex-1">
              <p className="font-semibold text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{action.description}</p>
            </div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground/25 group-hover:text-muted-foreground/50 transition-all duration-300 group-hover:-translate-x-0.5" />
          </button>
        ))}
      </div>

      {/* Quick stats strip */}
      {receipts.items.length > 0 && (
        <div className="mt-8 p-5 rounded-2xl border border-border/40 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{receipts.items.length}</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">קבלות החודש</p>
          </div>
          <div className="hidden sm:block h-10 w-px bg-border/60" />
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{products.items.length}</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">מוצרים ייחודיים</p>
          </div>
          <div className="hidden sm:block h-10 w-px bg-border/60" />
          <div>
            <p className="text-2xl font-bold tabular-nums text-accent">{shoppingList.items.length}</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">ממתינים לרכישה</p>
          </div>
        </div>
      )}
    </div>
  );
}
