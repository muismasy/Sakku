'use client';

import React, { useState } from 'react';
import { RecurringExpense } from '@/types';
import { Card, Tabs, BottomSheet } from '@/components/ui';
import { useLedger } from '@/hooks/useLedgerData';

export function RecurringExpensesView() {
  const { recurringExpenses: expenses, addRecurring, updateRecurring, deleteRecurring } = useLedger();
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);

  const filteredExpenses = expenses.filter(e => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  const totalMonthly = expenses
    .filter(e => e.status === 'active')
    .reduce((sum, e) => sum + e.monthlyAmount, 0);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const expenseData: Omit<RecurringExpense, 'id' | 'ledgerId'> = {
      title: formData.get('title') as string,
      monthlyAmount: parseInt(formData.get('amount') as string, 10),
      billingDay: parseInt(formData.get('day') as string, 10),
      category: formData.get('category') as string,
      totalMonths: 999,
      remainingMonths: 999,
      startDate: Date.now(),
      status: 'active',
      nextBillingDate: Date.now()
    };

    if (editingExpense) {
      updateRecurring(editingExpense.id, expenseData);
    } else {
      addRecurring(expenseData);
    }
    
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.04em' }}>Recurring Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Automated bills and subscription rules</p>
        </div>
        <button 
          onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
          style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)'
          }}
        >
          + New Rule
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', backgroundColor: 'var(--surface-secondary)', padding: '20px', borderRadius: '16px' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Monthly Commitment</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Rp {totalMonthly.toLocaleString('id-ID')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Active Automations</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{expenses.filter(e => e.status === 'active').length}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          tabs={[
            { key: 'active', label: 'Active' },
            { key: 'paused', label: 'Paused' },
            { key: 'all', label: 'All' }
          ]}
        />
      </div>

      {/* Grid of Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredExpenses.map(expense => (
          <Card key={expense.id} style={{ 
            padding: '24px', 
            position: 'relative', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            opacity: expense.status === 'paused' ? 0.6 : 1
          }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
               <span style={{ 
                 fontSize: '0.625rem', 
                 fontWeight: 800, 
                 backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                 color: 'var(--primary-color)',
                 padding: '4px 8px', 
                 borderRadius: '6px',
                 textTransform: 'uppercase'
               }}>
                 Day {expense.billingDay}
               </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '10px', 
                backgroundColor: 'var(--surface-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>{expense.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{expense.category}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Amount</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Rp {expense.monthlyAmount.toLocaleString('id-ID')}
                </div>
              </div>
              {expense.totalMonths < 999 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Paid</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                    {expense.totalMonths - expense.remainingMonths} / {expense.totalMonths}
                  </div>
                </div>
              )}
            </div>

            {expense.totalMonths < 999 && (
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${((expense.totalMonths - expense.remainingMonths) / expense.totalMonths) * 100}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: '3px'
                }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button 
                onClick={() => handleEdit(expense)}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleToggleStatus(expense.id)}
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)', 
                  background: expense.status === 'active' ? '#fff' : 'var(--primary-color)',
                  color: expense.status === 'active' ? 'var(--text-main)' : '#fff',
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                {expense.status === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button 
                onClick={() => handleDelete(expense.id)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                🗑️
              </button>
            </div>
          </Card>
        ))}
      </div>

      <BottomSheet 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Automation' : 'New Automation Rule'}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</label>
            <input 
              name="title"
              required
              defaultValue={editingExpense?.title}
              placeholder="e.g. Netflix, Rent, Wifi"
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)', outline: 'none', color: 'var(--text-main)' }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount (Rp)</label>
              <input 
                name="amount"
                type="number"
                required
                defaultValue={editingExpense?.monthlyAmount}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)', outline: 'none', color: 'var(--text-main)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Billing Day</label>
              <input 
                name="billingDay"
                type="number"
                required
                min="1" max="31"
                defaultValue={editingExpense?.billingDay}
                placeholder="1-31"
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)', outline: 'none', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</label>
              <select 
                name="category"
                required
                defaultValue={editingExpense?.category}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)', outline: 'none', height: '45px', color: 'var(--text-main)' }}
              >
                <option>Entertainment</option>
                <option>Housing</option>
                <option>Utilities</option>
                <option>Subscription</option>
                <option>Investment</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Tenure (Mo)</label>
              <input 
                name="totalMonths"
                type="number"
                defaultValue={editingExpense?.totalMonths === 999 ? 0 : editingExpense?.totalMonths}
                placeholder="0 for recurring"
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)', outline: 'none', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <button 
            type="submit"
            style={{ 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              padding: '16px', 
              borderRadius: '12px', 
              fontWeight: 700,
              marginTop: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
            }}
          >
            {editingExpense ? 'Save Changes' : 'Enable Automation'}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}

function getCategoryIcon(cat: string) {
  switch(cat?.toLowerCase()) {
    case 'entertainment': return '🍿';
    case 'housing': return '🏠';
    case 'utilities': return '⚡';
    case 'subscription': return '💳';
    case 'investment': return '📈';
    default: return '📄';
  }
}
