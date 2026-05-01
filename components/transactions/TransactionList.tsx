'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types';
import { useLedgerData } from '@/hooks/useLedgerData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import * as Icons from '../ui/Icons';

export function TransactionList({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
  const { transactions, loading, ledger_id } = useLedgerData();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [search, setSearch] = useState('');
  
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<'expense' | 'income'>('expense');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredTransactions = transactions
    .filter(tx => filter === 'all' || tx.type === filter)
    .filter(tx => tx.description.toLowerCase().includes(search.toLowerCase()) || tx.category.toLowerCase().includes(search.toLowerCase()));

  const handleAiReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiLoading(true);
    // AI Parsing Logic...
    setIsAiLoading(false);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newCategory || !newDescription || !user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{
          amount: parseFloat(newAmount),
          category: newCategory,
          description: newDescription,
          type: newType,
          date: Date.now(),
          ledger_id: ledger_id,
          added_by_user_id: user.uid,
          source: 'web'
        }]);

      if (error) throw error;
      
      setIsModalOpen(false);
      setNewAmount('');
      setNewCategory('');
      setNewDescription('');
      setNewType('expense');
    } catch (err: any) {
      console.error('Error adding transaction:', err.message);
      alert('Failed to add transaction: ' + err.message);
    }
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h2 className="heading-2" style={{ margin: 0, fontSize: '1rem' }}>Transactions</h2>
          <button 
            className="btn-primary" 
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
          >
            + New
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', fontSize: '0.875rem' }}
          />
          <div className="flex gap-2">
            {['all', 'expense', 'income'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: filter === f ? 'var(--surface-secondary)' : 'transparent',
                  border: '1px solid',
                  borderColor: filter === f ? 'var(--border-color)' : 'transparent',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        {loading ? (
          <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <>
            {filteredTransactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center" style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                <div className="flex items-center gap-4">
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                    {tx.type === 'income' ? <Icons.TrendingUpIcon /> : <Icons.TrendingDownIcon />}
                  </div>
                  <div className="flex flex-col">
                    <span style={{ fontWeight: 500 }}>{tx.description}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }} suppressHydrationWarning>
                      {tx.category} • {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--success-color)' : 'var(--text-main)' }}>
                  {tx.type === 'expense' ? '-' : '+'}Rp {tx.amount.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>No results found.</div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '440px', backgroundColor: 'var(--surface-color)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h3 className="heading-2" style={{ margin: 0 }}>Add Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ fontSize: '1.5rem', opacity: 0.5 }}>&times;</button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
              <div>
                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value as 'expense' | 'income')}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)' }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Amount (Rp)</label>
                <input 
                  type="number" 
                  value={newAmount} 
                  onChange={(e) => setNewAmount(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                <input 
                  type="text" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  placeholder="e.g., Food, Transport"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <input 
                  type="text" 
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)} 
                  placeholder="e.g., beli kopi"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)' }}
                />
              </div>
              <div className="flex justify-between" style={{ marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
