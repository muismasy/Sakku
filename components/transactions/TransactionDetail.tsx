'use client';

import React, { useState } from 'react';
import * as Icons from '../ui/Icons';

export function TransactionDetail({ transactionId, onBack }: { transactionId: string, onBack: () => void }) {
  const [title, setTitle] = useState('Dinner at Sederhana');
  
  const properties = [
    { label: 'Amount', value: 'Rp 125.000', icon: <Icons.MoneyIcon /> },
    { label: 'Category', value: 'Food & Dining', icon: <Icons.FoodIcon /> },
    { label: 'Wallet', value: 'Bank BCA', icon: <Icons.CreditCardIcon /> },
    { label: 'Date', value: '12 May 2026', icon: <Icons.ClockIcon /> },
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', animation: 'fadeIn 0.4s ease-out' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={onBack} style={headerButtonStyle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Transaction</h2>
        <button style={headerButtonStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
      </div>

      {/* Transaction Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}><Icons.FoodIcon /></div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>{title}</h1>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Rp 125.000</div>
      </div>

      {/* Property Grid (Boxed Style) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        border: '1px solid var(--border-color)', 
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '40px',
        backgroundColor: 'var(--surface-color)'
      }}>
        {properties.map((prop, i) => (
          <div key={i} style={{ 
            padding: '20px', 
            borderRight: i % 2 === 0 ? '1px solid var(--border-color)' : 'none',
            borderBottom: i < properties.length - 2 ? '1px solid var(--border-color)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }}>{prop.icon}</div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>{prop.label}</div>
              <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)' }}>{prop.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Note Section */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-main)' }}>Note</h3>
        <div style={{ 
          backgroundColor: 'var(--surface-secondary)', 
          padding: '20px', 
          borderRadius: '16px',
          fontSize: '1rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          fontWeight: 500,
          minHeight: '100px'
        }}>
          Lunch with the team after the presentation. Paid with BCA.
        </div>
      </section>

      {/* Receipt Section */}
      <section>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-main)' }}>Receipt</h3>
        <div style={{ 
          width: '100%', 
          aspectRatio: '4/3', 
          backgroundColor: 'var(--surface-secondary)', 
          borderRadius: '20px', 
          border: '2px dashed var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: 'var(--text-muted)'
        }}>
          <span style={{ fontSize: '2.5rem' }}><Icons.CameraIcon /></span>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>No receipt attached</span>
          <button style={{ 
            padding: '10px 20px', 
            borderRadius: '10px', 
            border: '2px solid var(--primary-color)', 
            color: 'var(--primary-color)', 
            fontSize: '0.875rem', 
            fontWeight: 700,
            marginTop: '12px',
            cursor: 'pointer',
            backgroundColor: 'transparent'
          }}>
            Upload Receipt
          </button>
        </div>
      </section>

      {/* Spacer for BottomNav */}
      <div style={{ height: '120px' }} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const headerButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--text-main)',
  cursor: 'pointer',
  padding: '8px'
};
