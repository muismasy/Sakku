'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { ADHDCalendar } from '@/components/ui/ADHDCalendar';
import { Subscriptions } from '@/components/ui/Subscriptions';
import { Settings } from '@/components/ui/Settings';
import { BottomNav } from '@/components/ui/BottomNav';
import { GoalsView } from '@/components/goals/GoalsView';
import { RecurringExpensesView } from '@/components/recurring/RecurringExpensesView';
import { HomeDashboard } from '@/components/dashboard/HomeDashboard';
import { TransactionsView } from '@/components/transactions/TransactionsView';
import { AddTransactionForm } from '@/components/transactions/AddTransactionForm';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SavingsGrowthView } from '@/components/savings/SavingsGrowthView';
import { BudgetView } from '@/components/budget/BudgetView';
import { WalletsView } from '@/components/wallets/WalletsView';
import { GoalDetail } from '@/components/goals/GoalDetail';
import { TransactionDetail } from '@/components/transactions/TransactionDetail';
import { InvestmentDetail } from '@/components/investment/InvestmentDetail';
import { InvestmentTracker } from '@/components/ui/InvestmentTracker';

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const [activeLedgerId, setActiveLedgerId] = useState('00000000-0000-0000-0000-000000000123');
  const [activeView, setActiveView] = useState<'dashboard' | 'transactions' | 'savings' | 'budget' | 'adhd' | 'subscriptions' | 'settings' | 'goals' | 'recurring' | 'wallets' | 'investment' | 'reports' | 'categories' | 'backup'>('dashboard');
  const [detailView, setDetailView] = useState<{ type: 'goal' | 'transaction' | 'investment', id: string } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [ledgers, setLedgers] = useState([
    { id: '00000000-0000-0000-0000-000000000123', name: 'Family Budget' },
    { id: 'ledger_personal', name: 'Personal Cash' },
    { id: 'ledger_business', name: 'Startup Business' }
  ]);
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateLedger = () => {
    const name = prompt('Enter Ledger Name:');
    if (name) {
      const newId = `ledger_${Date.now()}`;
      setLedgers([...ledgers, { id: newId, name }]);
      setActiveLedgerId(newId);
    }
  };

  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view);
    setDetailView(null);
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading Sakku...</div>;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Notion-style Floating Header (Fixed) */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '45px', 
        backgroundColor: 'var(--bg-color)', 
        zIndex: 90, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 1rem 0 1rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
            style={{ padding: '4px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.6, transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1 }}>{isSidebarVisible ? '‹' : '›'}</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Workspace</span> / <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '0.75rem', 
            color: typeof window !== 'undefined' && !navigator.onLine ? 'var(--danger-color)' : 'var(--success-color)',
            fontWeight: 600
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'currentColor',
              boxShadow: '0 0 8px currentColor'
            }}></span> 
            {typeof window !== 'undefined' && !navigator.onLine ? 'Offline Mode' : 'Synced'}
          </div>
        </div>
      </header>

      {isSidebarVisible && (
        <Sidebar 
          activeLedgerId={activeLedgerId} 
          onSelectLedger={setActiveLedgerId} 
          ledgers={ledgers}
          onCreateLedger={handleCreateLedger}
          onViewChange={handleViewChange}
          activeView={activeView}
          onHide={() => setIsSidebarVisible(false)}
          userName={userName}
        />
      )}

      <main style={{ 
        marginLeft: isSidebarVisible ? 'var(--sidebar-width, 260px)' : 0,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        paddingTop: '65px',
        minHeight: '100vh',
        width: '100%'
      }}>
        <style jsx>{`
          @media (max-width: 768px) {
            main {
              margin-left: 0 !important;
            }
          }
        `}</style>
        <div className="container" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          paddingBottom: '2rem' 
        }}>
          {detailView ? (
            detailView.type === 'goal' ? (
              <GoalDetail goalId={detailView.id} onBack={() => setDetailView(null)} />
            ) : detailView.type === 'transaction' ? (
              <TransactionDetail transactionId={detailView.id} onBack={() => setDetailView(null)} />
            ) : (
              <InvestmentDetail investmentId={detailView.id} onBack={() => setDetailView(null)} />
            )
          ) : activeView === 'dashboard' ? (
            <HomeDashboard
              ledgerName={ledgers.find(l => l.id === activeLedgerId)?.name || 'Financial Ledger'}
              onAddTransaction={() => setIsAddModalOpen(true)}
              onSelectTransaction={(id) => setDetailView({ type: 'transaction', id })}
              onSelectGoal={(id) => setDetailView({ type: 'goal', id })}
            />
          ) : activeView === 'transactions' ? (
            <TransactionsView onAddClick={() => setIsAddModalOpen(true)} onSelectTransaction={(id) => setDetailView({ type: 'transaction', id })} />
          ) : activeView === 'savings' ? (
            <SavingsGrowthView 
              onSelectGoal={(id) => setDetailView({ type: 'goal', id })}
              onSelectInvestment={(id) => setDetailView({ type: 'investment', id })}
            />
          ) : activeView === 'budget' ? (
            <BudgetView />
          ) : activeView === 'wallets' ? (
            <WalletsView />
          ) : activeView === 'goals' ? (
            <GoalsView />
          ) : activeView === 'recurring' ? (
            <RecurringExpensesView />
          ) : activeView === 'investment' ? (
            <InvestmentTracker />
          ) : activeView === 'reports' ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
              <h2 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Reports & Analytics</h2>
              <p>Detailed financial reports and exports will be available here.</p>
            </div>
          ) : activeView === 'categories' ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏷️</div>
              <h2 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Category Manager</h2>
              <p>Custom categories and rules will be available here.</p>
            </div>
          ) : activeView === 'adhd' ? (
            <ADHDCalendar />
          ) : activeView === 'subscriptions' ? (
            <Subscriptions />
          ) : (
            <Settings 
              userName={userName} 
              onNameChange={setUserName} 
              userEmail={userEmail} 
              onEmailChange={setUserEmail} 
            />
          )}
        </div>
      </main>

      <BottomSheet 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add Transaction"
      >
        <AddTransactionForm 
          onSuccess={() => setIsAddModalOpen(false)} 
          onCancel={() => setIsAddModalOpen(false)} 
        />
      </BottomSheet>

      <BottomNav 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        onAddClick={() => setIsAddModalOpen(true)} 
      />
    </div>
  );
}
