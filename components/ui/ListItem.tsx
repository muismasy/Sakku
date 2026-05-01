'use client';

import React from 'react';

interface ListItemProps {
  /** Left-side icon or emoji */
  icon?: React.ReactNode;
  /** Primary label */
  label: string;
  /** Secondary description text */
  description?: string;
  /** Right-side value or element (e.g. amount, badge) */
  trailing?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Destructive / danger styling */
  danger?: boolean;
  /** Visually disabled */
  disabled?: boolean;
}

export function ListItem({ icon, label, description, trailing, onClick, danger, disabled }: ListItemProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: hovered && !disabled ? 'var(--surface-secondary)' : 'transparent',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon && (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: danger ? 'rgba(220, 38, 38, 0.08)' : 'var(--surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: danger ? 'var(--danger-color)' : 'var(--text-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {description}
          </div>
        )}
      </div>
      {trailing && (
        <div style={{ flexShrink: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {trailing}
        </div>
      )}
    </div>
  );
}
