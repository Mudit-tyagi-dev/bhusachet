import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function RiskSeverityBreakdown({ riskZones, activeFilter, onSelectFilter }) {
  const counts = {
    CRITICAL: riskZones.filter((z) => z.riskLevel === 'CRITICAL').length,
    HIGH: riskZones.filter((z) => z.riskLevel === 'HIGH').length,
    MEDIUM: riskZones.filter((z) => z.riskLevel === 'MEDIUM').length,
    LOW: riskZones.filter((z) => z.riskLevel === 'LOW').length,
  };

  const total = riskZones.length || 1;

  const items = [
    {
      level: 'CRITICAL',
      label: 'Critical Risk',
      count: counts.CRITICAL,
      color: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-500/40',
      bg: 'bg-red-50/80 dark:bg-red-950/40',
      bar: 'bg-red-500',
      icon: ShieldAlert,
    },
    {
      level: 'HIGH',
      label: 'High Risk',
      count: counts.HIGH,
      color: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-500/40',
      bg: 'bg-orange-50/80 dark:bg-orange-950/40',
      bar: 'bg-orange-500',
      icon: AlertTriangle,
    },
    {
      level: 'MEDIUM',
      label: 'Medium Risk',
      count: counts.MEDIUM,
      color: 'text-amber-800 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/40',
      bg: 'bg-amber-50/80 dark:bg-amber-950/40',
      bar: 'bg-amber-500',
      icon: Info,
    },
    {
      level: 'LOW',
      label: 'Low Risk',
      count: counts.LOW,
      color: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/40',
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      bar: 'bg-emerald-500',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isSelected = activeFilter === item.level;
          const pct = Math.round((item.count / total) * 100);

          return (
            <button
              key={item.level}
              type="button"
              onClick={() => onSelectFilter(isSelected ? 'ALL' : item.level)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                item.bg
              } ${item.border} ${
                isSelected
                  ? 'ring-2 ring-amber-500 scale-[1.02] shadow-sm'
                  : 'hover:brightness-95 dark:hover:brightness-110'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold ${item.color} flex items-center gap-1`}>
                  <Icon className="w-3.5 h-3.5" /> {item.label}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.count}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                <span>{pct}% of zones</span>
                {isSelected && <span className="text-amber-600 dark:text-amber-300 font-bold">Active</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
