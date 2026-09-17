import React, { useState, useMemo } from 'react';
import { Route, Navigation, Clock, Crosshair, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

export default function RoadsPanel({ roads, onFocusRoad, isRefreshing = false }) {
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Extract available districts
  const districts = useMemo(() => {
    const list = Array.from(new Set(roads.map((r) => r.district)));
    return ['ALL', ...list];
  }, [roads]);

  const filteredRoads = roads.filter((road) => {
    const matchesDistrict = districtFilter === 'ALL' || road.district === districtFilter;
    const matchesStatus = statusFilter === 'ALL' || road.status === statusFilter;
    return matchesDistrict && matchesStatus;
  });

  const blockedCount = roads.filter((r) => r.status === 'blocked').length;
  const atRiskCount = roads.filter((r) => r.status === 'at-risk').length;
  const safeCount = roads.filter((r) => r.status === 'safe').length;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header & Filter Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Lifeline Road Corridors</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Transit status & active landslide blockages</p>
            </div>
          </div>
          {blockedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40">
              {blockedCount} Roads Blocked
            </span>
          )}
        </div>

        {/* Quick Status Breakdown Summary */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'blocked' ? 'ALL' : 'blocked')}
            className={`p-2 rounded-lg border text-left transition-all ${
              statusFilter === 'blocked'
                ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 dark:border-rose-500/60 ring-1 ring-rose-400'
                : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100/80'
            }`}
          >
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block">Blocked</span>
            <span className="text-base font-bold text-rose-900 dark:text-rose-200">{blockedCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'at-risk' ? 'ALL' : 'at-risk')}
            className={`p-2 rounded-lg border text-left transition-all ${
              statusFilter === 'at-risk'
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400'
                : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100/80'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 block">At Risk</span>
            <span className="text-base font-bold text-amber-950 dark:text-amber-200">{atRiskCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'safe' ? 'ALL' : 'safe')}
            className={`p-2 rounded-lg border text-left transition-all ${
              statusFilter === 'safe'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-500/60 ring-1 ring-emerald-400'
                : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100/80'
            }`}
          >
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">Passable</span>
            <span className="text-base font-bold text-emerald-900 dark:text-emerald-200">{safeCount}</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Filter by District:
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Districts (NER)' : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Roads List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {isRefreshing ? (
          <div className="space-y-3 py-2 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredRoads.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Road Corridors Found</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              No highway corridors match the selected filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setDistrictFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="mt-3 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Reset Road Filters
            </button>
          </div>
        ) : (
          filteredRoads.map((road) => (
            <div
              key={road.id}
              className={`p-3 rounded-xl border transition-all ${
                road.status === 'blocked'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/30'
                  : road.status === 'at-risk'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/30'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    {road.state} • {road.district}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{road.name}</h4>
                </div>
                <Badge variant={road.status}>{road.status}</Badge>
              </div>

              {/* Status Reason */}
              <p className="text-[11px] text-slate-600 dark:text-slate-300 my-1.5 leading-snug">
                {road.statusReason}
              </p>

              {/* Detour Guidance */}
              {road.alternateRoute && (
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 rounded-lg my-2 text-[11px]">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Recommended Detour:
                  </span>
                  <p className="text-amber-900/90 dark:text-amber-200/90 text-[10px] mt-0.5">{road.alternateRoute}</p>
                </div>
              )}

              {/* Agency & ETA */}
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 mb-2">
                <div>
                  <span>Clearing Unit: </span>
                  <b className="text-slate-700 dark:text-slate-300 block">{road.clearingAgency}</b>
                </div>
                <div>
                  <span>ETA: </span>
                  <b className="text-amber-700 dark:text-amber-300 block">{road.estimatedClearanceTime}</b>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => onFocusRoad && onFocusRoad(road)}
                className="w-full py-1.5 px-2 bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-800 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Crosshair className="w-3.5 h-3.5" /> View Highway Corridor on Map
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
