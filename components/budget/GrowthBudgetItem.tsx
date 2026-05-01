'use client';

import React, { useState } from 'react';
import { ProgressBar, Card } from '@/components/ui';
import { GrowthBudget } from '@/types';
import * as Icons from '../ui/Icons';

interface GrowthBudgetItemProps {
  item: GrowthBudget;
  onClick?: () => void;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<GrowthBudget>) => void;
  onDelete?: () => void;
}

export function GrowthBudgetItem({ item, onClick, isEditing, onUpdate, onDelete }: GrowthBudgetItemProps) {
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const percentage = item.budget_amount > 0 
    ? Math.min(Math.round((item.current_spent / item.budget_amount) * 100), 100) 
    : 0;

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const growthColor = '#10B981';

  return (
    <Card
      onClick={!isEditing ? onClick : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderColor: 'rgba(16, 185, 129, 0.15)',
        backgroundColor: 'rgba(16, 185, 129, 0.02)',
        cursor: !isEditing && onClick ? 'pointer' : 'default'
      }}
    >
      {isEditing && isInlineEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            value={item.title} 
            onChange={(e) => onUpdate?.({ title: e.target.value })} 
            style={inputStyle} 
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Spent (Rp)</label>
              <input 
                type="number" 
                value={item.current_spent} 
                onChange={(e) => onUpdate?.({ current_spent: parseInt(e.target.value, 10) || 0 })} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Budget (Rp)</label>
              <input 
                type="number" 
                value={item.budget_amount} 
                onChange={(e) => onUpdate?.({ budget_amount: parseInt(e.target.value, 10) || 0 })} 
                style={inputStyle} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <button 
              onClick={onDelete} 
              style={{ ...btnSecondary, color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
            >
              Remove
            </button>
            <button onClick={() => setIsInlineEditing(false)} style={btnPrimary}>Done</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                margin: 0,
                color: 'var(--text-main)'
              }}>
                {item.title}
              </h3>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                color: growthColor,
                backgroundColor: `${growthColor}15`,
                padding: '2px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Positive Spending
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: growthColor }}>
                {percentage}%
              </span>
              {isEditing && (
                <button 
                  onClick={() => setIsInlineEditing(true)} 
                  style={{ 
                    padding: '4px', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'transparent', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    display: 'flex'
                  }}
                >
                  <Icons.TagIcon />
                </button>
              )}
            </div>
          </div>

          <div style={{ margin: '2px 0' }}>
            <ProgressBar value={item.current_spent} max={item.budget_amount} color={growthColor} height={8} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            fontWeight: 600
          }}>
            <span>
              <span style={{ color: 'var(--text-main)' }}>{formatCurrency(item.current_spent)}</span>
              <span style={{ opacity: 0.4, margin: '0 6px' }}>of</span>
              <span style={{ opacity: 0.7 }}>{formatCurrency(item.budget_amount)}</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: growthColor }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: growthColor }} />
              <span style={{ fontSize: '0.75rem' }}>Growth</span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-main)',
  fontSize: '0.875rem',
  fontWeight: 600,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.625rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

const btnPrimary: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'transparent',
  color: 'var(--text-muted)',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
};
