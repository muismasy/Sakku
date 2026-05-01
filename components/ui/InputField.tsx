'use client';

import React from 'react';

interface InputFieldProps {
  /** Field label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Input type — text, number, email, password, etc. */
  type?: string;
  /** Prefix element (e.g. "Rp" or an icon) */
  prefix?: React.ReactNode;
  /** Suffix element (e.g. a unit or icon) */
  suffix?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Helper text below the input */
  hint?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Use textarea instead of input */
  multiline?: boolean;
  /** Rows for multiline */
  rows?: number;
  /** HTML id for the input */
  id?: string;
  /** Automatically focus the input on mount */
  autoFocus?: boolean;
}

export function InputField({
  label, placeholder, value, onChange, type = 'text',
  prefix, suffix, error, hint, disabled, multiline, rows = 3, id,
  autoFocus
}: InputFieldProps) {
  const [focused, setFocused] = React.useState(false);

  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const borderColor = error ? 'var(--danger-color)' : focused ? 'var(--primary-color)' : 'var(--border-color)';

  const sharedStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.875rem',
    color: 'var(--text-main)',
    fontFamily: 'inherit',
    width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--text-main)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: multiline ? '10px 12px' : '0 12px',
        height: multiline ? 'auto' : '42px',
        borderRadius: 'var(--radius-md)',
        border: `1.5px solid ${borderColor}`,
        backgroundColor: disabled ? 'var(--surface-secondary)' : 'var(--surface-color)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(220,38,38,0.1)' : 'rgba(79,70,229,0.1)'}` : 'none',
        opacity: disabled ? 0.6 : 1,
      }}>
        {prefix && (
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', flexShrink: 0 }}>{prefix}</span>
        )}
        {multiline ? (
          <textarea
            id={inputId}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            rows={rows}
            autoFocus={autoFocus}
            style={{ ...sharedStyle, resize: 'vertical', minHeight: '60px' }}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            autoFocus={autoFocus}
            style={sharedStyle}
          />
        )}
        {suffix && (
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', flexShrink: 0 }}>{suffix}</span>
        )}
      </div>
      {(error || hint) && (
        <span style={{
          fontSize: '0.75rem',
          color: error ? 'var(--danger-color)' : 'var(--text-muted)',
        }}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
}
