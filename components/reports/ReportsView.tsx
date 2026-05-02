'use client';

import React from 'react';
import { Card } from '@/components/ui';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ReportsView() {
  // Mock Data for Cash Flow
  const cashFlowData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [8500000, 9200000, 8500000, 11000000, 8500000, 9500000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [6200000, 7100000, 5800000, 9400000, 6000000, 6500000],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const categoryData = {
    labels: ['Housing', 'Food', 'Transport', 'Shopping', 'Others'],
    datasets: [
      {
        data: [45, 20, 15, 10, 10],
        backgroundColor: ['#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#94a3b8'],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Financial Intelligence</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Deep dive into your spending habits and trends</p>
      </div>

      {/* Top Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Average Monthly Savings" value="Rp 2,850,000" percentage="+12%" positive={true} />
        <StatCard title="Savings Rate" value="32.5%" percentage="+5.2%" positive={true} />
        <StatCard title="Burn Rate" value="Rp 210,000 / day" percentage="-3%" positive={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Cash Flow Trend</h3>
          <div style={{ height: '300px' }}>
            <Line data={cashFlowData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </Card>
        
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Spending Breakdown</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Monthly Comparison</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Vs last month</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ComparisonRow label="Food & Dining" current={2400000} previous={2100000} color="#f59e0b" />
            <ComparisonRow label="Transport" current={850000} previous={1100000} color="#3b82f6" />
            <ComparisonRow label="Entertainment" current={600000} previous={450000} color="#8b5cf6" />
          </div>
        </Card>

        <Card style={{ padding: '24px', background: 'linear-gradient(135deg, var(--primary-color) 0%, #4338ca 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>AI Prediction</h3>
          <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '24px' }}>Based on your current trajectory</p>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Predicted Savings: Rp 3.2M</div>
          <p style={{ fontSize: '0.8125rem', opacity: 0.9, lineHeight: 1.5 }}>
            You are spending 15% less on shopping this month. If you maintain this, you can reach your "New Car" goal 2 months earlier!
          </p>
          <button style={{ 
            marginTop: '20px', 
            padding: '10px 16px', 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            border: '1px solid rgba(255,255,255,0.3)', 
            borderRadius: '8px', 
            color: 'white', 
            fontWeight: 600, 
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}>
            Download Full Report
          </button>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, percentage, positive }: any) {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: positive ? 'var(--success-color)' : 'var(--danger-color)' }}>{percentage}</div>
      </div>
    </Card>
  );
}

function ComparisonRow({ label, current, previous, color }: any) {
  const diff = ((current - previous) / previous) * 100;
  const isUp = diff > 0;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: color }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Rp {current.toLocaleString()}</div>
        <div style={{ fontSize: '0.6875rem', color: isUp ? 'var(--danger-color)' : 'var(--success-color)', fontWeight: 700 }}>
          {isUp ? '↑' : '↓'} {Math.abs(Math.round(diff))}% vs last month
        </div>
      </div>
    </div>
  );
}
