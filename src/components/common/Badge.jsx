import React from 'react';

export default function Badge({ variant = 'neutral', size = 'md', children, className = '' }) {
  const variantStyles = {
    critical:
      'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30 ring-1 ring-red-500/20 font-bold',
    high:
      'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30 ring-1 ring-orange-500/20 font-bold',
    medium:
      'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 ring-1 ring-amber-500/20 font-semibold',
    low:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 ring-1 ring-emerald-500/20 font-semibold',
    safe:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold',
    'at-risk':
      'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 font-semibold',
    blocked:
      'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30 font-bold',
    info:
      'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30 font-medium',
    neutral:
      'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium',
    purple:
      'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30 font-medium',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded',
    md: 'text-xs px-2 py-0.5 rounded-md',
    lg: 'text-sm px-2.5 py-1 rounded-md font-medium',
  };

  const activeVariant = variantStyles[variant.toLowerCase()] || variantStyles.neutral;
  const activeSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center gap-1 border uppercase tracking-wider transition-colors ${activeVariant} ${activeSize} ${className}`}
    >
      {children}
    </span>
  );
}
