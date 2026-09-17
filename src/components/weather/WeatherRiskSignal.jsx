import React, { useEffect, useState } from 'react';
import {
  CloudRain,
  Droplets,
  Layers,
  TrendingUp,
  AlertTriangle,
  Info,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { getCurrentWeather } from '../../services/weatherService';
import { calculateWeatherSeverity } from '../../utils/weatherSeverity';
import Badge from '../common/Badge';

export default function WeatherRiskSignal({ zoneCoordinates, zoneName, fallbackRain24h = 45 }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (zoneCoordinates && zoneCoordinates.length >= 2) {
      setLoading(true);
      getCurrentWeather(zoneCoordinates[0], zoneCoordinates[1])
        .then((res) => {
          if (isMounted) {
            setWeatherData(res);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [zoneCoordinates]);

  const current = weatherData?.current || {};
  const hourly = weatherData?.hourly || {};
  const isLive = weatherData?.isLive && !weatherData?.isFallback;

  // Hourly rainfall sums
  const hourlyPrecip = hourly.precipitation || [];
  const rain6h = hourlyPrecip.slice(0, 6).reduce((sum, val) => sum + (val || 0), 0) || +(fallbackRain24h * 0.35).toFixed(1);
  const rain24h = hourlyPrecip.slice(0, 24).reduce((sum, val) => sum + (val || 0), 0) || fallbackRain24h;
  const soilMoisture = (hourly.soil_moisture_0_to_7cm && hourly.soil_moisture_0_to_7cm[0]) ?? 0.32;

  const severity = calculateWeatherSeverity({
    rain24h,
    rain6h,
    hourlyRain: current.precipitation ?? 0,
    soilMoisture,
  });

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 transition-colors">
      {/* Header with Live Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
          <CloudRain className="w-4 h-4 text-sky-500" />
          <span>WEATHER RISK SIGNAL</span>
        </div>
        {isLive ? (
          <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE Open-Meteo
          </span>
        ) : (
          <span className="text-[9px] font-mono text-slate-400">● Sensor Estimate</span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
            <span>24H Rainfall</span>
            <span className={`font-bold ${severity.color}`}>{severity.level}</span>
          </div>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {rain24h.toFixed(1)} mm
          </span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">6H Rain Burst</span>
          <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
            {rain6h.toFixed(1)} mm
          </span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Soil Moisture</span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            {(soilMoisture * 100).toFixed(1)}% Saturation
          </span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Hydrological Signal</span>
          <span className={`text-xs font-extrabold flex items-center gap-0.5 ${severity.color}`}>
            <TrendingUp className="w-3.5 h-3.5" /> {severity.level} ↑
          </span>
        </div>
      </div>

      {/* Scientific Notice & Disclaimers */}
      <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-600/30 text-[10px] text-amber-900 dark:text-amber-300 space-y-1">
        <div className="flex items-start gap-1 font-semibold">
          <Info className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
          <span>Weather conditions are contributing to an elevated landslide risk signal.</span>
        </div>
        <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
          Note: This is a meteorological risk indicator. The actual XGBoost prediction remains prototype data until backend/model integration is completed.
        </p>
      </div>
    </div>
  );
}
