'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

// Map snake_case DB row to camelCase Transaction type
function mapRow(row: any): Transaction {
  return {
    id: row.id,
    ledgerId: row.ledger_id,
    addedByUserId: row.user_id,
    amount: Number(row.amount),
    type: row.type,
    category: row.category,
    description: row.description,
    date: Number(row.date),
    source: row.source || 'web',
    rawMessage: row.raw_message || '',
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
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id) // Dynamic filtering by logged-in user
          .order('date', { ascending: false });

        if (!error && data && data.length > 0) {
          setTransactions(data.map(mapRow));
        }
      } catch (err: any) {
        console.warn("DB offline, sticking to Demo Mode");
      }
    };

    fetchTransactions();
  }, [ledgerId, user]);

  return { transactions, loading, error, ledgerId };
}



