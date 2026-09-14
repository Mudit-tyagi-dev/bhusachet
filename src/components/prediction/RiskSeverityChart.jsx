import React, { useState } from 'react';
import { PieChart, BarChart3, AlertCircle } from 'lucide-react';

export default function RiskSeverityChart({ riskZones, activeFilter, onSelectFilter }) {
  const [chartType, setChartType] = useState('donut'); // 'donut' | 'bar'

  const counts = {
    CRITICAL: riskZones.filter((z) => z.riskLevel === 'CRITICAL').length,
    HIGH: riskZones.filter((z) => z.riskLevel === 'HIGH').length,
    MEDIUM: riskZones.filter((z) => z.riskLevel === 'MEDIUM').length,
    LOW: riskZones.filter((z) => z.riskLevel === 'LOW').length,
  };

  const total = riskZones.length || 1;

  const data = [
    { level: 'CRITICAL', label: 'Critical', count: counts.CRITICAL, color: '#ef4444', pct: Math.round((counts.CRITICAL / total) * 100) },
    { level: 'HIGH', label: 'High', count: counts.HIGH, color: '#f97316', pct: Math.round((counts.HIGH / total) * 100) },
    { level: 'MEDIUM', label: 'Medium', count: counts.MEDIUM, color: '#f59e0b', pct: Math.round((counts.MEDIUM / total) * 100) },
    { level: 'LOW', label: 'Low', count: counts.LOW, color: '#10b981', pct: Math.round((counts.LOW / total) * 100) },
  ];

  // SVG Donut Calculations
  let accumulatedAngle = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="p-3 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs mb-3">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <PieChart className="w-3.5 h-3.5 text-amber-500" />
          <span>Risk Severity Breakdown</span>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setChartType('donut')}
            className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
              chartType === 'donut'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Donut
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {chartType === 'donut' ? (
        <div className="flex items-center justify-around gap-2">
          {/* SVG Donut */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="13"
                fill="none"
              />
              {data.map((slice) => {
                const strokeDasharray = `${(slice.pct / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedAngle;
                accumulatedAngle += (slice.pct / 100) * circumference;

                return (
                  <circle
                    key={slice.level}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={slice.color}
                    strokeWidth="13"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="none"
                    className="transition-all duration-500 cursor-pointer hover:opacity-80"
                    onClick={() => onSelectFilter(activeFilter === slice.level ? 'ALL' : slice.level)}
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center select-none">
              <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                {riskZones.length}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Zones</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="flex-1 space-y-1 text-xs">
            {data.map((item) => {
              const isSelected = activeFilter === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => onSelectFilter(isSelected ? 'ALL' : item.level)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded transition-all ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-500/20 font-bold text-amber-800 dark:text-amber-300 ring-1 ring-amber-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[11px]">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                    {item.count} ({item.pct}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Horizontal Progress Bar Chart */
        <div className="space-y-2 py-1">
          {data.map((item) => (
            <div
              key={item.level}
              className="cursor-pointer group"
              onClick={() => onSelectFilter(activeFilter === item.level ? 'ALL' : item.level)}
            >
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label} Risk
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  {item.count} zones ({item.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
