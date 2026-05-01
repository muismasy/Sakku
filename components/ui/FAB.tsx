'use client';

import React from 'react';

interface FABProps {
  /** Click handler */
  onClick: () => void;
  /** Icon content — defaults to "+" */
  icon?: React.ReactNode;
  /** Accessible label */
  label?: string;
  /** Position — defaults to bottom-right */
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  /** Custom color override */
  color?: string;
}

export function FAB({ onClick, icon = '+', label = 'Add', position = 'bottom-right', color }: FABProps) {
  const [pressed, setPressed] = React.useState(false);

  const positionStyle: React.CSSProperties =
    position === 'bottom-center' ? { bottom: '90px', left: '50%', transform: `translateX(-50%) scale(${pressed ? 0.92 : 1})` } :
    position === 'bottom-left'   ? { bottom: '90px', left: '24px', transform: `scale(${pressed ? 0.92 : 1})` } :
                                   { bottom: '90px', right: '24px', transform: `scale(${pressed ? 0.92 : 1})` };

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label={label}
      style={{
        position: 'fixed',
        zIndex: 1500,
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: color ?? 'var(--primary-color)',
        color: '#fff',
        border: 'none',
        fontSize: '24px',
        fontWeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...positionStyle,
      }}
    >
      {icon}
    </button>
  );
}
