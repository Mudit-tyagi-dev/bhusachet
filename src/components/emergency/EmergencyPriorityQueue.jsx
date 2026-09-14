import React from 'react';
import { AlertOctagon, Users, PhoneCall, MapPin } from 'lucide-react';
import Badge from '../common/Badge';

export default function EmergencyPriorityQueue({ riskZones, onFocusZone }) {
  // Rank zones by priority (probability * population risk factor)
  const priorityQueue = [...riskZones]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  return (
    <div className="p-4 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 h-full flex flex-col transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Emergency Priority Queue</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Ranked urgent response zones for SDMA / NDRF</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 animate-pulse">
          TOP 5 CRISIS SITES
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5">
        {priorityQueue.map((zone, index) => (
          <div
            key={zone.id}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/40 transition-all group shadow-xs"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center font-mono">
                  #{index + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {zone.locationName}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                    {zone.state} • {zone.district}
                  </span>
                </div>
              </div>
              <Badge variant="critical">{zone.probability}% PROB</Badge>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 dark:text-slate-300 my-2 p-2 bg-white dark:bg-slate-950/60 rounded border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Est. Pop. at Risk:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Users className="w-3 h-3 text-sky-600 dark:text-sky-400" /> {zone.estimatedPopulationAtRisk.toLocaleString()} Residents
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">24h Precipitation:</span>
                <span className="font-bold text-amber-700 dark:text-amber-300">{zone.rainfall24h} mm</span>
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => onFocusZone && onFocusZone(zone)}
                className="flex-1 py-1 px-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-[11px] font-semibold flex items-center justify-center gap-1"
              >
                <MapPin className="w-3 h-3 text-amber-500" /> Focus on Map
              </button>
              <button
                type="button"
                className="py-1 px-2 bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 rounded text-[11px] font-semibold flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" /> Mobilize NDRF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
