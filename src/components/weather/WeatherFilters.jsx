import React from 'react';
import {
  CloudRain,
  Thermometer,
  Layers,
  Wind,
  Radio,
  MapPin,
  Filter,
  Calendar,
  Globe,
} from 'lucide-react';
import { NER_STATES } from '../../data/districts/nerDistricts';

export default function WeatherFilters({
  selectedState = 'ALL',
  onSelectState,
  selectedDistrictId = '',
  onSelectDistrictId,
  districts = [],
  displayMode = 'rainfall',
  onSelectDisplayMode,
  timePeriod = '24h',
  onSelectTimePeriod,
  isLive = true,
}) {
  const displayModes = [
    { id: 'rainfall', label: 'Rainfall Heatmap', icon: CloudRain, color: 'text-sky-500' },
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-amber-500' },
    { id: 'soil', label: 'Soil Moisture', icon: Layers, color: 'text-emerald-500' },
    { id: 'wind', label: 'Wind Field', icon: Wind, color: 'text-indigo-500' },
    { id: 'radar', label: 'Doppler Radar', icon: Radio, color: 'text-purple-500' },
  ];

  const timePeriods = [
    { id: 'current', label: 'Current Rate', group: 'Observed' },
    { id: '6h', label: 'Past 6H Sum', group: 'Observed' },
    { id: '24h', label: 'Past 24H Cumulative', group: 'Observed' },
    { id: 'forecast24h', label: 'Next 24H Forecast', group: 'Forecast' },
    { id: 'forecast3d', label: 'Next 3D Forecast', group: 'Forecast' },
    { id: 'forecast7d', label: 'Next 7D Forecast', group: 'Forecast' },
  ];

  return (
    <div className="bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* LEFT: Geographic Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Region Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] text-slate-500 dark:text-slate-400">REGION:</span>
          <span>North East Region (NER)</span>
        </div>

        {/* State Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">STATE:</span>
          <select
            value={selectedState}
            onChange={(e) => onSelectState(e.target.value)}
            className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="dark:bg-slate-900">All 8 NER States</option>
            {NER_STATES.map((state) => (
              <option key={state} value={state} className="dark:bg-slate-900">
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">DISTRICT:</span>
          <select
            value={selectedDistrictId}
            onChange={(e) => onSelectDistrictId(e.target.value)}
            className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer text-xs max-w-[180px] sm:max-w-xs truncate"
          >
            <option value="" className="dark:bg-slate-900">
              {selectedState === 'ALL' ? 'Select Any NER District' : `All Districts in ${selectedState}`}
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id} className="dark:bg-slate-900">
                {d.name} {selectedState === 'ALL' ? `(${d.state})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MIDDLE: Display Mode Selector */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
        {displayModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = displayMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectDisplayMode(mode.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title={mode.label}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : mode.color}`} />
              <span className="hidden md:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT: Rainfall Time Period (when Rainfall mode active) */}
      {displayMode === 'rainfall' && (
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Period:</span>
          <select
            value={timePeriod}
            onChange={(e) => onSelectTimePeriod(e.target.value)}
            className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer text-xs"
          >
            <optgroup label="Observed / Recent">
              <option value="current" className="dark:bg-slate-900">Current Rainfall (Rate)</option>
              <option value="6h" className="dark:bg-slate-900">Past 6 Hours (Sum)</option>
              <option value="24h" className="dark:bg-slate-900">Past 24 Hours (Cumulative)</option>
            </optgroup>
            <optgroup label="Forecast Mode">
              <option value="forecast24h" className="dark:bg-slate-900">Next 24H Forecast</option>
              <option value="forecast3d" className="dark:bg-slate-900">Next 3 Days Forecast</option>
              <option value="forecast7d" className="dark:bg-slate-900">Next 7 Days Forecast</option>
            </optgroup>
          </select>
        </div>
      )}
    </div>
  );
}
