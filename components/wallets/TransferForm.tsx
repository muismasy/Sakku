'use client';

import React, { useState } from 'react';
import { InputField } from '../ui/InputField';
import * as Icons from '../ui/Icons';

interface TransferFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransferForm({ onSuccess, onCancel }: TransferFormProps) {
  const [amount, setAmount] = useState('');
  const [fromWallet, setFromWallet] = useState('1');
  const [toWallet, setToWallet] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || fromWallet === toWallet) return;
    alert(`Transferred Rp ${Number(amount).toLocaleString('id-ID')} successfully!`);
    onSuccess();
  };

  const wallets = [
    { id: '1', name: 'Bank BCA', icon: <Icons.BankIcon /> },
    { id: '2', name: 'GoPay', icon: <Icons.SmartphoneIcon /> },
    { id: '3', name: 'Mandiri', icon: <Icons.BankIcon /> },
    { id: '4', name: 'Cash', icon: <Icons.MoneyIcon /> },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0' }}>Transfer Funds</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Move money between your accounts</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px' }}>
          {/* From */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>From</label>
            <select 
              value={fromWallet}
              onChange={(e) => setFromWallet(e.target.value)}
              style={selectStyle}
            >
              {wallets.map(w => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
            </select>
          </div>

          <div style={{ fontSize: '1.25rem', paddingTop: '24px' }}><Icons.ArrowRightIcon /></div>

          {/* To */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>To</label>
            <select 
              value={toWallet}
              onChange={(e) => setToWallet(e.target.value)}
              style={selectStyle}
            >
              {wallets.map(w => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
            </select>
          </div>
        </div>

        <InputField 
          label="Amount"
          type="number"
          placeholder="0"
          value={amount}
          onChange={setAmount}
          autoFocus
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button 
          type="button" 
          onClick={onCancel}
          style={{ 
            flex: 1, 
            padding: '14px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'transparent',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button 
          type="submit"
          style={{ 
            flex: 2, 
            padding: '14px', 
            borderRadius: '12px', 
            border: 'none', 
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
          }}
        >
          Confirm Transfer
        </button>
      </div>
    </form>
  );
}

const selectStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--surface-color)',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-main)',
  outline: 'none',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '12px',
};
