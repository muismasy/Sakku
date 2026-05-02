'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, SakuPot, RecurringExpense, Wallet } from '@/types';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

interface LedgerContextType {
  transactions: Transaction[];
  goals: SakuPot[];
  recurringExpenses: RecurringExpense[];
  wallets: Wallet[];
  loading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'ledgerId' | 'addedByUserId'>) => Promise<void>;
  addGoal: (goal: Omit<SakuPot, 'id' | 'ledgerId'>) => void;
  addRecurring: (expense: Omit<RecurringExpense, 'id' | 'ledgerId'>) => void;
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateRecurring: (id: string, updates: Partial<RecurringExpense>) => void;
  deleteRecurring: (id: string) => void;
  updateGoal: (id: string, updates: Partial<SakuPot>) => void;
  deleteGoal: (id: string) => void;
  updateWallet: (id: string, updates: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SakuPot[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Load from LocalStorage & Supabase
  useEffect(() => {
    // Load Transactions (Demo or Supabase)
    const fetchAll = async () => {
      setLoading(true);
      
      // Load from LocalStorage first for speed
      const savedTx = localStorage.getItem('sakku_transactions');
      if (savedTx) {
        setTransactions(JSON.parse(savedTx));
      }
      
      const savedGoals = localStorage.getItem('sakku_goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        setGoals([
          { id: '1', ledgerId: 'l1', name: 'Beli Motor', targetAmount: 25000000, currentAmount: 8500000, streakDays: 12 },
          { id: '2', ledgerId: 'l1', name: 'Liburan Bali', targetAmount: 10000000, currentAmount: 4500000, streakDays: 5 },
          { id: '3', ledgerId: 'l1', name: 'Dana Darurat', targetAmount: 50000000, currentAmount: 12000000, streakDays: 30 },
        ]);
      }
      
      const savedRecurring = localStorage.getItem('sakku_recurring');
      if (savedRecurring) {
        setRecurringExpenses(JSON.parse(savedRecurring));
      } else {
        setRecurringExpenses([
          { id: '1', ledgerId: 'l1', title: 'Netflix Subscription', monthlyAmount: 186000, category: 'Entertainment', billingDay: 15, totalMonths: 999, remainingMonths: 999, startDate: Date.now(), status: 'active', nextBillingDate: Date.now() },
          { id: '2', ledgerId: 'l1', title: 'House Loan', monthlyAmount: 4500000, category: 'Housing', billingDay: 5, totalMonths: 120, remainingMonths: 78, startDate: Date.now(), status: 'active', nextBillingDate: Date.now() }
        ]);
      }
      
      const savedWallets = localStorage.getItem('sakku_wallets');
      if (savedWallets) {
        setWallets(JSON.parse(savedWallets));
      } else {
        setWallets([
          { id: '1', name: 'Bank BCA', type: 'bank', balance: 24500000, currency: 'IDR', color: '#0066AE', lastUpdated: 1714636800000 },
          { id: '2', name: 'GoPay', type: 'e-wallet', balance: 1250000, currency: 'IDR', color: '#00AED6', lastUpdated: 1714636800000 },
          { id: '3', name: 'Physical Cash', type: 'cash', balance: 450000, currency: 'IDR', color: '#10B981', lastUpdated: 1714636800000 },
        ]);
      }

      if (user) {
        try {
          const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
          if (data && data.length > 0) {
            setTransactions(data.map(row => ({
              id: String(row.id),
              ledgerId: String(row.ledger_id),
              addedByUserId: String(row.user_id),
              amount: Number(row.amount),
              type: row.type as any,
              category: String(row.category),
              description: String(row.description),
              date: Number(row.date),
              source: row.source || 'web'
            })));
          }
        } catch (e) {
          console.warn("DB offline, using local only");
        }
      }
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (transactions.length >= 0) localStorage.setItem('sakku_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (goals.length >= 0) localStorage.setItem('sakku_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (recurringExpenses.length >= 0) localStorage.setItem('sakku_recurring', JSON.stringify(recurringExpenses));
  }, [recurringExpenses]);

  useEffect(() => {
    if (wallets.length >= 0) localStorage.setItem('sakku_wallets', JSON.stringify(wallets));
  }, [wallets]);

  const addTransaction = async (newTx: Omit<Transaction, 'id' | 'ledgerId' | 'addedByUserId'>) => {
    const tempId = Date.now().toString();
    const mappedTx = {
      ...newTx,
      id: tempId,
      ledgerId: 'l1',
      addedByUserId: user?.id || 'guest',
      date: typeof newTx.date === 'string' ? new Date(newTx.date).getTime() : newTx.date
    } as Transaction;

    setTransactions(prev => [mappedTx, ...prev]);

    // Also update the first wallet to reflect the transaction
    setWallets(prev => {
      if (prev.length === 0) return prev;
      const updatedWallets = [...prev];
      const primaryWallet = { ...updatedWallets[0] };
      if (mappedTx.type === 'expense') {
        primaryWallet.balance -= mappedTx.amount;
      } else if (mappedTx.type === 'income') {
        primaryWallet.balance += mappedTx.amount;
      }
      updatedWallets[0] = primaryWallet;
      return updatedWallets;
    });

    if (user) {
      try {
        await supabase.from('transactions').insert({
          amount: mappedTx.amount,
          type: mappedTx.type,
          category: mappedTx.category,
          description: mappedTx.description,
          date: mappedTx.date,
          user_id: user.id,
          ledger_id: '00000000-0000-0000-0000-000000000123'
        });
      } catch (e) {
        console.error("Failed to sync transaction", e);
      }
    }
  };

  const addGoal = (newGoal: Omit<SakuPot, 'id' | 'ledgerId'>) => {
    setGoals(prev => [...prev, { ...newGoal, id: Date.now().toString(), ledgerId: 'l1' }]);
  };

  const updateGoal = (id: string, updates: Partial<SakuPot>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addRecurring = (newRec: Omit<RecurringExpense, 'id' | 'ledgerId'>) => {
    setRecurringExpenses(prev => [...prev, { ...newRec, id: Date.now().toString(), ledgerId: 'l1' }]);
  };

  const updateRecurring = (id: string, updates: Partial<RecurringExpense>) => {
    setRecurringExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteRecurring = (id: string) => {
    setRecurringExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addWallet = (newWallet: Omit<Wallet, 'id'>) => {
    setWallets(prev => [...prev, { ...newWallet, id: Date.now().toString() }]);
  };

  const updateWallet = (id: string, updates: Partial<Wallet>) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  return (
    <LedgerContext.Provider value={{ 
      transactions, goals, recurringExpenses, wallets, loading,
      addTransaction, addGoal, updateGoal, deleteGoal,
      addRecurring, updateRecurring, deleteRecurring,
      addWallet, updateWallet, deleteWallet
    }}>
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
}
