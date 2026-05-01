'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { supabase } from '@/lib/supabase';

// Map snake_case DB row to camelCase Transaction type
function mapRow(row: any): Transaction {
  return {
    id: row.id,
    ledgerId: row.ledger_id,
    addedByUserId: row.added_by_user_id,
    amount: Number(row.amount),
    type: row.type,
    category: row.category,
    description: row.description,
    date: Number(row.date),
    source: row.source,
    rawMessage: row.raw_message,
  };
}

export function useLedgerData(ledgerId: string = 'ledger_123') {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      console.log("Fetching transactions for ledger:", ledgerId);
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('ledger_id', ledgerId)
          .order('date', { ascending: false });

        if (error) {
          console.error("Supabase Error:", error);
          setError(error.message);
        } else {
          setTransactions((data || []).map(mapRow));
        }
      } catch (err: any) {
        console.error("Critical Connection Error:", err);
        setError(err.message || "Failed to connect to database");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Setup real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `ledger_id=eq.${ledgerId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions(prev => [mapRow(payload.new), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(prev => prev.map(tx => tx.id === payload.new.id ? mapRow(payload.new) : tx));
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(tx => tx.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ledgerId]);

  return { transactions, loading, error, ledgerId };
}


