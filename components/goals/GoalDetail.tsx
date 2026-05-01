'use client';

import React, { useState } from 'react';
import * as Icons from '../ui/Icons';
import { ProgressBar } from '@/components/ui';

interface Contribution {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export function GoalDetail({ goalId, onBack }: { goalId: string, onBack: () => void }) {
  const [title, setTitle] = useState('New Motorcycle');
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentAmount, setCurrentAmount] = useState(3000);
  const [targetAmount, setTargetAmount] = useState(6000);
  const [frequency, setFrequency] = useState('Monthly');
  const [targetDate, setTargetDate] = useState('2024-12-31');
  const [account, setAccount] = useState('Savings');
  
  // Add contribution modal
  const [showAddContribution, setShowAddContribution] = useState(false);
  const [newContribAmount, setNewContribAmount] = useState('');
  const [newContribDesc, setNewContribDesc] = useState('');

  const percentage = Math.round((currentAmount / targetAmount) * 100);
  const formatCurrency = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  const daysLeft = Math.max(0, Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const properties = [
    { label: 'Target Amount', value: formatCurrency(targetAmount), icon: <Icons.MoneyIcon />, key: 'target' },
    { label: 'Account', value: account, icon: <Icons.BankIcon />, key: 'account' },
    { label: 'Saved So Far', value: formatCurrency(currentAmount), icon: <Icons.TrendingUpIcon />, key: 'current' },
    { label: 'Frequency', value: frequency, icon: <Icons.RefreshIcon />, key: 'frequency' },
    { label: 'Target Date', value: new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), icon: <Icons.CalendarIcon />, key: 'date' },
    { label: 'Status', value: percentage >= 100 ? 'Completed' : 'In Progress', icon: <Icons.RefreshIcon />, key: 'status' },
    { label: 'Days Left', value: `${daysLeft} days`, icon: <Icons.HourglassIcon />, key: 'days' },
    { label: 'Type', value: 'Goal', icon: <Icons.TagIcon />, key: 'type' },
  ];

  const [contributions, setContributions] = useState<Contribution[]>([
    { id: '1', date: '15 Jun 2024', amount: 250000, description: 'Monthly Deposit' },
    { id: '2', date: '01 Jun 2024', amount: 300000, description: 'Side Gig Payment' },
    { id: '3', date: '15 May 2024', amount: 250000, description: 'Monthly Deposit' },
  ]);

  const handleAddContribution = () => {
    if (!newContribAmount) return;
    const amount = parseInt(newContribAmount, 10);
    const newContrib: Contribution = {
      id: `c_${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      amount,
      description: newContribDesc || 'Deposit',
    };
    setContributions([newContrib, ...contributions]);
    setCurrentAmount(prev => prev + amount);
    setNewContribAmount('');
    setNewContribDesc('');
    setShowAddContribution(false);
  };

  const handleDeleteContribution = (id: string) => {
    const target = contributions.find(c => c.id === id);
    if (target && confirm(`Delete "${target.description}" (${formatCurrency(target.amount)})?`)) {
      setContributions(contributions.filter(c => c.id !== id));
      setCurrentAmount(prev => prev - target.amount);
    }
  };

  const handleDeleteGoal = () => {
    if (confirm(`Are you sure you want to delete the goal "${title}"? This action cannot be undone.`)) {
      onBack(); // Go back after deletion
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', animation: 'fadeIn 0.4s ease-out' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={onBack} style={headerButtonStyle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsEditing(!isEditing)} style={{ ...headerButtonStyle, color: isEditing ? 'var(--primary-color)' : 'var(--text-main)' }}>
            {isEditing ? <><Icons.CheckIcon /> Done</> : <><Icons.TagIcon /> Edit</>}
          </button>
          {!isEditing && (
            <button onClick={handleDeleteGoal} style={{ ...headerButtonStyle, color: 'var(--danger-color)' }}>
              <Icons.TrashIcon />
            </button>
          )}
        </div>
      </div>

      {/* Goal Hero section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}><Icons.TargetIcon /></div>
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 24px 0', color: 'var(--text-main)', letterSpacing: '-0.04em', border: 'none', borderBottom: '2px solid var(--primary-color)', outline: 'none', background: 'none', width: '100%', padding: '4px 0' }}
          />
        ) : (
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 24px 0', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>{title}</h1>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
          <span>{percentage}%</span>
          <span>{formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}</span>
        </div>
        <ProgressBar value={currentAmount} max={targetAmount} height={10} color="#1e1b4b" />
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'right', fontWeight: 600 }}>Goal progress</p>
      </div>

      {/* Property Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        border: '1px solid var(--border-color)', 
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '48px',
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
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>{prop.label}</div>
              {isEditing && prop.key === 'target' ? (
                <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(parseInt(e.target.value) || 0)} style={editInputStyle} />
              ) : isEditing && prop.key === 'current' ? (
                <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(parseInt(e.target.value) || 0)} style={editInputStyle} />
              ) : isEditing && prop.key === 'date' ? (
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} style={editInputStyle} />
              ) : isEditing && prop.key === 'frequency' ? (
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={editInputStyle}>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              ) : isEditing && prop.key === 'account' ? (
                <select value={account} onChange={(e) => setAccount(e.target.value)} style={editInputStyle}>
                  <option>Savings</option>
                  <option>Checking</option>
                  <option>Investment</option>
                </select>
              ) : (
                <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)' }}>{prop.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Contributions Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.375rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Recent Contributions</h3>
          <button 
            onClick={() => setShowAddContribution(true)}
            style={{ 
              backgroundColor: 'var(--surface-secondary)', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '10px', 
              fontSize: '0.875rem', 
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Icons.PlusIcon /> Add
          </button>
        </div>

        {/* Add Contribution Inline Form */}
        {showAddContribution && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'var(--surface-secondary)', 
            borderRadius: '16px', 
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>New Contribution</div>
            <input
              type="number"
              placeholder="Amount (e.g., 250000)"
              value={newContribAmount}
              onChange={(e) => setNewContribAmount(e.target.value)}
              autoFocus
              style={{ ...editInputStyle, fontSize: '1.25rem', fontWeight: 700, padding: '12px' }}
            />
            <input
              placeholder="Description (optional)"
              value={newContribDesc}
              onChange={(e) => setNewContribDesc(e.target.value)}
              style={{ ...editInputStyle, padding: '10px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddContribution(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddContribution} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {contributions.map((tx, i) => (
            <div key={tx.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '16px 0',
              borderBottom: i < contributions.length - 1 ? '1px solid var(--border-color)' : 'none'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{tx.date}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success-color)' }}>+{formatCurrency(tx.amount)}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'right', flex: 1, marginLeft: '16px', fontWeight: 500 }}>{tx.description}</div>
              {isEditing && (
                <button onClick={() => handleDeleteContribution(tx.id)} style={{ marginLeft: '12px', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                  <Icons.TrashIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

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

const editInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-main)',
  fontSize: '0.9375rem',
  fontWeight: 600,
  outline: 'none',
};
