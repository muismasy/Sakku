'use client';

import React, { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import { useLedger } from '@/hooks/useLedgerData';
import { 
  InputField, 
  Tabs, 
  ListItem, 
  Card 
} from '@/components/ui';
import * as Icons from '../ui/Icons';

export function TransactionsView({ onAddClick, onSelectTransaction }: { onAddClick: () => void, onSelectTransaction: (id: string) => void }) {
  const { transactions, loading } = useLedger();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'recurring', label: 'Recurring' },
  ];

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];
    if (search) {
      list = list.filter(tx => 
        tx.description.toLowerCase().includes(search.toLowerCase()) || 
        tx.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list.sort((a, b) => b.date - a.date);
  }, [transactions, search]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Sakku...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '120px' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>Transactions</h1>
        <button onClick={onAddClick} style={addBtnStyle}>
          <Icons.PlusIcon />
        </button>
      </div>

      {/* Tabs Area */}
      <div style={{ position: 'sticky', top: '45px', zIndex: 10, backgroundColor: 'var(--bg-color)', paddingTop: '8px', paddingBottom: '8px' }}>
        <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {activeTab === 'all' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InputField 
              placeholder="Search transactions..." 
              value={search} 
              onChange={setSearch}
              prefix={<Icons.SearchIcon />}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-color)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              {filteredTransactions.map(tx => (
                <div 
                  key={tx.id} 
                  onClick={() => onSelectTransaction(tx.id)}
                  style={{ backgroundColor: 'var(--surface-color)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: tx.type === 'income' ? 'rgba(34,197,94,0.1)' : 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tx.type === 'income' ? 'var(--success-color)' : 'var(--text-muted)' }}>
                      {tx.type === 'income' ? <Icons.TrendingUpIcon /> : <Icons.TrendingDownIcon />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{tx.description}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.category} • {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: tx.type === 'income' ? 'var(--success-color)' : 'var(--text-main)' }}>
                    {tx.type === 'expense' ? '-' : '+'}Rp {tx.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarView transactions={transactions} onSelectTransaction={onSelectTransaction} />
        )}

        {activeTab === 'recurring' && (
          <RecurringView transactions={transactions} onSelectTransaction={onSelectTransaction} />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ═══ Calendar Sub-Component ═══
function CalendarView({ transactions, onSelectTransaction }: { transactions: Transaction[], onSelectTransaction: (id: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const txByDate = useMemo(() => {
    const map: Record<number, Transaction[]> = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      if (d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear()) {
        const date = d.getDate();
        if (!map[date]) map[date] = [];
        map[date].push(tx);
      }
    });
    return map;
  }, [transactions, viewDate]);

  const selectedTransactions = selectedDate ? txByDate[selectedDate.getDate()] || [] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} style={calNavBtn}>&lt;</button>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} style={calNavBtn}>&gt;</button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '10px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ textAlign: 'center', fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)' }}>{d}</div>
          ))}
          {padding.map(i => <div key={`p-${i}`} />)}
          {days.map(d => {
            const hasTx = txByDate[d]?.length > 0;
            const isToday = now.getDate() === d && now.getMonth() === viewDate.getMonth() && now.getFullYear() === viewDate.getFullYear();
            const isSelected = selectedDate?.getDate() === d;
            
            return (
              <div 
                key={d} 
                onClick={() => setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), d))}
                style={{
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--primary-color)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--text-main)',
                  border: isToday ? '1px solid var(--primary-color)' : 'none',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{d}</span>
                {hasTx && !isSelected && (
                  <div style={{ position: 'absolute', bottom: '6px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {selectedDate && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Transactions for {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
          </h4>
          {selectedTransactions.length > 0 ? (
            selectedTransactions.map(tx => (
              <Card key={tx.id} noPadding flat style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px' }} onClick={() => onSelectTransaction(tx.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.25rem' }}>{tx.type === 'income' ? '💰' : '💸'}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{tx.description}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.category}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{tx.type === 'expense' ? '-' : '+'}Rp {tx.amount.toLocaleString()}</div>
                </div>
              </Card>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '20px' }}>No transactions on this day.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ═══ Recurring Sub-Component ═══
function RecurringView({ transactions, onSelectTransaction }: { transactions: Transaction[], onSelectTransaction: (id: string) => void }) {
  // Mock recurring data (usually these would be separate entities in a real app)
  const [recurring] = useState([
    { id: 'r1', name: 'Netflix Subscription', amount: 186000, nextDate: '2024-07-05', category: 'Entertainment', icon: '🎬' },
    { id: 'r2', name: 'Spotify Premium', amount: 54900, nextDate: '2024-07-12', category: 'Music', icon: '🎧' },
    { id: 'r3', name: 'Indihome Internet', amount: 450000, nextDate: '2024-07-25', category: 'Utilities', icon: '🌐' },
    { id: 'r4', name: 'Apartment Rent', amount: 4500000, nextDate: '2024-07-01', category: 'Housing', icon: '🏠' },
  ]);

  const totalMonthly = recurring.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Monthly Total Card */}
      <Card style={{ 
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 
        color: 'white', padding: '24px', border: 'none' 
      }}>
        <div style={{ fontSize: '0.8125rem', opacity: 0.7, marginBottom: '4px', fontWeight: 600 }}>Total Recurring Monthly</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Rp {totalMonthly.toLocaleString('id-ID')}</div>
        <div style={{ fontSize: '0.75rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8 }}>
          <Icons.AlertIcon /> {recurring.length} fixed expenses tracked
        </div>
      </Card>

      {/* Recurring List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Active Subscriptions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recurring.map(item => (
            <Card key={item.id} noPadding flat style={{ border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next billing: {new Date(item.nextDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>Rp {item.amount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>Monthly</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const addBtnStyle: React.CSSProperties = {
  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)',
  color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
};

const calNavBtn: React.CSSProperties = {
  padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-color)',
  backgroundColor: 'var(--surface-color)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.875rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.9375rem'
};
