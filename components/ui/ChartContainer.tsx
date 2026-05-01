'use client';

import React from 'react';

interface ChartContainerProps {
  /** Chart title */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Header right action (e.g. period selector, dropdown) */
  headerAction?: React.ReactNode;
  /** Chart content */
  children: React.ReactNode;
  /** Fixed height for the chart area */
  height?: number;
  /** Remove card-style wrapper — render inline */
  inline?: boolean;
}

export function ChartContainer({ title, subtitle, headerAction, children, height = 240, inline }: ChartContainerProps) {
  const content = (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            margin: 0,
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              margin: '4px 0 0 0',
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div style={{
        height: `${height}px`,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {children}
      </div>
    </>
  );

  if (inline) return <div>{content}</div>;

  return (
    <div style={{
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-padding)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {content}
    </div>
  );
}
