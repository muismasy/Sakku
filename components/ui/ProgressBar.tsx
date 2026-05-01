'use client';

import React from 'react';

interface ProgressBarProps {
  /** Current value (0-100) */
  value: number;
  /** Maximum value — defaults to 100 */
  max?: number;
  /** Bar color — auto picks green/yellow/red based on value, or pass a custom color */
  color?: string;
  /** Height of the bar in px */
  height?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Label text override (e.g. "Rp 500k / Rp 1M") */
  label?: string;
  /** Animate fill on mount */
  animated?: boolean;
}

export function ProgressBar({ value, max = 100, color, height = 8, showLabel, label, animated = true }: ProgressBarProps) {
  const [mounted, setMounted] = React.useState(false);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  React.useEffect(() => {
    if (animated) {
      const t = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(t);
    } else {
      setMounted(true);
    }
  }, [animated]);

  const resolvedColor = color ?? (
    percentage >= 100 ? 'var(--danger-color)' :
    percentage >= 80 ? 'var(--warning-color)' :
    'var(--primary-color)'
  );

  return (
    <div>
      {(showLabel || label) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <span>{label ?? ''}</span>
          {showLabel && <span style={{ fontWeight: 600 }}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          borderRadius: `${height}px`,
          backgroundColor: 'var(--surface-secondary)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: mounted ? `${percentage}%` : '0%',
            height: '100%',
            borderRadius: `${height}px`,
            backgroundColor: resolvedColor,
            transition: animated ? 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
