'use client';

import React, { useState } from 'react';
import { 
  Home, 
  List, 
  PieChart, 
  Tags, 
  Repeat, 
  CalendarDays, 
  Target, 
  Settings, 
  ChevronLeft, 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  Plus,
  TrendingUp
} from 'lucide-react';

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
          .sidebar-panel {
             transform: ${isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)'};
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
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
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
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userName}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userName === 'Guest' ? 'Free Plan' : 'Pro Member'}</div>
            </div>
          </div>
          <button onClick={onHide} style={{ border: 'none', background: 'var(--surface-secondary)', borderRadius: '6px', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {/* Workspaces Section */}
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              style={{ padding: '0 16px 8px', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>Workspaces</span>
              <span style={{ color: 'var(--text-muted)' }}>{isWorkspaceOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
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
                      padding: '8px 16px',
                      width: '100%',
                      border: 'none',
                      backgroundColor: activeLedgerId === ledger.id ? 'var(--primary-color)10' : 'transparent',
                      color: activeLedgerId === ledger.id ? 'var(--primary-color)' : 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: activeLedgerId === ledger.id ? 600 : 500,
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Folder size={16} style={{ opacity: 0.7 }} />
                    <span style={{ flex: 1 }}>{ledger.name}</span>
                  </button>
                ))}
                <button
                  onClick={onCreateLedger}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 16px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textAlign: 'left'
                  }}
                >
                  <Plus size={16} />
                  <span>Add Workspace</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ padding: '0 16px 8px', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</div>
            <NavButton active={activeView === 'dashboard'} icon={<Home size={18} />} label="Home" onClick={() => handleNavClick('dashboard')} />
            <NavButton active={activeView === 'transactions'} icon={<List size={18} />} label="All Ledger" onClick={() => handleNavClick('transactions')} />
            <NavButton active={activeView === 'reports'} icon={<PieChart size={18} />} label="Analytics" onClick={() => handleNavClick('reports')} />
            <NavButton active={activeView === 'categories'} icon={<Tags size={18} />} label="Categories" onClick={() => handleNavClick('categories')} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '24px' }}>
            <div style={{ padding: '0 16px 8px', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Smart Tools</div>
            <NavButton active={activeView === 'recurring'} icon={<Repeat size={18} />} label="Recurring Manager" onClick={() => handleNavClick('recurring')} />
            <NavButton active={activeView === 'adhd'} icon={<CalendarDays size={18} />} label="ADHD Calendar" onClick={() => handleNavClick('adhd')} />
            <NavButton active={activeView === 'savings'} icon={<TrendingUp size={18} />} label="Growth" onClick={() => handleNavClick('savings')} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '24px' }}>
            <div style={{ padding: '0 16px 8px', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preferences</div>
            <NavButton active={activeView === 'settings'} icon={<Settings size={18} />} label="Settings & Account" onClick={() => handleNavClick('settings')} />
          </div>
        </div>
      </aside>
    </>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        border: 'none',
        backgroundColor: active ? 'var(--surface-secondary)' : 'transparent',
        color: active ? 'var(--text-main)' : 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 500,
        textAlign: 'left',
        borderRadius: '6px',
        margin: '0 8px',
        transition: 'all 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>
        {icon}
      </div>
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}
