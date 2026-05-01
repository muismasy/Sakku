'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function useLedgerData(ledgerId: string = 'ledger_123') {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      console.log("🚀 Starting fetch for ledger:", ledgerId);
      setLoading(true);
      setError(null);

      // Create a timeout promise
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database request timed out")), 10000)
      );

      try {
        const fetchPromise = supabase
          .from('transactions')
          .select('*')
          .eq('ledgerId', ledgerId)
          .order('date', { ascending: false });

        // Race between the fetch and the timeout
        const result: any = await Promise.race([fetchPromise, timeout]);
        const { data, error } = result;

        if (error) {
          console.error("❌ Supabase Error:", error);
          setError(error.message);
        } else {
          console.log("✅ Data received:", data?.length || 0, "rows");
          setTransactions(data || []);
        }
      } catch (err: any) {
        console.error("⚠️ Connection issue:", err.message);
        setError(err.message || "Failed to connect to database");
      } finally {
        setLoading(false);
        console.log("🏁 Loading finished");
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
          filter: `ledgerId=eq.${ledgerId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions(prev => [payload.new as Transaction, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(prev => prev.map(tx => tx.id === payload.new.id ? payload.new as Transaction : tx));
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(tx => tx.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ledgerId, user]);

  return { transactions, loading, error, ledgerId };
}
