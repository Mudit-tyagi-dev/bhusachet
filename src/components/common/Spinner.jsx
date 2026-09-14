import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizeStyles = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-4 h-4 border-2',
    lg: 'w-6 h-6 border-[2.5px]',
  };

  return (
    <div
      className={`inline-block rounded-full border-slate-600 border-t-amber-400 animate-spin ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      role="status"
      aria-label="loading"
    />
  );
}
