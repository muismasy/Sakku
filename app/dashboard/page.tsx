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
import { CategoriesView } from '@/components/categories/CategoriesView';
import { ReportsView } from '@/components/reports/ReportsView';
import { AIAssistant } from '@/components/ui/AIAssistant';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

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
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Auth protection
  React.useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/login');
    }
  }, [mounted, authLoading, user, router]);

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

  if (!mounted || authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--bg-color)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--text-muted)',
        gap: '20px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid var(--border-color)', 
          borderTopColor: 'var(--primary-color)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontWeight: 600, letterSpacing: '0.02em' }}>Syncing Sakku...</p>
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!user) return null; // Prevent flicker before redirect

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Notion-style Floating Header (Fixed) */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: isSidebarVisible ? '260px' : 0, 
        right: 0, 
        height: '48px', 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(8px)',
        zIndex: 90, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isSidebarVisible && (
            <button 
              onClick={() => setIsSidebarVisible(true)}
              style={{ 
                padding: '6px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                backgroundColor: 'var(--surface-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-main)'
              }}
            >
              <span style={{ fontSize: '1rem' }}>☰</span>
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600 }}>Sakku</span> / <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '0.75rem', 
            color: typeof window !== 'undefined' && !navigator.onLine ? 'var(--danger-color)' : 'var(--success-color)',
            fontWeight: 700
          }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: 'currentColor'
            }}></span> 
            {typeof window !== 'undefined' && !navigator.onLine ? 'Offline' : 'Online'}
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
          onSignOut={signOut}
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
            <ReportsView />
          ) : activeView === 'categories' ? (
            <CategoriesView />
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
      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  );
}
