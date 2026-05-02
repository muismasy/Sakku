'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLedgerData } from '@/hooks/useLedgerData';
import { Card } from './Card';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo! Saya Sakku AI. Ada yang bisa saya bantu cek dari keuangan Anda hari ini? 🪄' }
  ]);
  const [input, setInput] = useState('');
  const { transactions } = useLedgerData();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI Processing
    setTimeout(() => {
      const response = processQuery(text.toLowerCase());
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 800);
  };

  const processQuery = (query: string) => {
    if (query.includes('kopi') || query.includes('coffee')) {
      const coffeeTxs = transactions.filter(t => 
        t.description.toLowerCase().includes('kopi') || 
        t.description.toLowerCase().includes('coffee') ||
        t.category.toLowerCase().includes('coffee')
      );
      const total = coffeeTxs.reduce((sum, t) => sum + t.amount, 0);
      return `Berdasarkan data saya, Anda sudah menghabiskan Rp ${total.toLocaleString('id-ID')} untuk kopi. ${total > 500000 ? 'Mungkin perlu sedikit dikurangi? ☕' : 'Masih dalam batas wajar kok! 👍'}`;
    }

    if (query.includes('iphone') || query.includes('beli')) {
      const balance = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
      if (balance > 15000000) {
        return `Saldo Anda saat ini Rp ${balance.toLocaleString('id-ID')}. Secara teknis cukup untuk beli iPhone, tapi jangan lupa sisihkan untuk dana darurat ya! 📱`;
      } else {
        return `Tabungan Anda saat ini Rp ${balance.toLocaleString('id-ID')}. Sepertinya perlu menabung sekitar Rp ${(15000000 - balance).toLocaleString('id-ID')} lagi untuk iPhone baru. Semangat! 💪`;
      }
    }

    if (query.includes('total') || query.includes('pengeluaran')) {
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return `Total pengeluaran Anda sejauh ini adalah Rp ${totalExpense.toLocaleString('id-ID')}.`;
    }

    return "Maaf, saya belum mengerti pertanyaan itu. Coba tanya: 'Berapa total kopi saya?' atau 'Kapan tagihan selanjutnya?'";
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .magic-btn {
          bottom: 24px;
          right: 24px;
        }
        .chat-window {
          bottom: 90px;
          right: 24px;
          width: 320px;
        }
        @media (max-width: 768px) {
          .magic-btn {
            bottom: 80px; /* Higher on mobile to avoid BottomNav */
            right: 16px;
          }
          .chat-window {
            bottom: 145px;
            right: 16px;
            left: 16px; /* Full width padding on mobile */
            width: auto;
          }
        }
      `}</style>

      {/* Floating Button */}
      <button
        className="magic-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
          cursor: 'pointer',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        {isOpen ? '✕' : '🪄'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" style={{
          position: 'fixed',
          height: '450px',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'var(--surface-color)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{ padding: '16px', background: 'var(--primary-color)', color: 'white' }}>
            <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Sakku AI</div>
            <div style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Your Personal Financial Wizard</div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {messages.map((m, i) => (
              <div 
                key={i} 
                style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.role === 'user' ? 'var(--primary-color)' : 'var(--surface-secondary)',
                  color: m.role === 'user' ? 'white' : 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '2px 14px 14px 14px',
                  fontSize: '0.8125rem',
                  maxWidth: '85%',
                  lineHeight: 1.4,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Suggested Actions */}
          <div style={{ padding: '8px 12px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--border-color)' }}>
            <SuggestedBtn label="☕ Kopi" onClick={() => handleSend('Berapa pengeluaran kopi saya?')} />
            <SuggestedBtn label="📱 iPhone" onClick={() => handleSend('Cukup buat beli iPhone?')} />
            <SuggestedBtn label="💸 Total" onClick={() => handleSend('Berapa total pengeluaran?')} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Tanya Sakku..."
              style={{
                flex: 1,
                border: 'none',
                background: 'var(--surface-secondary)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.8125rem',
                outline: 'none'
              }}
            />
            <button 
              onClick={() => handleSend(input)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
            >
              🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SuggestedBtn({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{
        whiteSpace: 'nowrap',
        padding: '6px 12px',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        background: 'none',
        fontSize: '0.6875rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );
}
