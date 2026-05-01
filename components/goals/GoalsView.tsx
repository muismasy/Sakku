'use client';

import React, { useState } from 'react';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';
import { SakuPot } from '@/types';

export function GoalsView() {
  const [goals, setGoals] = useState<SakuPot[]>([
    { id: '1', ledgerId: 'l1', name: 'Beli Motor', targetAmount: 25000000, currentAmount: 8500000, streakDays: 12 },
    { id: '2', ledgerId: 'l1', name: 'Liburan Bali', targetAmount: 10000000, currentAmount: 4500000, streakDays: 5 },
    { id: '3', ledgerId: 'l1', name: 'Dana Darurat', targetAmount: 50000000, currentAmount: 12000000, streakDays: 30 },
  ]);

  const handleAddGoal = () => {
    // In a real app, this would open a modal
    const name = prompt('Goal Name:');
    const target = prompt('Target Amount (Rp):');
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
          onCtaClick={handleAddGoal}
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
                onClick={() => alert(`Opening details for ${goal.name}`)}
              />
            </div>
          ))}
        </div>
      )}

      {/* FAB - Floating Action Button */}
      <button 
        onClick={handleAddGoal}
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
