'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  /** Optional title displayed at the top */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional right-side header action (e.g. a button or icon) */
  headerAction?: React.ReactNode;
  /** Remove default padding */
  noPadding?: boolean;
  /** Disable hover elevation effect */
  flat?: boolean;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
  /** Click handler — makes the card interactive */
  onClick?: () => void;
}

export function Card({ children, title, subtitle, headerAction, noPadding, flat, style, onClick, className }: CardProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--radius-lg)',
        padding: noPadding ? 0 : 'var(--spacing-padding)',
        border: '1px solid var(--border-color)',
        boxShadow: !flat && hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        borderColor: !flat && hovered ? 'var(--primary-color)' : 'var(--border-color)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {(title || headerAction) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: subtitle ? '4px' : '16px',
          padding: noPadding ? 'var(--spacing-padding) var(--spacing-padding) 0' : undefined,
        }}>
          {title && (
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{title}</h3>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {subtitle && (
        <p style={{
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          margin: '0 0 16px 0',
          padding: noPadding ? '0 var(--spacing-padding)' : undefined,
        }}>{subtitle}</p>
      )}
      {children}
    </div>
  );
}
