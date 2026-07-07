import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ProductStatistic } from '../../types/models';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: ProductStatistic[];
}

// Warm, personal chart palette
const chartColors = {
  primary: '#D4784C',
  secondary: '#8B5E3C',
  accent: '#4A7C59',
  muted: '#C9977A',
};

export default function CycleBarChart({ data }: Props) {
  const top10 = [...data].slice(0, 10);

  const chartData = {
    labels: top10.map((s) => `#${s.product_id}`),
    datasets: [
      {
        label: 'מחזור קניה (ימים)',
        data: top10.map((s) => s.cycle),
        backgroundColor: top10.map((s) => {
          const alpha = 0.35 + s.stability * 0.65;
          return s.stability > 0.7
            ? `rgba(74, 124, 89, ${alpha})`
            : `rgba(212, 120, 76, ${alpha})`;
        }),
        borderColor: '#D4784C',
        borderWidth: 1,
        borderRadius: 6,
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
        text: 'מחזורי קניה — 10 המוצרים המובילים',
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
          label: (ctx: any) => `${ctx.raw} ימים`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'ימים',
          color: '#8B7355',
          font: { family: "'Assistant', sans-serif", size: 11 },
        },
        grid: { color: 'rgba(139, 115, 85, 0.12)' },
        ticks: { color: '#8B7355', font: { family: "'Assistant', sans-serif", size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#5C4A3A', font: { family: "'Assistant', sans-serif", size: 11 } },
      },
    },
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
      {/* Accent strip */}
      <div className="-mx-6 -mt-6 mb-0 h-1 bg-gradient-to-l from-primary via-primary to-accent/60 rounded-t-2xl" />
      <div className="mt-5">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
