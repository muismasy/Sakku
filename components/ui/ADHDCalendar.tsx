'use client';

import React, { useMemo } from 'react';
import { useLedgerData } from '@/hooks/useLedgerData';

export function ADHDCalendar() {
  const [mounted, setMounted] = React.useState(false);
  const { transactions } = useLedgerData();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Map transactions to days
  const dayStats = useMemo(() => {
    const stats: Record<number, { expense: number, income: number }> = {};
    
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        if (!stats[day]) stats[day] = { expense: 0, income: 0 };
        if (tx.type === 'expense') stats[day].expense += tx.amount;
        else if (tx.type === 'income') stats[day].income += tx.amount;
      }
    });
    return stats;
  }, [transactions, currentMonth, currentYear]);

  // Mock Recurring Bills for the calendar (Sync with Monthly Bills)
  const recurringBills = [
    { day: 5, title: 'Home Rent' },
    { day: 12, title: 'Motor Installment' },
    { day: 1, title: 'Netflix' },
    { day: 18, title: 'Internet Indihome' },
  ];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  if (!mounted) {
    return <div className="card" style={{ minHeight: '300px' }}>Loading calendar...</div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2" style={{ margin: 0 }}>ADHD Calendar</h2>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>Visual flow of your cash.</p>
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} style={{ fontWeight: 700, fontSize: '0.625rem', color: 'var(--text-muted)', paddingBottom: '4px' }}>{d}</div>
        ))}
        {days.map((day, idx) => {
          const stats = day ? dayStats[day] : null;
          const isToday = day === today.getDate();
          const billDue = recurringBills.find(b => b.day === day);
          
          let bgColor = 'transparent';
          let textColor = 'var(--text-main)';
          
          if (stats) {
            if (stats.income > 0) {
              bgColor = 'var(--success-color)';
              textColor = '#fff';
            } else if (stats.expense > 0) {
              bgColor = stats.expense > 1000000 ? '#b91c1c' : 'var(--danger-color)';
              textColor = '#fff';
            }
          }
          
          if (isToday && bgColor === 'transparent') {
            bgColor = 'var(--surface-secondary)';
            textColor = 'var(--primary-color)';
          }

          return (
            <div 
              key={idx} 
              title={billDue ? `Due: ${billDue.title}` : undefined}
              style={{
                height: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: (stats || isToday || billDue) ? 800 : 400,
                opacity: day ? 1 : 0,
                fontSize: '0.8125rem',
                border: isToday ? '2px solid var(--primary-color)' : (day ? '1px solid var(--border-color)' : 'none'),
                transition: 'all 0.2s',
                cursor: (stats || billDue) ? 'pointer' : 'default',
                position: 'relative'
              }}
            >
              {day}
              {/* Bill Indicator Dot */}
              {billDue && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '4px', 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  backgroundColor: bgColor === 'transparent' ? 'var(--primary-color)' : '#fff',
                  boxShadow: '0 0 4px rgba(0,0,0,0.2)'
                }} />
              )}
              {isToday && <div style={{ position: 'absolute', top: '2px', right: '2px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }} />}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--danger-color)' }} />
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Money Out</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--success-color)' }} />
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Money In</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-main)' }} />
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Bill Due</span>
        </div>
      </div>
    </div>
  );
}
