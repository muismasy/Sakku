'use client';

import React from 'react';

interface BottomNavProps {
  activeView: 'dashboard' | 'transactions' | 'savings' | 'budget' | 'adhd' | 'subscriptions' | 'settings' | 'goals' | 'recurring' | 'wallets' | 'investment' | 'reports' | 'categories' | 'backup';
  onViewChange: (view: 'dashboard' | 'transactions' | 'savings' | 'budget' | 'adhd' | 'subscriptions' | 'settings' | 'goals' | 'recurring' | 'wallets' | 'investment' | 'reports' | 'categories' | 'backup') => void;
  onAddClick: () => void;
}

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M14 10l8-8"/>
    <path d="M17 2h5v5"/>
  </svg>
);

const PieChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
  </svg>
);

export function BottomNav({ activeView, onViewChange, onAddClick }: BottomNavProps) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '75px', // Slightly taller for better touch
      backgroundColor: 'var(--surface-color)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 1000,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.03)'
    }} className="show-on-mobile-flex">
      <NavButton 
        active={activeView === 'dashboard'} 
        icon={<HomeIcon />} 
        label="Home" 
        onClick={() => onViewChange('dashboard')} 
      />
      <NavButton 
        active={activeView === 'transactions'} 
        icon={<ListIcon />} 
        label="Transactions" 
        onClick={() => onViewChange('transactions')} 
      />
      
      {/* Central Add Button */}
      <button 
        onClick={onAddClick}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '26px',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-35px',
          boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        +
      </button>

      <NavButton 
        active={activeView === 'savings'} 
        icon={<TargetIcon />} 
        label="Savings & Growth" 
        onClick={() => onViewChange('savings')} 
      />
      <NavButton 
        active={activeView === 'budget'} 
        icon={<PieChartIcon />} 
        label="Budget" 
        onClick={() => onViewChange('budget')} 
      />
    </nav>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        border: 'none',
        background: 'none',
        color: active ? '#4F46E5' : 'var(--text-muted)',
        padding: '8px',
        cursor: 'pointer',
        transition: 'color 0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
        {icon}
      </div>
      <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}>{label}</span>
    </button>
  );
}
