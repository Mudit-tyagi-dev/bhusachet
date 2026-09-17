import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

// All 8 North East Region states with approximate map centers
const NER_STATES = [
  { id: 'all', name: 'All NER', coords: [26.3, 90.5], zoom: 7.5 },
  { id: 'arunachal-pradesh', name: 'Arunachal Pradesh', coords: [28.2, 94.7], zoom: 7 },
  { id: 'assam', name: 'Assam', coords: [26.2, 92.9], zoom: 7.5 },
  { id: 'manipur', name: 'Manipur', coords: [24.8, 93.9], zoom: 9 },
  { id: 'meghalaya', name: 'Meghalaya', coords: [25.5, 91.4], zoom: 9 },
  { id: 'mizoram', name: 'Mizoram', coords: [23.2, 92.9], zoom: 9 },
  { id: 'nagaland', name: 'Nagaland', coords: [26.1, 94.6], zoom: 9 },
  { id: 'sikkim', name: 'Sikkim', coords: [27.5, 88.5], zoom: 10 },
  { id: 'tripura', name: 'Tripura', coords: [23.9, 91.9], zoom: 9 },
];

export default function StateSelector({ activeState, onSelectState }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Normalize activeState for comparison (handle legacy 'ALL', 'SIKKIM', 'MEGHALAYA' values)
  const normalizedActive = (activeState || 'all').toLowerCase();
  const resolvedActive = normalizedActive === 'all' ? 'all' : normalizedActive;

  const handleSelect = (state) => {
    onSelectState(state.id, state.coords, state.zoom);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] w-52 select-none">
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-950 shadow-xl">
        {/* Region Header */}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Region
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block leading-tight">
                North East Region
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
            aria-label="Toggle region panel"
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* States List */}
        {!isCollapsed && (
          <div className="bg-white dark:bg-slate-950">
            <div className="px-3.5 pt-2 pb-1">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                NER States
              </span>
            </div>
            <div className="px-2 pb-2 space-y-0.5 max-h-72 overflow-y-auto">
              {NER_STATES.map((state) => {
                const isActive = resolvedActive === state.id;
                return (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => handleSelect(state)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isActive
                            ? 'bg-slate-900'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                      {state.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
