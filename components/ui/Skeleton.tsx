'use client';

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width, height, borderRadius = '8px', className = '', style = {} }: SkeletonProps) {
  return (
    <div 
      className={`skeleton-pulse ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius,
        backgroundColor: 'var(--surface-secondary)',
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
        backgroundSize: '200% 100%',
        ...style
      }}
    />
  );
}
