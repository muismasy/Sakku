'use client';

import React from 'react';
import { ProgressBar, Card } from '@/components/ui';
import { RecurringExpense } from '@/types';

interface RecurringExpenseCardProps {
  expense: RecurringExpense;
  onToggleStatus?: () => void;
  onClick?: () => void;
}

export function RecurringExpenseCard({ expense, onToggleStatus, onClick }: RecurringExpenseCardProps) {
  const monthsPassed = expense.total_months - expense.remaining_months;
  const timePercentage = (monthsPassed / expense.total_months) * 100;
  
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const statusColors = {
    active: { color: '#10B981', bg: '#F0FDF4', label: 'Active' },
    paused: { color: '#F59E0B', bg: '#FFFBEB', label: 'Paused' },
    completed: { color: '#6B7280', bg: '#F3F4F6', label: 'Completed' }
  };

  const status = statusColors[expense.status] || statusColors.active;

  return (
    <Card 
      onClick={onClick}
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            margin: 0, 
            color: 'var(--text-main)',
            letterSpacing: '-0.01em'
          }}>
            {expense.title}
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {formatCurrency(expense.monthly_amount)} / month
          </span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus?.();
          }}
          style={{ 
            fontSize: '0.6875rem', 
            fontWeight: 700, 
            color: status.color, 
            backgroundColor: status.bg, 
            padding: '4px 10px', 
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {status.label}
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {expense.remaining_months} months remaining
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 700 }}>
            {monthsPassed} / {expense.total_months}
          </span>
        </div>
        <ProgressBar value={monthsPassed} max={expense.total_months} color="#2383E2" height={8} />
      </div>

      <div style={{ 
        marginTop: '4px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '0.75rem', 
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Next billing: <b>{new Date(expense.next_billing_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</b></span>
        </div>
        {expense.status === 'active' && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            color: '#2383E2', 
            fontWeight: 700,
            fontSize: '0.6875rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2383E2' }} />
            AUTO-GENERATE
          </div>
        )}
      </div>
    </Card>
  );
}
