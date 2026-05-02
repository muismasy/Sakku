'use client';

import React, { useState, useEffect } from 'react';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';
import { SakuPot } from '@/types';
import { BottomSheet } from '@/components/ui/BottomSheet';

export function GoalsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState<SakuPot[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sakku_goals');
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      setGoals([
        { id: '1', ledgerId: 'l1', name: 'Beli Motor', targetAmount: 25000000, currentAmount: 8500000, streakDays: 12 },
        { id: '2', ledgerId: 'l1', name: 'Liburan Bali', targetAmount: 10000000, currentAmount: 4500000, streakDays: 5 },
        { id: '3', ledgerId: 'l1', name: 'Dana Darurat', targetAmount: 50000000, currentAmount: 12000000, streakDays: 30 },
      ]);
    }
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('sakku_goals', JSON.stringify(goals));
    }
  }, [goals]);

  const handleSaveGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const target = formData.get('target') as string;

    if (name && target) {
      const newGoal: SakuPot = {
        id: Date.now().toString(),
        ledgerId: 'l1',
        name,
        targetAmount: parseInt(target, 10),
        currentAmount: 0,
        streakDays: 0
      };
      setGoals([...goals, newGoal]);
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '80vh', padding: '0 4px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          margin: '0 0 4px 0', 
          color: 'var(--text-main)', 
          letterSpacing: '-0.03em' 
        }}>
          Goals
        </h1>
        <p style={{ 
          fontSize: '0.9375rem', 
          color: 'var(--text-muted)', 
          margin: 0,
          fontWeight: 500 
        }}>
          Track your savings progress
        </p>
      </header>

      {goals.length === 0 ? (
        <EmptyState 
          title="No goals yet"
          description="Start your savings journey by creating your first goal."
          ctaText="Create your first goal"
          onCtaClick={() => setIsModalOpen(true)}
        />
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          paddingBottom: '120px' 
        }}>
          {goals.map((goal, index) => (
            <div 
              key={goal.id} 
              style={{ 
                animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`,
                opacity: 0,
                transform: 'translateY(10px)'
              }}
            >
              <GoalCard 
                title={goal.name}
                currentAmount={goal.currentAmount}
                targetAmount={goal.targetAmount}
                onClick={() => alert(`Details for ${goal.name} coming soon!`)}
              />
            </div>
          ))}
        </div>
      )}

      {/* FAB - Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fab"
        style={{
          position: 'fixed',
          bottom: '100px', // Above bottom nav
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '18px', // Squircle-ish
          backgroundColor: '#4F46E5',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 12px 24px rgba(79, 70, 229, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <BottomSheet 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Set New Savings Goal"
      >
        <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Goal Name</label>
            <input 
              name="name"
              required
              placeholder="e.g. New Car, Wedding, Emergency Fund"
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)', outline: 'none', color: 'var(--text-main)' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Amount (Rp)</label>
            <input 
              name="target"
              type="number"
              required
              placeholder="e.g. 5000000"
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-secondary)', outline: 'none', color: 'var(--text-main)' }}
            />
          </div>

          <button 
            type="submit"
            style={{ 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              padding: '16px', 
              borderRadius: '12px', 
              fontWeight: 700,
              marginTop: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
            }}
          >
            Create Goal
          </button>
        </form>
      </BottomSheet>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fab:hover {
          transform: scale(1.1) rotate(90deg);
          background-color: #4338CA;
        }
        .fab:active {
          transform: scale(0.9);
        }
      `}</style>
    </div>
  );
}
