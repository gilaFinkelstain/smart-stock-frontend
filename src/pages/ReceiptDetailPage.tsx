import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReceiptProducts, clearSelectedReceipt } from '../store/slices/receiptsSlice';
import DataTable from '../components/shared/DataTable';
import PageHeader from '../components/shared/PageHeader';
import LoadingPage from '../components/shared/LoadingPage';
import StatCard from '../components/shared/StatCard';
import { ArrowRight, Package, Hash } from 'lucide-react';

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { receiptProducts, loading } = useAppSelector((s) => s.receipts);

  useEffect(() => {
    if (id) dispatch(fetchReceiptProducts(Number(id)));
    return () => { dispatch(clearSelectedReceipt()); };
  }, [dispatch, id]);

  if (loading) return <LoadingPage message="טוען מוצרי קבלה..." />;

  const totalQuantity = receiptProducts.reduce((sum, p) => sum + (p.amount || 0), 0);
  const uniqueProducts = new Set(receiptProducts.map((p) => p.product_id)).size;

  return (
    <div>
      <PageHeader title={`קבלה #${id}`} description={`פירוט מוצרים בקבלה`}>
        <button
          onClick={() => navigate('/receipts')}
          className="flex items-center gap-2 text-sm font-medium rounded-xl border border-border/60 px-4 py-2.5 hover:bg-muted/70 transition-colors"
        >
          <ArrowRight className="h-4 w-4" /> חזרה לקבלות
        </button>
      </PageHeader>

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard title="סה״כ מוצרים בקבלה" value={receiptProducts.length} icon={Package} variant="primary" />
        <StatCard title="מוצרים ייחודיים" value={uniqueProducts} icon={Hash} />
      </div>

      <DataTable
        columns={[
          { key: 'product_name', header: 'שם מוצר', className: 'font-medium' },
          { key: 'product_code', header: 'ברקוד', render: (p) => p.product_code || '—' },
          { key: 'amount', header: 'כמות', render: (p) => <span className="tabular-nums font-medium">{p.amount}</span> },
          { key: 'volume_ml', header: 'נפח', render: (p) => p.volume_ml ? `${p.volume_ml} מ״ל` : '—' },
        ]}
        data={receiptProducts}
        keyExtractor={(p) => p.id}
      />
    </div>
  );
}
