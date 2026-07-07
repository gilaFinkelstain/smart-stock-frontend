import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchStatistics } from '../store/slices/statisticsSlice';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import LoadingPage from '../components/shared/LoadingPage';
import EmptyState from '../components/shared/EmptyState';
import CycleBarChart from '../components/charts/CycleBarChart';
import PurchaseTimeline from '../components/charts/PurchaseTimeline';
import StabilityScatter from '../components/charts/StabilityScatter';
import { BarChart3, AlertTriangle, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

function scoreBadge(score: number) {
  if (score > 3) return <span className="inline-flex items-center rounded-lg bg-destructive/10 text-destructive px-2.5 py-1 text-xs font-semibold">דחוף</span>;
  if (score > 1.5) return <span className="inline-flex items-center rounded-lg bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">בינוני</span>;
  return <span className="inline-flex items-center rounded-lg bg-accent/10 text-accent px-2.5 py-1 text-xs font-semibold">רגוע</span>;
}

function StabilityBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[80px]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct > 70
              ? 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent)))'
              : pct > 40
                ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))'
                : 'linear-gradient(90deg, hsl(var(--destructive)), hsl(var(--destructive)/0.6))',
          }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-9">{pct}%</span>
    </div>
  );
}

export default function StatisticsPage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.userId)!;
  const { productStats, summary, loading, error } = useAppSelector((s) => s.statistics);

  useEffect(() => {
    dispatch(fetchStatistics(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <LoadingPage message="מנתח נתונים..." />;

  if (!summary || productStats.length === 0) {
    return (
      <div>
        <PageHeader title="סטטיסטיקה" description="ניתוח דפוסי קניה" />
        <EmptyState
          title="אין מספיק נתונים"
          description="צריך לפחות 3 קניות של כל מוצר כדי לנתח דפוסים. העלי עוד קבלות."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="סטטיסטיקה וניתוח" description="ניתוח דפוסי קניה ומחזורי רכישה" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="מוצרים מנותחים"
          value={summary.total_products_analyzed}
          icon={BarChart3}
          variant="primary"
        />
        <StatCard
          title="פריטים דחופים"
          value={summary.urgent_items}
          icon={AlertTriangle}
          variant="urgent"
          description="ציון דחיפות גבוה מ-1.5"
        />
        <StatCard
          title="מחזור ממוצע"
          value={`${summary.average_cycle} ימים`}
          icon={Clock}
        />
        <StatCard
          title="המוצר היציב ביותר"
          value={summary.most_stable_product ? `#${summary.most_stable_product.product_id}` : '—'}
          icon={Target}
          variant="accent"
          description={
            summary.most_stable_product
              ? `יציבות ${Math.round(summary.most_stable_product.stability * 100)}%`
              : undefined
          }
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CycleBarChart data={productStats} />
        <PurchaseTimeline data={productStats} />
      </div>

      {/* Chart Row 2 — Full width */}
      <StabilityScatter data={productStats} />

      {/* Data Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 tracking-tight">כל המוצרים — ממוין לפי דחיפות</h3>
        <DataTable
          columns={[
            {
              key: 'product_id',
              header: 'מוצר',
              render: (s) => <span className="font-medium">#{s.product_id}</span>,
            },
            {
              key: 'cycle',
              header: 'מחזור (ימים)',
              render: (s) => <span className="tabular-nums">{s.cycle} ימים</span>,
            },
            {
              key: 'days_since',
              header: 'ימים מהקניה',
              render: (s) => <span className="tabular-nums">{s.days_since}</span>,
            },
            {
              key: 'stability',
              header: 'יציבות',
              render: (s) => <StabilityBar value={s.stability} />,
            },
            {
              key: 'trend',
              header: 'מגמה',
              render: (s) => (
                <span className={s.trend > 0.05 ? 'text-destructive text-xs font-semibold' : s.trend < -0.05 ? 'text-accent text-xs font-semibold' : 'text-muted-foreground text-xs'}>
                  {s.trend > 0.05 ? '↑ מחריש' : s.trend < -0.05 ? '↓ מאט' : '→ יציב'}
                </span>
              ),
            },
            {
              key: 'n',
              header: 'קניות',
              render: (s) => <span className="tabular-nums">{s.n}</span>,
            },
            {
              key: 'score',
              header: 'ציון דחיפות',
              render: (s) => (
                <div className="flex items-center gap-2">
                  <span className="tabular-nums font-medium">{s.score}</span>
                  {scoreBadge(s.score)}
                </div>
              ),
            },
          ]}
          data={productStats}
          keyExtractor={(s) => s.product_id}
        />
      </div>
    </div>
  );
}
