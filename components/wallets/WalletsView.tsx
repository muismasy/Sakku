'use client';

import React, { useState } from 'react';
import { WalletCard } from './WalletCard';
import { Card, Tabs, BottomSheet } from '../ui';
import { TransferForm } from './TransferForm';
import * as Icons from '../ui/Icons';
import { Wallet } from '@/types';

export function WalletsView() {
  const [activeTab, setActiveTab] = useState('all');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  
  const [wallets, setWallets] = useState<Wallet[]>([
    { id: '1', name: 'Bank BCA', type: 'bank', balance: 24500000, currency: 'IDR', color: '#0066AE', last_updated: Date.now() },
    { id: '2', name: 'GoPay', type: 'e-wallet', balance: 1250000, currency: 'IDR', color: '#00AED6', last_updated: Date.now() },
    { id: '3', name: 'Physical Cash', type: 'cash', balance: 450000, currency: 'IDR', color: '#10B981', last_updated: Date.now() },
    { id: '4', name: 'Bank Mandiri', type: 'bank', balance: 8900000, currency: 'IDR', color: '#F9C11C', last_updated: Date.now() }
  ]);

  // New Wallet form state
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Wallet['type']>('bank');
  const [newBalance, setNewBalance] = useState('');
  const [newColor, setNewColor] = useState('#0066AE');

  const totalNetWorth = wallets.reduce((sum, w) => sum + w.balance, 0);
  const colorOptions = ['#0066AE', '#00AED6', '#10B981', '#F9C11C', '#EF4444', '#8B5CF6', '#EC4899'];

  const filteredWallets = wallets.filter(w => {
    if (activeTab === 'all') return true;
    return w.type === activeTab;
  });

  const handleAddWallet = () => {
    if (!newName || !newBalance) return;
    const newWallet: Wallet = {
      id: `w_${Date.now()}`,
      name: newName,
      type: newType,
      balance: parseInt(newBalance, 10),
      currency: 'IDR',
      color: newColor,
      last_updated: Date.now()
    };
    setWallets([...wallets, newWallet]);
    setNewName(''); setNewBalance(''); setShowAddWallet(false);
  };

  const handleUpdateWallet = (id: string, updates: Partial<Wallet>) => {
    setWallets(wallets.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const handleDeleteWallet = (id: string) => {
    const wallet = wallets.find(w => w.id === id);
    if (wallet && confirm(`Delete wallet "${wallet.name}"? This will also affect your history.`)) {
      setWallets(wallets.filter(w => w.id !== id));
      if (editingWalletId === id) setEditingWalletId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '120px' }}>
      {/* Header & Total Net Worth */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.04em' }}>Wallets</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Manage all your liquid assets</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Net Worth</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-color)', letterSpacing: '-0.02em' }}>
            Rp {totalNetWorth.toLocaleString('id-ID')}
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            style={{ 
              marginTop: '12px', 
              color: isEditing ? 'var(--primary-color)' : 'var(--text-muted)', 
              fontSize: '0.8125rem', 
              fontWeight: 600, 
              background: 'none', border: 'none', cursor: 'pointer' 
            }}
          >
            {isEditing ? 'Done' : 'Manage Wallets'}
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      {!isEditing && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <button style={actionButtonStyle} onClick={() => setShowAddWallet(true)}>
            <span><Icons.PlusIcon /></span> Add Wallet
          </button>
          <button style={actionButtonStyle} onClick={() => setIsTransferOpen(true)}>
            <span><Icons.RefreshIcon /></span> Transfer
          </button>
          <button style={actionButtonStyle}>
            <span><Icons.BarChartIcon /></span> Reconcile
          </button>
        </div>
      )}

      {/* Add Wallet Form */}
      {showAddWallet && (
        <Card style={{ padding: '24px', backgroundColor: 'var(--surface-secondary)', border: '1px dashed var(--primary-color)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>New Wallet</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Wallet name (e.g., Bank Mandiri)" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus style={inputStyle} />
              <select value={newType} onChange={(e) => setNewType(e.target.value as Wallet['type'])} style={inputStyle}>
                <option value="bank">Bank</option>
                <option value="e-wallet">E-Wallet</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <input type="number" placeholder="Initial balance (Rp)" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} style={inputStyle} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Theme:</span>
              {colorOptions.map(c => (
                <button key={c} onClick={() => setNewColor(c)} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: c, border: newColor === c ? '2px solid var(--text-main)' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button onClick={() => setShowAddWallet(false)} style={btnSecondary}>Cancel</button>
              <button onClick={handleAddWallet} style={btnPrimary}>Create Wallet</button>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Wallet Modal (using simple inline overlay for this demo) */}
      {editingWalletId && (
        <BottomSheet open={!!editingWalletId} onClose={() => setEditingWalletId(null)} title="Edit Wallet">
          {(() => {
            const w = wallets.find(wallet => wallet.id === editingWalletId);
            if (!w) return null;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input value={w.name} onChange={(e) => handleUpdateWallet(w.id, { name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Type</label>
                    <select value={w.type} onChange={(e) => handleUpdateWallet(w.id, { type: e.target.value as Wallet['type'] })} style={inputStyle}>
                      <option value="bank">Bank</option>
                      <option value="e-wallet">E-Wallet</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Balance (Rp)</label>
                  <input type="number" value={w.balance} onChange={(e) => handleUpdateWallet(w.id, { balance: parseInt(e.target.value, 10) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Theme</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {colorOptions.map(c => (
                      <button key={c} onClick={() => handleUpdateWallet(w.id, { color: c })} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: c, border: w.color === c ? '2px solid var(--text-main)' : '2px solid transparent', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button onClick={() => handleDeleteWallet(w.id)} style={{ ...btnSecondary, color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>Delete Wallet</button>
                  <button onClick={() => setEditingWalletId(null)} style={btnPrimary}>Save Changes</button>
                </div>
              </div>
            );
          })()}
        </BottomSheet>
      )}

      {/* Filters */}
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'all', label: 'All Accounts' },
          { key: 'bank', label: 'Banks' },
          { key: 'e-wallet', label: 'E-Wallets' },
          { key: 'cash', label: 'Cash' }
        ]}
      />

      {/* Wallets Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px' 
      }}>
        {filteredWallets.map((wallet) => (
          <WalletCard 
            key={wallet.id} 
            wallet={wallet} 
            isEditing={isEditing}
            onEditClick={() => setEditingWalletId(wallet.id)}
            onDeleteClick={() => handleDeleteWallet(wallet.id)}
            onClick={() => alert(`Opening details for ${wallet.name}`)}
          />
        ))}
      </div>

      {/* Recent Activity Insight */}
      {!isEditing && (
        <Card style={{ backgroundColor: 'var(--surface-secondary)', border: 'none', padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.IdeaIcon /> Liquidity Insight</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Your liquidity is primarily concentrated in **{wallets[0]?.name || 'Wallets'}** ({Math.round((wallets[0]?.balance || 0) / totalNetWorth * 100)}%). Consider moving some funds to higher-yield accounts if your emergency fund is already fully funded.
          </p>
        </Card>
      )}

      <BottomSheet open={isTransferOpen} onClose={() => setIsTransferOpen(false)} title="Transfer Funds">
        <TransferForm 
          onSuccess={() => setIsTransferOpen(false)} 
          onCancel={() => setIsTransferOpen(false)} 
        />
      </BottomSheet>
    </div>
  );
}

const actionButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface-color)',
  border: '1px solid var(--border-color)',
  padding: '12px',
  borderRadius: '12px',
  fontSize: '0.875rem',
  fontWeight: 700,
  color: 'var(--text-main)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-main)',
  fontSize: '0.9375rem',
  fontWeight: 600,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'transparent',
  color: 'var(--text-muted)',
  fontSize: '0.875rem',
  fontWeight: 700,
  cursor: 'pointer',
};
