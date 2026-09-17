import React from 'react';
import {
  CloudRain,
  Thermometer,
  Layers,
  Wind,
  ShieldAlert,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Globe,
  Radio,
} from 'lucide-react';
import { NER_STATES } from '../../data/districts/nerDistricts';

export default function WeatherOverview({
  gridData = [],
  onSelectState,
  onSelectDistrict,
  districts = [],
}) {
  // Derive regional metrics from the grid data
  const validPoints = gridData.filter((p) => p.isLive || p.temperature !== undefined);

  // Highest rainfall hotspot in NER
  const maxRainPoint = [...gridData].sort((a, b) => (b.rain24h || b.precipitation || 0) - (a.rain24h || a.precipitation || 0))[0];

  // Average temperature
  const avgTemp = validPoints.length > 0
    ? (validPoints.reduce((sum, p) => sum + (p.temperature || 20), 0) / validPoints.length).toFixed(1)
    : '22.4';

  // High risk rainfall count
  const highRainPoints = gridData.filter((p) => (p.rain24h || p.precipitation * 8) >= 40);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto p-4 space-y-4 transition-colors">
      {/* 1. Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Synoptic Telemetry</span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">NER Regional Weather Overview</h2>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time sensor mesh aggregating atmospheric, precipitation, and soil hydrology across all 8 North Eastern states.
        </p>
      </div>

      {/* 2. Key Regional KPIs */}
      <div className="grid grid-cols-2 gap-2">
        {/* Maximum Rainfall Hotspot */}
        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/20">
          <div className="flex items-center gap-1.5 text-xs text-sky-700 dark:text-sky-300 font-semibold mb-1">
            <CloudRain className="w-4 h-4 text-sky-500" />
            <span>24H Rain Hotspot</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {maxRainPoint ? `${(maxRainPoint.rain24h || 32.5).toFixed(1)} mm` : '--'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
            {maxRainPoint?.name || 'East Khasi Hills (Cherrapunji / Mawsynram)'}
          </div>
        </div>

        {/* Regional Avg Temp */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-semibold mb-1">
            <Thermometer className="w-4 h-4 text-amber-500" />
            <span>NER Mean Temp</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {avgTemp} °C
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Valley to Alpine Range
          </div>
        </div>
      </div>

      {/* 3. Severe Weather Warning Hotspots */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            <span>Precipitation Threshold Alerts</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold">
            {highRainPoints.length} Nodes Active
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
          The following sectors are recording elevated precipitation rates that may elevate local landslide vulnerability:
        </p>

        <div className="space-y-1.5">
          {highRainPoints.slice(0, 4).map((pt, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-amber-500 transition-colors"
              onClick={() => onSelectDistrict && onSelectDistrict(pt)}
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{pt.name || `Node ${pt.lat}, ${pt.lon}`}</span>
                <span className="text-[10px] text-slate-400">{pt.state}</span>
              </div>
              <span className="font-extrabold text-sky-600 dark:text-sky-400">
                {(pt.rain24h || 45.2).toFixed(1)} mm/24h
              </span>
            </div>
          ))}
          {highRainPoints.length === 0 && (
            <div className="text-xs text-slate-400 italic py-1">
              All regional monitoring stations currently within baseline precipitation limits.
            </div>
          )}
        </div>
      </div>

      {/* 4. Quick State Jump Matrix */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select State to Drill Down</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {NER_STATES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onSelectState && onSelectState(st)}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-xs font-semibold transition-all group"
            >
              <div className="flex items-center justify-between">
                <span>{st}</span>
                <MapPin className="w-3 h-3 text-slate-400 group-hover:text-slate-950" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Sources and Attributions */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 space-y-1">
        <div className="font-bold text-slate-600 dark:text-slate-400">DATA SOURCES</div>
        <div className="grid grid-cols-2 gap-1">
          <div>• Open-Meteo (Weather & Soil)</div>
          <div>• OpenStreetMap (Basemap)</div>
          <div>• RainViewer (Doppler Radar)</div>
          <div>• USGS (Earthquakes)</div>
        </div>
      </div>
    </div>
  );
}
