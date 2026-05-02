'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
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

const DEMO_DATA: Transaction[] = [
  { id: '1', ledgerId: 'demo', addedByUserId: 'me', amount: 12500000, type: 'income', category: 'Salary', description: 'Gaji Utama Mei', date: Date.now() - 86400000 * 2, source: 'web' },
  { id: '2', ledgerId: 'demo', addedByUserId: 'me', amount: 45000, type: 'expense', category: 'Food', description: 'Nasi Goreng Kambing', date: Date.now() - 3600000 * 3, source: 'whatsapp' },
  { id: '3', ledgerId: 'demo', addedByUserId: 'me', amount: 150000, type: 'expense', category: 'Transport', description: 'Isi Bensin Shell', date: Date.now() - 3600000 * 5, source: 'web' },
  { id: '4', ledgerId: 'demo', addedByUserId: 'me', amount: 890000, type: 'expense', category: 'Shopping', description: 'Sepatu Lari Baru', date: Date.now() - 86400000 * 1, source: 'web' },
  { id: '5', ledgerId: 'demo', addedByUserId: 'me', amount: 2500000, type: 'income', category: 'Salary', description: 'Bonus Project Freelance', date: Date.now() - 86400000 * 3, source: 'web' },
  { id: '6', ledgerId: 'demo', addedByUserId: 'me', amount: 35000, type: 'expense', category: 'Food', description: 'Kopi Kenangan', date: Date.now() - 1800000, source: 'whatsapp' },
  { id: '7', ledgerId: 'demo', addedByUserId: 'me', amount: 125000, type: 'expense', category: 'Bill', description: 'Tagihan Listrik', date: Date.now() - 86400000 * 4, source: 'web' },
  { id: '8', ledgerId: 'demo', addedByUserId: 'me', amount: 500000, type: 'expense', category: 'Health', description: 'Checkup Dokter Gigi', date: Date.now() - 86400000 * 5, source: 'web' },
];

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



