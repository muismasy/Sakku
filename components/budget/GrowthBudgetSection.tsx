'use client';

import React, { useState } from 'react';
import { GrowthBudgetItem } from './GrowthBudgetItem';
import { GrowthBudget } from '@/types';
import * as Icons from '../ui/Icons';
import { Card } from '@/components/ui';

export function GrowthBudgetSection() {
  const [budgets, setBudgets] = useState<GrowthBudget[]>([
    { id: '1', title: 'Gym Membership', budgetAmount: 650000, currentSpent: 650000, category: 'health' },
    { id: '2', title: 'Language Course', budgetAmount: 1200000, currentSpent: 450000, category: 'education' },
    { id: '3', title: 'Coding Books', budgetAmount: 500000, currentSpent: 125000, category: 'skills' },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const totalSpent = budgets.reduce((sum, b) => sum + b.currentSpent, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  
  const monthlyIncome = 15000000; 
  const growthPercentage = monthlyIncome > 0 ? ((totalSpent / monthlyIncome) * 100).toFixed(1) : '0';
  const isWithinBudget = totalSpent <= totalBudget;

  const handleAdd = () => {
    if (!newTitle || !newAmount) return;
    setBudgets([...budgets, {
      id: `gb_${Date.now()}`,
      title: newTitle,
      budgetAmount: parseInt(newAmount, 10),
      currentSpent: 0,
      category: 'other'
    }]);
    setNewTitle(''); setNewAmount(''); setShowAdd(false);
  };

  const handleUpdate = (id: string, updates: Partial<GrowthBudget>) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this growth budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  return (
    <section style={{ margin: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Self Development
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Invest in your future self
          </p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          style={{ 
            fontSize: '0.8125rem', 
            color: isEditing ? 'var(--primary-color)' : 'var(--text-muted)', 
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isEditing ? 'Done' : 'Adjust Budget'}
        </button>
      </div>

      {/* Growth Insights Card */}
      <div style={{ 
        backgroundColor: '#F0FDF4', 
        border: '1px solid #DCFCE7',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontSize: '24px', 
          backgroundColor: '#BBF7D0', 
          width: '44px', 
          height: '44px', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icons.LeafIcon />
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534', marginBottom: '2px' }}>Smart Growth Insight</div>
          <p style={{ fontSize: '0.8125rem', color: '#15803d', margin: 0, lineHeight: 1.5 }}>
            You invested <b>{growthPercentage}%</b> of your income in self development. 
            {isWithinBudget ? " You stayed within your growth budget! Keep it up." : " You're investing heavily in yourself this month!"}
          </p>
        </div>
      </div>

      {isEditing && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowAdd(true)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '12px', 
              border: '1px dashed var(--primary-color)', 
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--primary-color)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Icons.PlusIcon /> Add Growth Item
          </button>
        </div>
      )}

      {showAdd && (
        <Card style={{ padding: '20px', marginBottom: '1.5rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Title (e.g., Coding Books)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus style={inputStyle} />
            <input type="number" placeholder="Budget Amount" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} style={inputStyle} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={btnSecondary}>Cancel</button>
              <button onClick={handleAdd} style={btnPrimary}>Add Item</button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {budgets.map(item => (
          <GrowthBudgetItem 
            key={item.id} 
            item={item} 
            isEditing={isEditing}
            onUpdate={(updates) => handleUpdate(item.id, updates)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '12px 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <span>Total growth investment</span>
        <span style={{ fontWeight: 700, color: '#10B981' }}>
          Rp {totalSpent.toLocaleString('id-ID')}
        </span>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-main)',
  fontSize: '0.875rem',
  fontWeight: 600,
  outline: 'none',
};

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'transparent',
  color: 'var(--text-muted)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
};
