'use client';

import React, { useState, useEffect } from 'react';
import { useLedgerData } from '@/hooks/useLedgerData';
import * as Icons from './Icons';

export function SmartInsights() {
  const { transactions } = useLedgerData();
  const [insight, setInsight] = useState<string>("Analyzing your spending patterns...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactions.length > 5) {
      generateInsights();
    }
  }, [transactions]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const expenses = transactions.filter(t => t.type === 'expense');
      const foodSpend = expenses.filter(t => t.category.toLowerCase() === 'food').reduce((acc, t) => acc + t.amount, 0);
      const totalSpend = expenses.reduce((acc, t) => acc + t.amount, 0);
      
      // Look for keywords like 'makan malam', 'snack', 'jajan'
      const lateNightJajan = expenses.filter(t => 
        t.description.toLowerCase().includes('malam') || 
        t.description.toLowerCase().includes('jajan') ||
        t.description.toLowerCase().includes('snack')
      );

      if (lateNightJajan.length > 2) {
        setInsight(`Spending Pattern: Kamu sering jajan di malam hari (${lateNightJajan.length}x transaksi). Kebiasaan ini bisa menghemat Rp ${ (lateNightJajan.reduce((acc, t) => acc + t.amount, 0) * 0.8).toLocaleString('id-ID') } jika dikurangi!`);
      } else if (foodSpend > totalSpend * 0.4) {
        setInsight("Budget Tip: Pengeluaran makanmu mencapai " + ((foodSpend/totalSpend)*100).toFixed(0) + "% dari total pengeluaran. Coba kurangi makan di luar!");
      } else {
        setInsight("Health Score: Pengeluaranmu bulan ini sangat stabil. Pertahankan konsistensi menabung di Saku Pots!");;
      }
    } catch (err) {
      setInsight("Could not generate insights at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--surface-secondary)', 
      border: '1px solid var(--border-color)', 
      borderRadius: '8px',
      padding: '1.25rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start'
    }}>
      <div style={{ fontSize: '1.5rem', marginTop: '-2px' }}><Icons.SparklesIcon /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Smart Financial Insights</div>
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
          {loading ? 'Analyzing your workspace...' : insight}
        </div>
        {!loading && (
          <button 
            onClick={generateInsights}
            style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, opacity: 0.7 }}
          >
            Re-analyze patterns
          </button>
        )}
      </div>
    </div>
  );
}
