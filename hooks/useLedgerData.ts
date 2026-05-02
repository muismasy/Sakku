'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

// Map snake_case DB row to camelCase Transaction type
function mapRow(row: Record<string, unknown>): Transaction {
  return {
    id: String(row.id),
    ledgerId: String(row.ledger_id),
    addedByUserId: String(row.user_id),
    amount: Number(row.amount),
    type: row.type as unknown, // casting to bypass the specific enum type for now
    category: String(row.category),
    description: String(row.description),
    date: Number(row.date),
    source: (row.source as unknown) || 'web',
    rawMessage: String(row.raw_message || ''),
  };
}

const DEMO_DATA: Transaction[] = []; // Emptied for real usage

export function useLedgerData(ledgerId: string = '00000000-0000-0000-0000-000000000123') {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (supabaseError) throw supabaseError;

        if (data) {
          setTransactions(data.map(mapRow));
        }
      } catch (err) {
        console.warn("DB offline, sticking to Demo Mode");
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [ledgerId, user]);

  const addTransaction = async (newTx: Omit<Transaction, 'id' | 'ledgerId' | 'addedByUserId'>) => {
    if (!user) return;
    
    const txToSave = {
      ...newTx,
      id: Date.now().toString(),
      ledger_id: ledgerId,
      user_id: user.id,
      date: typeof newTx.date === 'string' ? new Date(newTx.date).getTime() : newTx.date
    };

    // Optimistic update
    const mappedTx = {
      ...newTx,
      id: txToSave.id,
      ledgerId,
      addedByUserId: user.id,
      date: txToSave.date
    } as Transaction;
    
    setTransactions(prev => [mappedTx, ...prev]);

    // Async DB push
    try {
      await supabase.from('transactions').insert({
        amount: txToSave.amount,
        type: txToSave.type,
        category: txToSave.category,
        description: txToSave.description,
        date: txToSave.date,
        user_id: user.id,
        ledger_id: ledgerId
      });
    } catch (err) {
      console.warn("Could not sync to cloud, data kept locally", err);
    }
  };

  return { transactions, loading, error, ledgerId, addTransaction };
}
