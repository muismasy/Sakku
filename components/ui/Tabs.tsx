'use client';

import React from 'react';

interface Tab {
  /** Unique key for the tab */
  key: string;
  /** Display label */
  label: string;
  /** Optional icon or emoji */
  icon?: React.ReactNode;
}

interface TabsProps {
  /** Available tabs */
  tabs: Tab[];
  /** Currently active tab key */
  activeKey: string;
  /** Tab change handler */
  onChange: (key: string) => void;
  /** Visual variant */
  variant?: 'underline' | 'pill';
  /** Full-width mode — tabs stretch evenly */
  fullWidth?: boolean;
}

export function Tabs({ tabs, activeKey, onChange, variant = 'pill', fullWidth }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '2px solid var(--border-color)',
        width: fullWidth ? '100%' : undefined,
      }}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              style={{
                flex: fullWidth ? 1 : undefined,
                padding: '10px 16px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                borderBottom: `2px solid ${isActive ? 'var(--primary-color)' : 'transparent'}`,
                marginBottom: '-2px',
                background: 'none',
                border: 'none',
                borderBottomStyle: 'solid',
                borderBottomWidth: '2px',
                borderBottomColor: isActive ? 'var(--primary-color)' : 'transparent',
                cursor: 'pointer',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill variant (default)
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      padding: '4px',
      borderRadius: '10px',
      backgroundColor: 'var(--surface-secondary)',
      width: fullWidth ? '100%' : 'fit-content',
    }}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex: fullWidth ? 1 : undefined,
              padding: '8px 16px',
              fontSize: '0.8125rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--surface-color)' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
