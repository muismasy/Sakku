'use client';

import React, { useState } from 'react';
import * as Icons from './Icons';
import { Card } from './Card';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Day of month
  category: string;
  isPaid: boolean;
}

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', name: 'Netflix', amount: 186000, dueDate: 5, category: 'Entertainment', isPaid: false },
    { id: '2', name: 'Spotify', amount: 54900, dueDate: 12, category: 'Music', isPaid: true },
    { id: '3', name: 'YouTube Premium', amount: 59000, dueDate: 18, category: 'Entertainment', isPaid: false },
    { id: '4', name: 'Indihome', amount: 450000, dueDate: 25, category: 'Utilities', isPaid: false },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const togglePaid = (id: string) => {
    setSubscriptions(subs => subs.map(s => 
      s.id === id ? { ...s, isPaid: !s.isPaid } : s
    ));
  };

  const handleAddOrUpdate = () => {
    if (!name || !amount || !dueDate) return;
    if (editingId) {
      setSubscriptions(subs => subs.map(s => s.id === editingId ? {
        ...s,
        name,
        amount: parseInt(amount, 10),
        dueDate: parseInt(dueDate, 10)
      } : s));
    } else {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name,
        amount: parseInt(amount, 10),
        dueDate: parseInt(dueDate, 10),
        category: 'Subscription',
        isPaid: false
      };
      setSubscriptions([...subscriptions, newSub]);
    }
    resetForm();
  };

  const deleteSub = (id: string) => {
    if (confirm('Remove this subscription?')) {
      setSubscriptions(subscriptions.filter(s => s.id !== id));
    }
  };

  const startEdit = (sub: Subscription) => {
    setEditingId(sub.id);
    setName(sub.name);
    setAmount(sub.amount.toString());
    setDueDate(sub.dueDate.toString());
    setShowAdd(true);
  };

  const resetForm = () => {
    setName(''); setAmount(''); setDueDate(''); setEditingId(null); setShowAdd(false);
  };

  const upcoming = subscriptions.filter(s => !s.isPaid).sort((a, b) => a.dueDate - b.dueDate);
  const completed = subscriptions.filter(s => s.isPaid);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>Subscriptions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Track and manage your recurring bills</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            style={{ fontSize: '0.875rem', color: isEditing ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isEditing ? 'Done' : 'Manage'}
          </button>
          {!isEditing && (
            <button 
              onClick={() => setShowAdd(true)}
              style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Icons.PlusIcon /> Add New
            </button>
          )}
        </div>
      </div>

      {showAdd && (
        <Card style={{ padding: '24px', backgroundColor: 'var(--surface-secondary)', border: '1px dashed var(--primary-color)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {editingId ? 'Edit Subscription' : 'New Subscription'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Service Name (e.g. Netflix)" value={name} onChange={e => setName(e.target.value)} autoFocus style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input type="number" placeholder="Monthly Amount (Rp)" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Due Date (1-31)" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button onClick={resetForm} style={btnSecondary}>Cancel</button>
              <button onClick={handleAddOrUpdate} style={btnPrimary}>{editingId ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </Card>
      )}

      {/* Upcoming Bills */}
      <section>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
          Upcoming Bills
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {upcoming.map(sub => (
            <Card key={sub.id} style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '44px', height: '44px', borderRadius: '12px', 
                    backgroundColor: 'var(--surface-secondary)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.125rem' 
                  }}>
                    {sub.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{sub.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--danger-color)', fontWeight: 600 }}>
                      Due in {sub.dueDate - new Date().getDate()} days
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Rp {sub.amount.toLocaleString('id-ID')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due day: {sub.dueDate}</div>
                  </div>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(sub)} style={iconBtn}><Icons.TagIcon /></button>
                      <button onClick={() => deleteSub(sub.id)} style={{ ...iconBtn, color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}><Icons.TrashIcon /></button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => togglePaid(sub.id)}
                      style={{ 
                        padding: '8px 16px', borderRadius: '8px', 
                        border: '1px solid var(--border-color)', 
                        fontSize: '0.8125rem', fontWeight: 700, 
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {upcoming.length === 0 && (
            <Card style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
              All bills are paid! 🎉
            </Card>
          )}
        </div>
      </section>

      {/* Paid Bills */}
      <section>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
          Recently Paid
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.7 }}>
          {completed.map(sub => (
            <Card key={sub.id} style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--text-muted)' }}>
                    {sub.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', textDecoration: 'line-through' }}>{sub.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600 }}>Paid for this month</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Rp {sub.amount.toLocaleString('id-ID')}</div>
                  </div>
                  {!isEditing ? (
                    <button 
                      onClick={() => togglePaid(sub.id)}
                      style={{ fontSize: '0.8125rem', color: 'var(--primary-color)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Undo
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(sub)} style={iconBtn}><Icons.TagIcon /></button>
                      <button onClick={() => deleteSub(sub.id)} style={{ ...iconBtn, color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}><Icons.TrashIcon /></button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

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

const iconBtn: React.CSSProperties = {
  padding: '6px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--surface-color)',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  display: 'flex'
};
