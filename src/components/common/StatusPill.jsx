import React from 'react';

export default function StatusPill({ status = 'live', label, sublabel, className = '' }) {
  const isLive = status === 'live';

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium backdrop-blur-md transition-colors ${
        isLive
          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-300'
          : 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-500/30 dark:text-amber-300'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isLive ? 'bg-emerald-500 shadow-[0_0_8px_#34d399]' : 'bg-amber-500'
          }`}
        ></span>
      </span>
      <span className="tracking-wide font-semibold">{label || (isLive ? 'SYSTEM LIVE' : 'DATA STALE')}</span>
      {sublabel && (
        <span className="text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-1.5 text-[11px]">
          {sublabel}
        </span>
      )}
    </div>
  );
}
