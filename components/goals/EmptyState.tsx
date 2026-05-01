'use client';

import React from 'react';
import * as Icons from '../ui/Icons';

interface EmptyStateProps {
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
}

export function EmptyState({ title, description, ctaText, onCtaClick }: EmptyStateProps) {
  return (
    <div style={{ 
      padding: '64px 24px', 
      textAlign: 'center', 
      backgroundColor: '#FFFFFF', 
      borderRadius: '16px',
      border: '1px dashed var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      margin: '24px 0'
    }}>
      <div style={{ 
        fontSize: '48px', 
        marginBottom: '8px',
        animation: 'float 3s ease-in-out infinite'
      }}>
        <Icons.TargetIcon />
      </div>
      <h3 style={{ 
        margin: 0, 
        fontSize: '1.25rem', 
        fontWeight: 700,
        color: 'var(--text-main)'
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: 0, 
        color: 'var(--text-muted)', 
        maxWidth: '280px',
        lineHeight: '1.6',
        fontSize: '0.9375rem'
      }}>
        {description}
      </p>
      <button 
        onClick={onCtaClick}
        style={{
          marginTop: '8px',
          backgroundColor: '#4F46E5',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.2)';
        }}
      >
        {ctaText}
      </button>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
