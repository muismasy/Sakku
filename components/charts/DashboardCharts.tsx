'use client';

import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useLedgerData } from '@/hooks/useLedgerData';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export function DashboardCharts() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { transactions } = useLedgerData();
  const doughnutData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            '#10B981', // Primary Emerald
            '#3B82F6', // Blue
            '#F59E0B', // Amber
            '#EF4444'  // Red
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [transactions]);

  const lineData = useMemo(() => {
    // Basic mock logic: just grouping by whatever is there or mocking it
    // In reality, group by month
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Monthly Cash Flow',
          data: [1500, 2000, 1800, 2200, 1900, 2500],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        },
      ],
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  if (!mounted) {
    return <div className="card" style={{ minHeight: '300px' }}>Loading charts...</div>;
  }

  return (
    <div className="flex flex-col gap-4" style={{ width: '100%' }}>
      <div className="flex gap-4 flex-responsive" style={{ flexWrap: 'wrap' }}>
        <div className="card stack-on-mobile" style={{ flex: '1 1 300px', minHeight: '300px' }}>
          <h2 className="heading-2">Expenses Breakdown</h2>
          <div style={{ position: 'relative', height: '220px' }}>
            <Doughnut data={doughnutData} options={options} />
          </div>
        </div>
        <div className="card stack-on-mobile" style={{ flex: '2 1 500px', minHeight: '300px' }}>
          <h2 className="heading-2">Cash Flow Trend</h2>
          <div style={{ position: 'relative', height: '220px' }}>
            <Line data={lineData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
