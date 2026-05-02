'use client';

import React, { useState } from 'react';
import { 
  Card, 
  ProgressBar, 
  FAB,
  BottomSheet
} from '@/components/ui';
import { GrowthBudgetSection } from './GrowthBudgetSection';
import { Doughnut } from 'react-chartjs-2';
import * as Icons from '../ui/Icons';

interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  limit: number;
  color: string;
}

export function BudgetView() {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Food & Dining', spent: 4500000, limit: 6000000, color: '#6366F1' },
    { id: '2', name: 'Transportation', spent: 1200000, limit: 2000000, color: '#0EA5E9' },
    { id: '3', name: 'Entertainment', spent: 2800000, limit: 3000000, color: '#F59E0B' },
    { id: '4', name: 'Shopping', spent: 3500000, limit: 4000000, color: '#EF4444' },
    { id: '5', name: 'Utilities', spent: 1500000, limit: 1500000, color: '#10B981' },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add Category state
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newColor, setNewColor] = useState('#6366F1');

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const totalLimit = categories.reduce((sum, c) => sum + c.limit, 0);
  const overallProgress = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const colorOptions = ['#6366F1', '#0EA5E9', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#EC4899'];

  const handleAdd = () => {
    if (!newName || !newLimit) return;
    setCategories([...categories, {
      id: `c_${Date.now()}`,
      name: newName,
      spent: 0,
      limit: parseInt(newLimit, 10),
      color: newColor,
    }]);
    setNewName(''); setNewLimit(''); setShowAdd(false);
  };

  const handleUpdate = (id: string, field: keyof BudgetCategory, value: any) => {
    setCategories(categories.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this budget category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>Monthly Budget</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Control your spending habits</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>+ Add New</button>
      </div>

      {/* Overview Card */}
      <Card style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 500 }}>Total Budget Used</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{Math.round(overallProgress)}%</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Rp {totalSpent.toLocaleString()} / {totalLimit.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          {categories.map(c => (
            <div key={c.id} style={{ width: `${(c.spent / totalLimit) * 100}%`, backgroundColor: c.color, height: '100%' }} />
          ))}
        </div>
      </Card>

      {/* Categories */}
      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>Category Budgets</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {categories.map(cat => (
            <Card key={cat.id} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  {editingId === cat.id ? (
                    <input 
                      autoFocus
                      value={cat.name} 
                      onChange={e => handleUpdate(cat.id, 'name', e.target.value)}
                      onBlur={() => setEditingId(null)}
                      style={inlineInputStyle}
                    />
                  ) : (
                    <span onClick={() => setEditingId(cat.id)} style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>{cat.name}</span>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {editingId === `limit-${cat.id}` ? (
                      <input 
                        autoFocus
                        type="number"
                        value={cat.limit} 
                        onChange={e => handleUpdate(cat.id, 'limit', parseInt(e.target.value) || 0)}
                        onBlur={() => setEditingId(null)}
                        style={inlineInputStyle}
                      />
                    ) : (
                      <span onClick={() => setEditingId(`limit-${cat.id}`)} style={{ cursor: 'pointer' }}>Limit: Rp {cat.limit.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: cat.spent > cat.limit ? 'var(--danger-color)' : 'var(--text-main)' }}>
                    {Math.round((cat.spent / cat.limit) * 100)}%
                  </span>
                  <button onClick={() => handleDelete(cat.id)} style={{ border: 'none', background: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px' }}>
                    <Icons.TrashIcon />
                  </button>
                </div>
              </div>
              <ProgressBar value={cat.spent} max={cat.limit} color={cat.color} height={8} />
            </Card>
          ))}
        </div>
      </section>

      {/* Growth Section */}
      <div style={{ marginTop: '12px' }}>
        <GrowthBudgetSection />
      </div>

      {/* Modal */}

      <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="New Budget Category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
          <input placeholder="Category Name" value={newName} onChange={e => setNewName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Monthly Limit" value={newLimit} onChange={e => setNewLimit(e.target.value)} style={inputStyle} />
          <div style={{ display: 'flex', gap: '8px' }}>
            {colorOptions.map(c => (
              <div key={c} onClick={() => setNewColor(c)} style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c, border: newColor === c ? '2px solid black' : 'none', cursor: 'pointer' }} />
            ))}
          </div>
          <button onClick={handleAdd} style={submitBtnStyle}>Create Budget</button>
        </div>
      </BottomSheet>
    </div>
  );
}

const inlineInputStyle: React.CSSProperties = {
  background: 'none', border: 'none', borderBottom: '1px solid var(--primary-color)',
  color: 'inherit', font: 'inherit', outline: 'none', padding: '0 4px', width: 'auto'
};

const inputStyle: React.CSSProperties = {
  padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem'
};

const submitBtnStyle: React.CSSProperties = {
  padding: '16px', borderRadius: '12px', border: 'none', 
  backgroundColor: 'var(--primary-color)', color: 'white',
  fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '8px'
};
