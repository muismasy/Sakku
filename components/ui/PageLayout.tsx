'use client';

import React from 'react';

interface PageProperty {
  label: string;
  value: React.ReactNode;
  icon?: string;
}

interface PageLayoutProps {
  icon?: string;
  title: string;
  onTitleChange?: (newTitle: string) => void;
  properties: PageProperty[];
  children?: React.ReactNode;
  onBack?: () => void;
  onDelete?: () => void;
}

export function PageLayout({ 
  icon = '📄', 
  title, 
  onTitleChange, 
  properties, 
  children, 
  onBack,
  onDelete
}: PageLayoutProps) {
  return (
    <div style={{ 
      animation: 'fadeIn 0.4s ease-out',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem 8rem'
    }}>
      {/* Top Bar / Breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: 'var(--text-muted)', 
            fontSize: '0.875rem', 
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Share</button>
          <button 
            onClick={onDelete}
            style={{ color: 'var(--danger-color)', fontSize: '0.8125rem', fontWeight: 600 }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem', cursor: 'default' }}>
          {icon}
        </div>
        <input 
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="Untitled"
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: 'var(--text-main)', 
            border: 'none', 
            outline: 'none', 
            background: 'none',
            width: '100%',
            letterSpacing: '-0.02em',
            padding: 0
          }}
        />
      </div>

      {/* Properties Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '150px 1fr', 
        gap: '8px 0', 
        marginBottom: '2.5rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.5rem'
      }}>
        {properties.map((prop, idx) => (
          <React.Fragment key={idx}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '0.875rem', 
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              <span>{prop.icon}</span>
              {prop.label}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 500 }}>
              {prop.value}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.7 }}>
        {children}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
