'use client';

import React, { useState } from 'react';
import { RecurringExpenseCard } from './RecurringExpenseCard';
import { RecurringExpense } from '@/types';
import { Card, Tabs } from '@/components/ui';
import * as Icons from '../ui/Icons';

export function RecurringExpensesView() {
  const [activeTab, setActiveTab] = useState('active');
  const [expenses, setExpenses] = useState<RecurringExpense[]>([
    {
      id: '1',
      ledgerId: 'l1',
      title: 'KPR Rumah (Mandiri)',
      monthlyAmount: 3500000,
      totalMonths: 180,
      remainingMonths: 142,
      startDate: Date.now() - (38 * 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      nextBillingDate: Date.now() + (5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      ledgerId: 'l1',
      title: 'Cicilan Motor (Honda)',
      monthlyAmount: 850000,
      totalMonths: 36,
      remainingMonths: 12,
      startDate: Date.now() - (24 * 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      nextBillingDate: Date.now() + (12 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      ledgerId: 'l1',
      title: 'Macbook Installment',
      monthlyAmount: 1200000,
      totalMonths: 12,
      remainingMonths: 3,
      startDate: Date.now() - (9 * 30 * 24 * 60 * 60 * 1000),
      status: 'paused',
      nextBillingDate: Date.now() + (20 * 24 * 60 * 60 * 1000)
    }
  ]);

  const filteredExpenses = expenses.filter(e => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  const totalMonthly = expenses
    .filter(e => e.status === 'active')
    .reduce((sum, e) => sum + e.monthlyAmount, 0);

  const handleToggleStatus = (id: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'active' ? 'paused' : 'active';
        return { ...e, status: nextStatus as any };
      }
      return e;
    }));
  };

  const handleAddExpense = () => {
    alert('This would open the Add Commitment BottomSheet.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>Fixed Commitments</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Automated recurring expenses</p>
      </div>

      {/* Auto-Gen Insight Card */}
      <Card style={{ 
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', 
        border: '1px solid #BFDBFE',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem' }}><Icons.RobotIcon /></div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E40AF', marginBottom: '2px' }}>Smart Auto-Generation</div>
            <p style={{ fontSize: '0.75rem', color: '#1E3A8A', margin: 0, lineHeight: 1.5 }}>
              Sakku will automatically generate transactions for <b>{expenses.filter(e => e.status === 'active').length} active</b> commitments on their billing dates.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Stat */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Outflow</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>Rp {totalMonthly.toLocaleString('id-ID')}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Items</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>{expenses.filter(e => e.status === 'active').length}</div>
          </div>
        </div>
        <button 
          onClick={handleAddExpense}
          style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            fontWeight: 600, 
            fontSize: '0.875rem' 
          }}
        >
          + Add New
        </button>
      </div>

      {/* Tabs for Filtering */}
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'active', label: 'Active' },
          { key: 'paused', label: 'Paused' },
          { key: 'all', label: 'All' }
        ]}
      />

      {/* Expenses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredExpenses.map((expense) => (
          <RecurringExpenseCard 
            key={expense.id} 
            expense={expense}
            onToggleStatus={() => handleToggleStatus(expense.id)}
            onClick={() => alert(`Details for ${expense.title}`)}
          />
        ))}
      </div>
    </div>
  );
}

