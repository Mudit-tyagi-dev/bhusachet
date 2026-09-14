import React, { useState } from 'react';
import { Cpu, CloudRain, Mountain, Crosshair, Sparkles, AlertCircle } from 'lucide-react';
import RiskSeverityBreakdown from './RiskSeverityBreakdown';
import RiskSeverityChart from './RiskSeverityChart';
import Badge from '../common/Badge';

export default function PredictionPanel({ riskZones, onFocusZone, isRefreshing = false }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');

  const filteredZones = riskZones.filter((zone) => {
    const matchesSeverity = severityFilter === 'ALL' || zone.riskLevel === severityFilter;
    const matchesState = selectedState === 'ALL' || zone.state.toUpperCase() === selectedState;
    return matchesSeverity && matchesState;
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">AI Early Warning Models</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Multi-source satellite, soil moisture & rainfall fusion</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Model v4.2 Live
          </span>
        </div>

        {/* Severity Donut & Bar Chart */}
        <RiskSeverityChart
          riskZones={riskZones}
          activeFilter={severityFilter}
          onSelectFilter={setSeverityFilter}
        />

        {/* Severity Metrics Breakdown Cards */}
        <RiskSeverityBreakdown
          riskZones={riskZones}
          activeFilter={severityFilter}
          onSelectFilter={setSeverityFilter}
        />

        {/* State Filter tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/60">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mr-1">Filter State:</span>
          {['ALL', 'SIKKIM', 'MEGHALAYA'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedState(st)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                selectedState === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Pilot States' : st}
            </button>
          ))}
        </div>
      </div>

      {/* List of Risk Zones */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Predicted Hazard Zones ({filteredZones.length})</span>
          {severityFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSeverityFilter('ALL')}
              className="text-amber-600 dark:text-amber-400 hover:underline text-[11px] font-semibold"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Refresh Loading Skeleton State */}
        {isRefreshing ? (
          <div className="space-y-3 py-2 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/5"></div>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredZones.length === 0 ? (
          /* Proper Empty State */
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Hazard Zones Found</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              No active predicted risk zones match the selected severity and state filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSeverityFilter('ALL');
                setSelectedState('ALL');
              }}
              className="mt-3 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-lg group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    {zone.state} • {zone.district}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {zone.locationName}
                  </h4>
                </div>
                <Badge variant={zone.riskLevel.toLowerCase()}>{zone.riskLevel}</Badge>
              </div>

              {/* AI probability bar */}
              <div className="my-2 p-2 bg-white dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">AI Risk Probability</span>
                  <span className="font-extrabold text-amber-700 dark:text-amber-300">{zone.probability}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      zone.riskLevel === 'CRITICAL'
                        ? 'bg-red-500'
                        : zone.riskLevel === 'HIGH'
                        ? 'bg-orange-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${zone.probability}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 mb-2">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <CloudRain className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  <span>24h Rain: <b className="text-slate-800 dark:text-slate-200">{zone.rainfall24h} mm</b></span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Mountain className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Slope: <b className="text-slate-800 dark:text-slate-200">{zone.slopeAngle}°</b></span>
                </div>
              </div>

              {/* Infrastructure at risk */}
              <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Key Infra: </span>
                {zone.criticalInfrastructure.join(', ')}
              </div>

              {/* Action button */}
              <button
                type="button"
                onClick={() => onFocusZone && onFocusZone(zone)}
                className="w-full py-1.5 px-2 bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-800 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Crosshair className="w-3.5 h-3.5" /> Locate on Map
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
