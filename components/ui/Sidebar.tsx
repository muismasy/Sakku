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
  Settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  XIcon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  PlusIcon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
};

interface Ledger {
  id: string;
  name: string;
}

interface SidebarProps {
  activeLedgerId: string;
  onSelectLedger: (id: string) => void;
  ledgers: Ledger[];
  onCreateLedger: () => void;
  onViewChange: (view: 'dashboard' | 'transactions' | 'savings' | 'budget' | 'adhd' | 'subscriptions' | 'settings' | 'goals' | 'recurring' | 'wallets' | 'investment' | 'reports' | 'categories' | 'backup') => void;
  activeView: string;
  onHide: () => void;
  userName: string;
  onSignOut: () => void;
  isSidebarVisible?: boolean;
}

export function Sidebar({ activeLedgerId, onSelectLedger, ledgers, onCreateLedger, onViewChange, activeView, onHide, userName, onSignOut, isSidebarVisible }: SidebarProps) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = React.useState(true);

  const handleNavClick = (view: SidebarProps['onViewChange'] extends (v: infer V) => void ? V : never) => {
    onViewChange(view);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      onHide();
    }
  };

  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <style jsx>{`
        .sidebar-panel {
          transform: translateX(0);
        }
        @media (max-width: 768px) {
          .sidebar-panel {
            transform: ${isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)'};
          }
          .sidebar-backdrop {
            display: ${isSidebarVisible ? 'block' : 'none'} !important;
          }
        }
        @media (min-width: 769px) {
          .sidebar-backdrop {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Backdrop overlay — visible only on mobile */}
      <div
        className="sidebar-backdrop"
        onClick={onHide}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'none'
        }}
      />

      <aside className="sidebar-panel" style={{
        width: '260px',
        height: '100vh',
        backgroundColor: 'var(--surface-color)',
        borderRight: '1px solid var(--border-color)',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1001,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'hidden'
      }}>
        <style jsx>{`
          @media (max-width: 768px) {
            .sidebar-panel {
              box-shadow: 20px 0 50px rgba(0,0,0,0.1);
            }
          }
        `}</style>

        {/* User Profile Header */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 800, 
              fontSize: '13px',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
            }}>
              {userInitials || 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Personal Plan</span>
            </div>
          </div>
          <button onClick={onHide} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}>
            {Icons.XIcon}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {/* Workspaces Collapsible */}
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '8px 4px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '0.6875rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <span>Workspaces</span>
              <span style={{ transform: isWorkspaceOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>▼</span>
            </button>
            
            {isWorkspaceOpen && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {ledgers.map(ledger => (
                  <SidebarButton 
                    key={ledger.id}
                    active={activeLedgerId === ledger.id}
                    icon={Icons.Book}
                    label={ledger.name}
                    onClick={() => onSelectLedger(ledger.id)}
                  />
                ))}
                <button onClick={onCreateLedger} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>+</span> New Ledger
                </button>
              </div>
            )}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <SectionLabel label="Menu" />
            <SidebarButton active={activeView === 'dashboard'} icon={Icons.Home} label="Dashboard" onClick={() => handleNavClick('dashboard')} />
            <SidebarButton active={activeView === 'transactions'} icon={Icons.List} label="History" onClick={() => handleNavClick('transactions')} />
            <SidebarButton active={activeView === 'adhd'} icon={Icons.Calendar} label="ADHD Calendar" onClick={() => handleNavClick('adhd')} />
            
            <SectionLabel label="Planning" />
            <SidebarButton active={activeView === 'budget'} icon={Icons.PieChart} label="Budgeting" onClick={() => handleNavClick('budget')} />
            <SidebarButton active={activeView === 'recurring'} icon={Icons.Refresh} label="Subscriptions" onClick={() => handleNavClick('recurring')} />
            <SidebarButton active={activeView === 'savings'} icon={Icons.Target} label="Savings Goals" onClick={() => handleNavClick('savings')} />

            <SectionLabel label="Tools" />
            <SidebarButton active={activeView === 'investment'} icon={Icons.TrendingUp} label="Investment" onClick={() => handleNavClick('investment')} />
            <SidebarButton active={activeView === 'wallets'} icon={Icons.Wallet} label="My Wallets" onClick={() => handleNavClick('wallets')} />
            <SidebarButton active={activeView === 'categories'} icon={Icons.Tag} label="Categories" onClick={() => handleNavClick('categories')} />
          </nav>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
          <SidebarButton active={activeView === 'settings'} icon={Icons.Settings} label="Settings" onClick={() => handleNavClick('settings')} />
          <button 
            onClick={onSignOut}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              borderRadius: '8px',
              color: 'var(--danger-color)',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
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
