'use client';

import React, { useState } from 'react';
import { useTheme } from '../ThemeProvider';
import * as Icons from './Icons';

interface SettingsProps {
  userName: string;
  onNameChange: (name: string) => void;
  userEmail: string;
  onEmailChange: (email: string) => void;
  onSignOut?: () => void;
}

export function Settings({ userName, onNameChange, userEmail, onEmailChange, onSignOut }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  
  // Local state for toggling edit mode
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  // State for Wallet
  const [baseCurrency, setBaseCurrency] = useState('IDR (Rp)');
  
  // State for Notifications
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const Section = ({ title, children, isDanger = false }: any) => (
    <section>
      <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, color: isDanger ? 'var(--danger-color)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', paddingLeft: '8px' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        {children}
      </div>
    </section>
  );

  const Row = ({ icon, title, subtitle, action, isDanger = false }: any) => (
    <div style={{ padding: '16px', backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.03)' : 'var(--surface-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.2s' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
        {icon && (
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '10px', 
            backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-secondary)', 
            color: isDanger ? 'var(--danger-color)' : 'var(--text-main)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' 
          }}>
            {icon}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: isDanger ? 'var(--danger-color)' : 'var(--text-main)' }}>{title}</div>
          {subtitle && <div style={{ fontSize: '0.8125rem', color: isDanger ? 'var(--danger-color)' : 'var(--text-muted)', opacity: isDanger ? 0.8 : 1, marginTop: '2px' }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ marginLeft: '16px' }}>{action}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '120px', maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.04em' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>Personalize your Sakku experience</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        
        {/* 1. Account */}
        <Section title="Account">
          <Row 
            icon={
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '10px', 
                backgroundColor: 'var(--primary-color)', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 800, fontSize: '1rem' 
              }}>
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
              </div>
            }
            title={isEditingAccount ? (
              <input 
                value={userName} 
                onChange={(e) => onNameChange(e.target.value)} 
                style={inlineInputStyle} 
                placeholder="Your Name"
                autoFocus
              />
            ) : userName} 
            subtitle={isEditingAccount ? (
              <input 
                value={userEmail} 
                onChange={(e) => onEmailChange(e.target.value)} 
                style={{ ...inlineInputStyle, fontSize: '0.8125rem', color: 'var(--text-muted)' }} 
                placeholder="email@example.com"
              />
            ) : userEmail}
            action={
              userName === 'Guest' ? null : (
                <button 
                  onClick={() => setIsEditingAccount(!isEditingAccount)}
                  style={isEditingAccount ? btnPrimary : btnSecondary}
                >
                  {isEditingAccount ? 'Save' : 'Edit Profile'}
                </button>
              )
            }
          />
          {userName === 'Guest' ? (
             <Row 
               icon={<Icons.UserIcon />} title="Guest Account" subtitle="Sync your data across devices"
               action={<button onClick={() => window.location.href = '/login'} style={btnPrimary}>Sign In / Register</button>}
             />
          ) : (
             <Row 
               icon={<Icons.StarIcon />} title="Subscription Plan" subtitle="Sakku Pro (Yearly)"
               action={<button style={btnSecondary}>Manage</button>}
             />
          )}
          {userName !== 'Guest' && (
             <Row 
               icon={<Icons.LockIcon />} title="Sign Out" subtitle="Disconnect from this device"
               action={<button onClick={onSignOut} style={{ ...btnSecondary, color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>Log Out</button>}
             />
          )}
        </Section>

        {/* 2. Wallet */}
        <Section title="Wallet">
          <Row 
            icon={<Icons.WalletIcon />} title="Base Currency" subtitle="Default currency for all ledgers"
            action={
              <select 
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                style={selectStyle}
              >
                <option>IDR (Rp)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>JPY (¥)</option>
              </select>
            }
          />
          <Row 
            icon={<Icons.BankIcon />} title="Bank Connections" subtitle="Manage connected financial accounts"
            action={<button style={btnSecondary}>Connect</button>}
          />
        </Section>

        {/* 3. Notifications */}
        <Section title="Notifications">
          <Row 
            icon={<Icons.BellIcon />} title="Push Notifications" subtitle="Alerts for transactions & budgets" 
            action={<Toggle enabled={pushEnabled} onChange={setPushEnabled} />} 
          />
          <Row 
            icon={<Icons.MailIcon />} title="Email Digest" subtitle="Receive weekly financial reports" 
            action={<Toggle enabled={emailEnabled} onChange={setEmailEnabled} />} 
          />
        </Section>

        {/* 4. Security */}
        <Section title="Security">
          <Row icon={<Icons.LockIcon />} title="App Lock (PIN)" subtitle="Require PIN to open the app" action={<Toggle enabled={false} onChange={() => {}} />} />
          <Row icon={<Icons.ShieldIcon />} title="Biometrics" subtitle="Use FaceID / Fingerprint" action={<Toggle enabled={true} onChange={() => {}} />} />
        </Section>

        {/* 5. Appearance */}
        <Section title="Appearance">
          <Row 
            icon={<Icons.PaletteIcon />} title="Theme" subtitle="Choose application theme"
            action={
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                style={selectStyle}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            }
          />
        </Section>

        {/* 6. Data & Backup */}
        <Section title="Data & Backup">
          <Row icon={<Icons.CloudIcon />} title="Cloud Sync" subtitle="Sync data automatically" action={<Toggle enabled={true} onChange={() => {}} />} />
          <Row icon={<Icons.DownloadIcon />} title="Export Data" subtitle="Download as CSV/JSON" action={<button style={btnSecondary}>Export</button>} />
          <Row icon={<Icons.UploadIcon />} title="Import Data" subtitle="Restore from backup file" action={<button style={btnSecondary}>Import</button>} />
        </Section>

        {/* 7. Danger Zone */}
        <Section title="Danger Zone" isDanger={true}>
          <Row icon={<Icons.AlertIcon />} title="Reset App Data" subtitle="Clear all local data" isDanger={true} action={<button style={{ ...btnSecondary, color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>Reset</button>} />
          <Row icon={<Icons.TrashIcon />} title="Delete Account" subtitle="Permanently delete account" isDanger={true} action={<button style={{ ...btnSecondary, backgroundColor: 'var(--danger-color)', color: 'white', border: 'none' }}>Delete</button>} />
        </Section>

      </div>
    </div>
  );
}

// Custom Toggle Component
function Toggle({ enabled, onChange }: { enabled: boolean, onChange: (v: boolean) => void }) {
  return (
    <button 
      onClick={() => onChange(!enabled)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        backgroundColor: enabled ? 'var(--primary-color)' : 'var(--border-color)',
        border: 'none', position: 'relative', cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      <div style={{
        position: 'absolute', top: '2px', 
        left: enabled ? '22px' : '2px',
        width: '20px', height: '20px', borderRadius: '10px',
        backgroundColor: 'white', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }} />
    </button>
  );
}

const inlineInputStyle: React.CSSProperties = {
  width: '100%',
  background: 'none',
  border: 'none',
  borderBottom: '1px solid var(--primary-color)',
  color: 'var(--text-main)',
  fontSize: '1rem',
  fontWeight: 700,
  padding: '2px 0',
  outline: 'none'
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--surface-color)',
  color: 'var(--text-main)',
  fontSize: '0.875rem',
  fontWeight: 600,
  outline: 'none',
  cursor: 'pointer'
};

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  fontSize: '0.8125rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'transparent',
  color: 'var(--text-main)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
};
