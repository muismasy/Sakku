'use client';

import React from 'react';

const Icons = {
  Book: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  Home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  List: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  PieChart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  TrendingUp: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Tag: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  FileText: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Wallet: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>,
  Refresh: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
};

interface Ledger {
  id: string;
  name: string;
}

interface SidebarProps {
  active_ledger_id: string;
  onSelectLedger: (id: string) => void;
  ledgers: Ledger[];
  onCreateLedger: () => void;
  onViewChange: (view: 'dashboard' | 'transactions' | 'savings' | 'budget' | 'adhd' | 'subscriptions' | 'settings' | 'goals' | 'recurring' | 'wallets' | 'investment' | 'reports' | 'categories' | 'backup') => void;
  activeView: string;
  onHide: () => void;
  userName: string;
}

export function Sidebar({ active_ledger_id, onSelectLedger, ledgers, onCreateLedger, onViewChange, activeView, onHide, userName }: SidebarProps) {

  const handleNavClick = (view: SidebarProps['onViewChange'] extends (v: infer V) => void ? V : never) => {
    onViewChange(view);
    // Auto-close sidebar on mobile after navigation
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      onHide();
    }
  };

  return (
    <>
      {/* Backdrop overlay — visible only on mobile */}
      <div
        className="sidebar-backdrop"
        onClick={onHide}
      />

      <aside className="sidebar-panel" style={{
        width: '260px',
        height: 'calc(100vh - 32px)',
        backgroundColor: 'var(--glass-surface)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'fixed',
        left: '16px',
        top: '16px',
        zIndex: 1001,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        overflowY: 'auto'
      }}>
        <div>
          {/* Header with Profile + Close */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '18px', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>JD</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{userName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Account</span>
              </div>
            </div>
            {/* Close / Hide Button */}
            <button
              onClick={onHide}
              aria-label="Hide sidebar"
              style={{
                padding: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                transition: 'background-color 0.2s ease, color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1 }}>‹</span>
            </button>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SectionLabel label="Workspaces" />
            {ledgers.map(ledger => (
              <SidebarButton 
                key={ledger.id}
                active={active_ledger_id === ledger.id}
                icon={Icons.Book}
                label={ledger.id === 'ledger_123' ? 'Family Budget' : ledger.name}
                onClick={() => { onSelectLedger(ledger.id); if (typeof window !== 'undefined' && window.innerWidth <= 768) onHide(); }}
              />
            ))}
            <button onClick={onCreateLedger} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginLeft: '28px' }}>+ New Workspace</button>

            <SectionLabel label="Primary" />
            <SidebarButton active={activeView === 'dashboard'} icon={Icons.Home} label="Home" onClick={() => handleNavClick('dashboard')} />
            <SidebarButton active={activeView === 'transactions'} icon={Icons.List} label="Transactions" onClick={() => handleNavClick('transactions')} />
            <SidebarButton active={activeView === 'savings'} icon={Icons.Target} label="Savings & Growth" onClick={() => handleNavClick('savings')} />
            <SidebarButton active={activeView === 'budget'} icon={Icons.PieChart} label="Budget" onClick={() => handleNavClick('budget')} />

            <SectionLabel label="Databases" />
            <SidebarButton active={activeView === 'investment'} icon={Icons.TrendingUp} label="Investment" onClick={() => handleNavClick('investment')} />
            <SidebarButton active={activeView === 'categories'} icon={Icons.Tag} label="Categories" onClick={() => handleNavClick('categories')} />
            <SidebarButton active={activeView === 'reports'} icon={Icons.FileText} label="Reports" onClick={() => handleNavClick('reports')} />

            <SectionLabel label="Tools" />
            <SidebarButton active={activeView === 'wallets'} icon={Icons.Wallet} label="Wallets" onClick={() => handleNavClick('wallets')} />
            <SidebarButton active={activeView === 'recurring'} icon={Icons.Refresh} label="Recurring Manager" onClick={() => handleNavClick('recurring')} />
            <SidebarButton active={activeView === 'adhd'} icon={Icons.Calendar} label="Calendar" onClick={() => handleNavClick('adhd')} />
            
            <SectionLabel label="System" />
            <SidebarButton active={activeView === 'settings'} icon={Icons.Settings} label="Settings" onClick={() => handleNavClick('settings')} />
          </nav>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginTop: '1.25rem', marginBottom: '0.5rem', paddingLeft: '0.75rem' }}>
      {label}
    </div>
  );
}

function SidebarButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '0.625rem 0.75rem',
        borderRadius: '8px',
        backgroundColor: active ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
        color: active ? 'var(--primary-color)' : 'var(--text-main)',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 500,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span> {label}
    </button>
  );
}
