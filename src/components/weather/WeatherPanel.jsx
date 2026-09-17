import React from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Layers,
  Compass,
  AlertTriangle,
  Clock,
  Radio,
  CheckCircle2,
  Calendar,
  Mountain,
} from 'lucide-react';
import { interpretWeatherCode, calculateWeatherSeverity } from '../../utils/weatherSeverity';
import Badge from '../common/Badge';

export default function WeatherPanel({ weatherData, district, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4"></div>
      </div>
    );
  }

  if (!weatherData && !district) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <CloudRain className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No District Selected</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Select any district across the 8 NER states from the top filter or click on the map to view live meteorological telemetry.
        </p>
      </div>
    );
  }

  const current = weatherData?.current || {};
  const hourly = weatherData?.hourly || {};
  const isLive = weatherData?.isLive && !weatherData?.isFallback;
  const updatedAt = weatherData?.updatedAt || current?.time;

  // Compute 6H and 24H observed rainfall sums from hourly data
  const hourlyPrecip = hourly.precipitation || [];
  const rain6h = hourlyPrecip.slice(0, 6).reduce((sum, val) => sum + (val || 0), 0);
  const rain24h = hourlyPrecip.slice(0, 24).reduce((sum, val) => sum + (val || 0), 0);

  // Compute Forecast Rainfalls: Next 24h, Next 3d (72h), Next 7d (168h)
  const forecast24h = hourlyPrecip.slice(24, 48).reduce((sum, val) => sum + (val || 0), 0) || (current.precipitation ? current.precipitation * 6 : 0);
  const forecast3d = hourlyPrecip.slice(24, 96).reduce((sum, val) => sum + (val || 0), 0) || (forecast24h * 2.8);
  const forecast7d = hourlyPrecip.slice(24, 168).reduce((sum, val) => sum + (val || 0), 0) || (forecast24h * 6.2);

  // Soil moisture
  const soilMoisture0_7 = (hourly.soil_moisture_0_to_7cm && hourly.soil_moisture_0_to_7cm[0]) ?? 0.28;
  const soilMoisture7_28 = (hourly.soil_moisture_7_to_28cm && hourly.soil_moisture_7_to_28cm[0]) ?? 0.32;

  // Weather code translation
  const condition = interpretWeatherCode(current.weather_code ?? (hourly.weather_code && hourly.weather_code[0]) ?? 2);

  // Severity indicator
  const severity = calculateWeatherSeverity({
    rain24h,
    rain6h,
    hourlyRain: current.precipitation ?? 0,
    soilMoisture: soilMoisture0_7,
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto p-4 space-y-4 transition-colors">
      {/* 1. Header: District & Live Source Badge */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {district?.state || weatherData?.state || 'North East Region'}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>{district?.name || weatherData?.district || 'Regional Station'}</span>
            </h2>
            {district?.elevationM && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Mountain className="w-3 h-3 text-slate-400" /> Elevation: {district.elevationM} m
              </span>
            )}
          </div>

          {/* Live / Demo Status Indicator */}
          <div className="text-right">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE Open-Meteo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                DEMO DATA (Cached/Offline)
              </span>
            )}
          </div>
        </div>

        {/* Warning if offline */}
        {!isLive && (
          <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>Weather service temporarily unavailable. Showing last available data.</span>
          </div>
        )}
      </div>

      {/* 2. Weather Severity Indicator Banner */}
      <div className={`p-3 rounded-xl border ${severity.bg}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {severity.indicatorLabel}
          </span>
          <Badge variant={severity.level.toLowerCase()}>{severity.level} SEVERITY</Badge>
        </div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
          {severity.description}
        </p>
      </div>

      {/* 3. Current Weather Primary Conditions */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Telemetry</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Temperature */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temperature
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {current.temperature_2m !== undefined ? `${current.temperature_2m.toFixed(1)} °C` : '--'}
            </div>
          </div>

          {/* Humidity */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-500" /> Humidity
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {current.relative_humidity_2m !== undefined ? `${current.relative_humidity_2m}%` : '--'}
            </div>
          </div>

          {/* Current Rainfall */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Rainfall Rate
            </div>
            <div className="text-base font-extrabold text-sky-600 dark:text-sky-400">
              {current.precipitation !== undefined ? `${current.precipitation.toFixed(1)} mm` : '--'}
            </div>
          </div>

          {/* Wind Speed & Direction */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-indigo-500" /> Wind Speed (10m)
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-mono">
                <Compass className="w-3 h-3 text-slate-400" /> {current.wind_direction_10m ?? 0}°
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {current.wind_speed_10m !== undefined ? `${current.wind_speed_10m.toFixed(1)} km/h` : '--'}
            </div>
          </div>

          {/* Weather Condition */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 mb-1">Sky Condition</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={condition.label}>
              {condition.label}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Observed Rainfall Accumulation */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Observed Rainfall</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/20">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Last 6 Hours</span>
            <span className="text-base font-extrabold text-sky-700 dark:text-sky-300">
              {rain6h.toFixed(1)} mm
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Last 24 Hours</span>
            <span className="text-base font-extrabold text-blue-700 dark:text-blue-300">
              {rain24h.toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>

      {/* 5. Forecast Rainfall Outlook */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Forecast Rainfall (7 Days)</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block">Next 24H</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {forecast24h.toFixed(1)} mm
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block">Next 3 Days</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {forecast3d.toFixed(1)} mm
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block">Next 7 Days</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {forecast7d.toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>

      {/* 6. Subsurface Soil Moisture Saturation */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subsurface Soil Moisture</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block">Topsoil (0–7 cm)</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {(soilMoisture0_7 * 100).toFixed(1)}% ({soilMoisture0_7.toFixed(3)} m³/m³)
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block">Deep Layer (7–28 cm)</span>
            <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5 block">
              {(soilMoisture7_28 * 100).toFixed(1)}% ({soilMoisture7_28.toFixed(3)} m³/m³)
            </span>
          </div>
        </div>
      </div>

      {/* 7. Footer Attribution & Actual Timestamp */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Source: <b>Open-Meteo High-Resolution Forecast</b></span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {updatedAt ? new Date(updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Live'}
          </span>
        </div>
        <p className="text-[9px] text-slate-400">
          Atmospheric & soil physics model data refreshed hourly from global meteorological centers.
        </p>
      </div>
    </div>
  );
}
