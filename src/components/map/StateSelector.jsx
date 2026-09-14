import React from 'react';
import { Compass } from 'lucide-react';

export default function StateSelector({ activeState, onSelectState }) {
  const states = [
    { id: 'ALL', label: 'All Pilot Zones', coords: [26.3, 90.5], zoom: 7.5 },
    { id: 'SIKKIM', label: 'Sikkim', coords: [27.45, 88.52], zoom: 9.5, badge: '5 Hotspots' },
    { id: 'MEGHALAYA', label: 'Meghalaya', coords: [25.48, 91.35], zoom: 9.0, badge: '6 Hotspots' },
  ];

  return (
    <div className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 p-1 glass-panel rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-950/85 shadow-xl">
      <div className="pl-2 pr-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <Compass className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Region:</span>
      </div>
      {states.map((st) => {
        const isActive = activeState === st.id;
        return (
          <button
            key={st.id}
            type="button"
            onClick={() => onSelectState(st.id, st.coords, st.zoom)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              isActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <span>{st.label}</span>
            {st.badge && (
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                  isActive
                    ? 'bg-black/20 text-slate-900 font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {st.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
