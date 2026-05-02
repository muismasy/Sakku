'use client';

import React from 'react';
import { Card } from '@/components/ui';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Food & Drinks', icon: '🍔', color: '#f59e0b', budget: 2000000, spent: 1200000 },
  { id: '2', name: 'Transport', icon: '🚗', color: '#3b82f6', budget: 1000000, spent: 850000 },
  { id: '3', name: 'Shopping', icon: '🛍️', color: '#ec4899', budget: 1500000, spent: 1600000 },
  { id: '4', name: 'Rent & Bills', icon: '🏠', color: '#10b981', budget: 5000000, spent: 5000000 },
  { id: '5', name: 'Entertainment', icon: '🎮', color: '#8b5cf6', budget: 500000, spent: 150000 },
  { id: '6', name: 'Health', icon: '🏥', color: '#ef4444', budget: 300000, spent: 0 },
];

export function CategoriesView() {
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Category Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Organize and monitor your spending labels</p>
        </div>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: 'var(--primary-color)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '10px', 
          fontWeight: 700, 
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}>
          + Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {DEFAULT_CATEGORIES.map(cat => {
          const progress = (cat.spent / cat.budget) * 100;
          const isOverBudget = progress > 100;

          return (
            <Card key={cat.id} style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  backgroundColor: `${cat.color}15`, 
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Monthly Budget: Rp {cat.budget.toLocaleString()}</p>
                </div>
              </div>

              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isOverBudget ? 'var(--danger-color)' : 'var(--text-muted)' }}>
                  {isOverBudget ? 'Budget Exceeded' : `${Math.round(progress)}% of budget used`}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Rp {cat.spent.toLocaleString()}
                </span>
              </div>

              <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(progress, 100)}%`, 
                  backgroundColor: isOverBudget ? 'var(--danger-color)' : cat.color,
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
              
              {/* Subtle background color based on category */}
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                width: '100px', 
                height: '100px', 
                background: `radial-gradient(circle at top right, ${cat.color}08, transparent)`, 
                pointerEvents: 'none' 
              }} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
