import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ProductStatistic } from '../../types/models';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface Props {
  data: ProductStatistic[];
}

function urgencyColor(score: number): string {
  if (score > 3) return 'rgba(196, 78, 78, 0.75)';    // Deep red — urgent
  if (score > 1.5) return 'rgba(212, 120, 76, 0.75)';  // Terracotta — moderate
  return 'rgba(74, 124, 89, 0.75)';                    // Sage green — calm
}

function urgencyBorder(score: number): string {
  if (score > 3) return 'rgba(196, 78, 78, 1)';
  if (score > 1.5) return 'rgba(212, 120, 76, 1)';
  return 'rgba(74, 124, 89, 1)';
}

export default function StabilityScatter({ data }: Props) {
  const chartData = {
    datasets: [
      {
        label: 'מוצרים',
        data: data.map((s) => ({
          x: s.days_since / (s.cycle + 1),
          y: s.stability * 100,
          r: Math.max(4, Math.min(14, s.score * 3)),
        })),
        backgroundColor: data.map((s) => urgencyColor(s.score)),
        borderColor: data.map((s) => urgencyBorder(s.score)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'יציבות מול דחיפות',
        font: { family: "'Assistant', sans-serif", size: 14, weight: 'bold' as const },
        color: '#2D2B2A',
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: '#3D2E24',
        titleFont: { family: "'Assistant', sans-serif" },
        bodyFont: { family: "'Assistant', sans-serif" },
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (ctx: any) => {
            const item = data[ctx.dataIndex];
            return `#${item.product_id}: יציבות ${Math.round(item.stability * 100)}%, ציון ${item.score}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'יחס זמן שחלף / מחזור',
          color: '#8B7355',
          font: { family: "'Assistant', sans-serif", size: 11 },
        },
        grid: { color: 'rgba(139, 115, 85, 0.12)' },
        ticks: { color: '#5C4A3A', font: { family: "'Assistant', sans-serif", size: 11 } },
      },
      y: {
        title: {
          display: true,
          text: 'יציבות (%)',
          color: '#8B7355',
          font: { family: "'Assistant', sans-serif", size: 11 },
        },
        min: 0,
        max: 100,
        grid: { color: 'rgba(139, 115, 85, 0.12)' },
        ticks: { color: '#5C4A3A', font: { family: "'Assistant', sans-serif", size: 11 } },
      },
    },
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <div className="-mx-6 -mt-6 mb-0 h-1 bg-gradient-to-l from-accent via-accent to-primary/60 rounded-t-2xl" />
      <div className="mt-5">
        <Scatter data={chartData} options={options} />
      </div>
    </div>
  );
}
