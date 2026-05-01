'use client';

import React, { useMemo } from 'react';
import { useLedgerData } from '@/hooks/useLedgerData';
import { ProgressBar, Card, ListItem, Skeleton } from '@/components/ui';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

// ─── Helper ──────────────────────────────────────────────
function formatRp(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}k`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

// ─── Main Component ──────────────────────────────────────
interface HomeDashboardProps {
  ledgerName: string;
  ledger_id: string;
  onAddTransaction: () => void;
  onSelectTransaction: (id: string) => void;
  onSelectGoal: (id: string) => void;
}

export function HomeDashboard({ ledgerName, ledger_id, onAddTransaction, onSelectTransaction, onSelectGoal }: HomeDashboardProps) {
  const [mounted, setMounted] = React.useState(false);
  const { transactions, loading, error } = useLedgerData(ledger_id);

  React.useEffect(() => { setMounted(true); }, []);

  // Derived data
  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance = totalIncome - totalExpense;

  const doughnutData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(tx => {
      cats[tx.category] = (cats[tx.category] || 0) + tx.amount;
    });
    return {
      labels: Object.keys(cats),
      datasets: [{
        data: Object.values(cats),
        backgroundColor: ['#4F46E5', '#0EA5E9', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'],
        borderWidth: 0,
        spacing: 4,
        hoverOffset: 10
      }],
    };
  }, [transactions]);

  const recentTx = useMemo(() => [...transactions].sort((a, b) => b.date - a.date).slice(0, 5), [transactions]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger-color)', fontWeight: 600 }}>Database Connection Failed</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!mounted || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>

      {/* Greeting & Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 'var(--font-small)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }} suppressHydrationWarning>
            {greeting}, John 👋
          </p>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.04em' }}>
            {ledgerName}
          </h1>
        </div>
        <button
          onClick={onAddTransaction}
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
          }}
        >
          Quick Add
        </button>
      </section>

      {/* Balance Hero Card */}
      <Card style={{
        background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)',
        padding: '32px',
        color: '#fff',
        border: 'none',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(30, 27, 75, 0.25)'
      }}>
        {/* Abstract patterns for premium feel */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '80%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', transform: 'rotate(15deg)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: '0 0 8px', fontWeight: 600, letterSpacing: '0.02em' }}>Available Balance</p>
              <h2 style={{ fontSize: '2.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
                Rp {balance.toLocaleString('id-ID')}
              </h2>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              Primary Wallet
            </div>
          </div>

          <div style={{ display: 'flex', gap: '48px', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 700 }}>Income</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10B981' }}>↑</span>
                {formatRp(totalIncome)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 700 }}>Expenses</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#EF4444' }}>↓</span>
                {formatRp(totalExpense)}
              </p>
            </div>
          </div>
        </div>
      </Card>



      {/* Previews Row: Fixed Expenses & Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-section)' }}>
        {/* Fixed Expenses Preview */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Fixed Expenses</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', backgroundColor: 'var(--surface-secondary)', padding: '4px 8px', borderRadius: '6px' }}>Upcoming</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: '1', title: 'Home Rent', amount: 3500000, date: 'May 5', icon: '🏠' },
              { id: '2', title: 'Motor Installment', amount: 850000, date: 'May 12', icon: '🏍️' }
            ].map((exp) => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--surface-secondary)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.25rem' }}>{exp.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{exp.title}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Due {exp.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>{formatRp(exp.amount)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Goals Preview */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Savings Goals</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-color)', backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '4px 8px', borderRadius: '6px' }}>Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { id: '1', title: 'Emergency Fund', current: 5000000, target: 10000000, color: '#4F46E5' },
              { id: '2', title: 'Bali Holiday', current: 1500000, target: 5000000, color: '#10B981' }
            ].map((goal) => {
              const pct = Math.round((goal.current / goal.target) * 100);
              return (
                <div
                  key={goal.id}
                  onClick={() => onSelectGoal(goal.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{goal.title}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: goal.color }}>{pct}%</span>
                  </div>
                  <ProgressBar value={goal.current} max={goal.target} color={goal.color} height={8} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Transactions List */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Recent Activity</h3>
          <button style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-color)' }}>View All Activity</button>
        </div>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {recentTx.map((tx, i) => (
            <ListItem
              key={tx.id}
              icon={tx.type === 'income' ? '💰' : '💸'}
              label={tx.description}
              description={`${tx.category} • ${new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
              trailing={
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: tx.type === 'income' ? 'var(--success-color)' : 'var(--text-main)', fontWeight: 700 }}>
                    {tx.type === 'income' ? '+' : '-'}{formatRp(tx.amount)}
                  </div>
                </div>
              }
              onClick={() => onSelectTransaction(tx.id)}
            />
          ))}
          {recentTx.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No transactions recorded yet.
            </div>
          )}
        </Card>
      </section>

      {/* Analytics & Insights Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
        {/* Spending Breakdown */}
        <Card>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📊</span> Spending Analysis
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ width: '160px', height: '160px', flexShrink: 0 }}>
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  cutout: '75%',
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {doughnutData.labels.map((label, i) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: doughnutData.datasets[0].backgroundColor[i] }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{label}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{formatRp(doughnutData.datasets[0].data[i])}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Smart Insights */}
        <Card style={{ backgroundColor: 'var(--surface-secondary)', border: 'none' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✨</span> Intelligent Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '⚠️', text: 'Late night spending is up by 15% this week.', color: '#F59E0B' },
              { icon: '🎯', text: 'You are on track to hit your Bali holiday goal by October!', color: '#10B981' },
              { icon: '💡', text: 'Switching to a yearly plan for Spotify could save you Rp 80k.', color: '#4F46E5' }
            ].map((ins, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  flexShrink: 0,
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {ins.icon}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                  {ins.text}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Spacer for BottomNav */}
      <div style={{ height: '100px' }} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Skeleton width={120} height={14} style={{ marginBottom: '8px' }} />
          <Skeleton width={200} height={36} />
        </div>
        <Skeleton width={100} height={40} borderRadius="10px" />
      </div>

      {/* Hero Card Skeleton */}
      <Skeleton height={200} borderRadius="24px" />

      {/* Preview Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-section)' }}>
        <Skeleton height={180} borderRadius="20px" />
        <Skeleton height={180} borderRadius="20px" />
      </div>

      {/* Recent Activity Skeleton */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Skeleton width={150} height={20} />
          <Skeleton width={80} height={16} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ padding: '16px', backgroundColor: 'var(--surface-color)', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Skeleton width={40} height={40} borderRadius="12px" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height={14} style={{ marginBottom: '8px' }} />
                <Skeleton width="40%" height={10} />
              </div>
              <Skeleton width={80} height={16} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
