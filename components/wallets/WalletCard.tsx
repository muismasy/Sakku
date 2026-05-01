'use client';

import React from 'react';
import { Card } from '../ui/Card';
import * as Icons from '../ui/Icons';
import { Wallet } from '@/types';

interface WalletCardProps {
  wallet: Wallet;
  onClick?: () => void;
  isEditing?: boolean;
  onEditClick?: (e: React.MouseEvent) => void;
  onDeleteClick?: (e: React.MouseEvent) => void;
}

export function WalletCard({ wallet, onClick, isEditing, onEditClick, onDeleteClick }: WalletCardProps) {
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const getWalletIcon = (type: Wallet['type']) => {
    switch (type) {
      case 'bank': return <Icons.BankIcon />;
      case 'e-wallet': return <Icons.SmartphoneIcon />;
      case 'cash': return <Icons.MoneyIcon />;
      default: return <Icons.WalletIcon />;
    }
  };

  return (
    <Card 
      onClick={!isEditing ? onClick : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: !isEditing && onClick ? 'pointer' : 'default',
        position: 'relative'
      }}
    >
      {isEditing && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
          <button 
            onClick={(e) => { e.stopPropagation(); onEditClick?.(e); }}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
          >
            <Icons.TagIcon />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteClick?.(e); }}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--danger-color)', backgroundColor: 'var(--surface-color)', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex' }}
          >
            <Icons.TrashIcon />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          backgroundColor: wallet.color ? `${wallet.color}15` : 'var(--surface-secondary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: wallet.color || 'var(--primary-color)'
        }}>
          {wallet.icon || getWalletIcon(wallet.type)}
        </div>
        {!isEditing && (
          <div style={{ 
            fontSize: '0.6875rem', 
            fontWeight: 700, 
            color: 'var(--text-muted)', 
            textTransform: 'uppercase', 
            backgroundColor: 'var(--surface-secondary)', 
            padding: '4px 10px', 
            borderRadius: '6px' 
          }}>
            {wallet.type}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 4px 0' }}>
          {wallet.name}
        </h3>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {formatCurrency(wallet.balance)}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingTop: '16px', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span>Last activity today</span>
        {!isEditing && (
          <button style={{ 
            color: 'var(--primary-color)', 
            fontWeight: 700, 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Details <Icons.ArrowRightIcon /></div>
          </button>
        )}
      </div>
    </Card>
  );
}
