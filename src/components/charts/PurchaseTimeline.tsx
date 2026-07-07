import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ProductStatistic } from '../../types/models';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  data: ProductStatistic[];
}

// Warm palette for multi-series
const COLORS = ['#D4784C', '#4A7C59', '#8B5E3C', '#C44E4E', '#6B8F71'];

export default function PurchaseTimeline({ data }: Props) {
  const top5 = [...data].slice(0, 5);

  const now = new Date();

  const datasets = top5.map((item, i) => {
    const dates: Date[] = [];
    for (let j = item.n - 1; j >= 0; j--) {
      const d = new Date(now);
      d.setDate(d.getDate() - item.days_since - j * item.cycle);
      dates.push(d);
    }

    return {
      label: `#${item.product_id}`,
      data: dates.map((d, idx) => ({ x: d.toLocaleDateString('he-IL'), y: idx + 1 })),
      borderColor: COLORS[i % COLORS.length],
      backgroundColor: COLORS[i % COLORS.length],
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    };
  });

  const chartData = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: 'ציר זמן קניות — 5 המוצרים הדחופים',
        font: { family: "'Assistant', sans-serif", size: 14, weight: 'bold' as const },
        color: '#2D2B2A',
        padding: { bottom: 16 },
      },
      legend: {
        labels: {
          font: { family: "'Assistant', sans-serif", size: 11 },
          color: '#5C4A3A',
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#3D2E24',
        titleFont: { family: "'Assistant', sans-serif" },
        bodyFont: { family: "'Assistant', sans-serif" },
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: רכישה #${ctx.raw.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'תאריך',
          color: '#8B7355',
          font: { family: "'Assistant', sans-serif", size: 11 },
        },
        grid: { color: 'rgba(139, 115, 85, 0.12)' },
        ticks: { color: '#5C4A3A', font: { family: "'Assistant', sans-serif", size: 10 } },
      },
      y: {
        title: {
          display: true,
          text: 'מספר רכישה',
          color: '#8B7355',
          font: { family: "'Assistant', sans-serif", size: 11 },
        },
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#5C4A3A', font: { family: "'Assistant', sans-serif", size: 11 } },
        grid: { color: 'rgba(139, 115, 85, 0.12)' },
      },
    },
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <div className="-mx-6 -mt-6 mb-0 h-1 bg-gradient-to-l from-secondary via-secondary to-primary/60 rounded-t-2xl" />
      <div className="mt-5">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
