'use client';

import React, { useState } from 'react';
import { Card } from './Card';

interface Ledger {
  id: string;
  name: string;
}

interface SidebarProps {
  activeLedgerId: string;
  onSelectLedger: (id: string) => void;
  ledgers: Ledger[];
  onCreateLedger: () => void;
  onViewChange: (view: any) => void;
  activeView: string;
  onHide: () => void;
  userName: string;
  onSignOut: () => void;
  isSidebarVisible?: boolean;
}

export function Sidebar({ 
  activeLedgerId, 
  onSelectLedger, 
  ledgers, 
  onCreateLedger, 
  onViewChange, 
  activeView, 
  onHide, 
  userName, 
  onSignOut, 
  isSidebarVisible 
}: SidebarProps) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  const handleNavClick = (view: any) => {
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
            box-shadow: 20px 0 50px rgba(0,0,0,0.1);
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
        {/* User Profile Header */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 800,
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
            }}>
              {userInitials || 'G'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userName}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userName === 'Guest' ? 'Free Plan' : 'Pro Member'}</div>
            </div>
          </div>
          {userName !== 'Guest' && (
            <button onClick={onSignOut} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}>🚪</button>
          )}
        </div>

        {/* Guest Sign In CTA */}
        {userName === 'Guest' && (
          <div style={{ padding: '12px 16px' }}>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                border: 'none', 
                fontWeight: 700, 
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
              }}
            >
              🔑 Sign In / Register
            </button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {/* Workspaces Section */}
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              style={{ padding: '0 16px 8px', fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>Workspaces</span>
              <span style={{ fontSize: '0.5rem' }}>{isWorkspaceOpen ? '▼' : '▶'}</span>
            </div>
            
            {isWorkspaceOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {ledgers.map(ledger => (
                  <button
                    key={ledger.id}
                    onClick={() => onSelectLedger(ledger.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      width: '100%',
                      border: 'none',
                      backgroundColor: activeLedgerId === ledger.id ? 'var(--primary-color)10' : 'transparent',
                      color: activeLedgerId === ledger.id ? 'var(--primary-color)' : 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontWeight: activeLedgerId === ledger.id ? 700 : 500,
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ opacity: 0.7 }}>📁</span>
                    <span style={{ flex: 1 }}>{ledger.name}</span>
                  </button>
                ))}
                <button
                  onClick={onCreateLedger}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--primary-color)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>+</span>
                  <span>New Ledger</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ padding: '0 16px 8px', fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</div>
            <NavButton active={activeView === 'dashboard'} icon="🏠" label="Home" onClick={() => handleNavClick('dashboard')} />
            <NavButton active={activeView === 'transactions'} icon="📜" label="All Ledger" onClick={() => handleNavClick('transactions')} />
            <NavButton active={activeView === 'reports'} icon="📊" label="Analytics" onClick={() => handleNavClick('reports')} />
            <NavButton active={activeView === 'categories'} icon="🏷️" label="Categories" onClick={() => handleNavClick('categories')} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '24px' }}>
            <div style={{ padding: '0 16px 8px', fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Smart Tools</div>
            <NavButton active={activeView === 'recurring'} icon="🔄" label="Recurring Manager" onClick={() => handleNavClick('recurring')} />
            <NavButton active={activeView === 'adhd'} icon="🗓️" label="ADHD Calendar" onClick={() => handleNavClick('adhd')} />
            <NavButton active={activeView === 'goals'} icon="🎯" label="Savings Goals" onClick={() => handleNavClick('goals')} />
          </div>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)' }}>
          <NavButton active={activeView === 'settings'} icon="⚙️" label="Settings" onClick={() => handleNavClick('settings')} />
        </div>
      </aside>
    </>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean, icon: string, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        width: '100%',
        border: 'none',
        backgroundColor: active ? 'var(--primary-color)10' : 'transparent',
        color: active ? 'var(--primary-color)' : 'var(--text-main)',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: active ? 700 : 500,
        textAlign: 'left',
        borderRadius: '8px',
        margin: '0 8px',
        width: 'calc(100% - 16px)',
        transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: '1rem', opacity: active ? 1 : 0.7 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}
