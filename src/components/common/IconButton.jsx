import React from 'react';

export default function IconButton({
  icon: Icon,
  label,
  badge,
  active = false,
  onClick,
  className = '',
  size = 'md',
  variant = 'default',
  title,
}) {
  const sizeStyles = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const variantStyles = {
    default:
      'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 active:bg-slate-200 dark:active:bg-slate-700',
    primary:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30',
    danger:
      'bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 border border-red-500/30',
    ghost:
      'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      aria-label={label || title}
      className={`relative inline-flex items-center justify-center rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
        active
          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40 shadow-sm'
          : variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 stroke-[1.8]" />}
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );
}
