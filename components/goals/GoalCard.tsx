'use client';

import React from 'react';
import { ProgressBar, Card } from '@/components/ui';

interface GoalCardProps {
  title: string;
  current_amount: number;
  target_amount: number;
  onClick?: () => void;
}

export function GoalCard({ title, current_amount, target_amount, onClick }: GoalCardProps) {
  const percentage = Math.min(Math.round((current_amount / target_amount) * 100), 100);
  
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <Card 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: 700, 
          margin: 0, 
          color: 'var(--text-main)',
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h3>
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          color: 'var(--primary-color)', 
          backgroundColor: 'rgba(79, 70, 229, 0.08)', 
          padding: '4px 10px', 
          borderRadius: '8px' 
        }}>
          {percentage}%
        </div>
      </div>
      
      <div style={{ margin: '2px 0' }}>
        <ProgressBar value={current_amount} max={target_amount} color="var(--primary-color)" height={8} />
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '0.8125rem', 
        color: 'var(--text-muted)',
        fontWeight: 600
      }}>
        <span>
          <span style={{ color: 'var(--text-main)' }}>{formatCurrency(current_amount)}</span>
          <span style={{ opacity: 0.4, margin: '0 6px' }}>/</span>
          <span style={{ opacity: 0.7 }}>{formatCurrency(target_amount)}</span>
        </span>
        <span style={{ color: 'var(--primary-color)', opacity: 0.8 }}>
          {formatCurrency(target_amount - current_amount)} left
        </span>
      </div>
    </Card>
  );
}
