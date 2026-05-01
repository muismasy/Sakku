'use client';

import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color = '#4F46E5', height = 10 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Animate on load with a slight delay for better visual impact
    const timer = setTimeout(() => {
      setWidth(Math.min(Math.max(progress, 0), 100));
    }, 200);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div style={{
      width: '100%',
      height: `${height}px`,
      backgroundColor: 'var(--border-color)', // Using border-color for a subtle track
      borderRadius: `${height / 2}px`,
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div 
        style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: `${height / 2}px`,
          transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy spring effect
          position: 'relative',
          boxShadow: `0 0 10px ${color}33` // Subtle glow
        }}
      >
        {/* Shine effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
          animation: 'shine 3s infinite ease-in-out'
        }} />
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
