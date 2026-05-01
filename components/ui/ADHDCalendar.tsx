'use client';

import React from 'react';

export function ADHDCalendar() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  // Mock subscription payment days
  const paymentDays = [5, 12, 18, 25];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  if (!mounted) {
    return <div className="card" style={{ minHeight: '300px' }}>Loading calendar...</div>;
  }

  return (
    <div className="card">
      <h2 className="heading-2">ADHD Calendar</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Simplified view of your money-out days.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d}</div>
        ))}
        {days.map((day, idx) => {
          const isPaymentDay = day && paymentDays.includes(day);
          return (
            <div 
              key={idx} 
              style={{
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                backgroundColor: isPaymentDay ? 'var(--danger-color)' : (day === today.getDate() ? 'var(--primary-color)' : 'transparent'),
                color: isPaymentDay || day === today.getDate() ? '#fff' : 'var(--text-main)',
                fontWeight: isPaymentDay || day === today.getDate() ? 700 : 400,
                opacity: day ? 1 : 0,
                fontSize: '0.875rem',
                border: day ? '1px solid var(--border-color)' : 'none'
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--danger-color)' }} />
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Money Out</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary-color)' }} />
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Today</span>
        </div>
      </div>
    </div>
  );
}
