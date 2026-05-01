'use client';

import React from 'react';

interface BottomSheetProps {
  /** Whether the sheet is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Content */
  children: React.ReactNode;
  /** Max height as CSS value — defaults to 85vh */
  maxHeight?: string;
}

export function BottomSheet({ open, onClose, title, children, maxHeight = '85vh' }: BottomSheetProps) {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          maxHeight,
          backgroundColor: 'var(--surface-color)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{
            width: '36px',
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'var(--border-color)',
          }} />
        </div>

        {/* Header */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px 16px',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: 'var(--surface-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: 'var(--text-muted)',
                transition: 'background-color 0.15s ease',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
