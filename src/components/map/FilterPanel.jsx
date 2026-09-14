import React, { useState } from 'react';
import {
  Layers,
  Flame,
  Route,
  CloudRain,
  Users,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function FilterPanel({ layers, onToggleLayer, activeCounts = {} }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const layerOptions = [
    {
      id: 'heatmap',
      label: 'Landslide Risk Heatmap',
      icon: Flame,
      color: 'text-rose-500 dark:text-rose-400',
      activeBg:
        'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300',
      count: activeCounts.riskZones || 10,
    },
    {
      id: 'roads',
      label: 'Road Network Status',
      icon: Route,
      color: 'text-amber-600 dark:text-amber-400',
      activeBg:
        'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300',
      count: activeCounts.roads || 8,
    },
    {
      id: 'weather',
      label: 'Weather & Rainfall Radar',
      icon: CloudRain,
      color: 'text-sky-600 dark:text-sky-400',
      activeBg:
        'bg-sky-50 dark:bg-sky-500/10 border-sky-300 dark:border-sky-500/30 text-sky-800 dark:text-sky-300',
      count: activeCounts.weather || 4,
    },
    {
      id: 'reports',
      label: 'Citizen Field Reports',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      activeBg:
        'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30 text-indigo-800 dark:text-indigo-300',
      count: activeCounts.reports || 6,
    },
    {
      id: 'boundaries',
      label: 'District Boundaries',
      icon: MapPin,
      color: 'text-emerald-600 dark:text-emerald-400',
      activeBg:
        'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300',
      count: activeCounts.districts || 8,
    },
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] w-72 transition-all duration-200 shadow-2xl">
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-950/90 shadow-2xl shadow-slate-900/10 dark:shadow-black/60">
        {/* Header */}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider block">
                Map Layer Filters
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {Object.values(layers).filter(Boolean).length} / {layerOptions.length} Active
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
            aria-label="Toggle filter panel"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Layer Toggle Items */}
        {!isCollapsed && (
          <div className="p-2 space-y-1.5 bg-slate-50/60 dark:bg-slate-950/70 max-h-80 overflow-y-auto">
            {layerOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = layers[opt.id];

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onToggleLayer(opt.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    isActive
                      ? `${opt.activeBg} shadow-sm`
                      : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? opt.color : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-left">{opt.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-black/10 dark:bg-black/30 text-slate-800 dark:text-white font-bold'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-500'
                      }`}
                    >
                      {opt.count}
                    </span>
                    {isActive ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Quick Helper Note */}
            <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800/80 px-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>Multi-layer fusion active</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono">Pilot v1.2</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
