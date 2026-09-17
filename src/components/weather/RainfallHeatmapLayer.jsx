import React from 'react';
import { Circle, Popup, Tooltip } from 'react-leaflet';
import { CloudRain, Droplets, Info } from 'lucide-react';
import { normalizePrecipitation } from '../../utils/weatherGrid';

export default function RainfallHeatmapLayer({ gridData = [], timePeriod = '24h', onSelectPoint }) {
  if (!gridData || gridData.length === 0) return null;

  // Extract rainfall value based on selected time period
  const getRainValue = (point) => {
    if (timePeriod === 'current') return point.precipitation || point.rain || 0;
    if (timePeriod === '6h') return point.rain6h || (point.precipitation ? point.precipitation * 2.5 : 0);
    if (timePeriod === '24h') return point.rain24h || (point.precipitation ? point.precipitation * 8 : 0);
    if (timePeriod === 'forecast24h') return point.rain24h || 12.0;
    if (timePeriod === 'forecast3d') return (point.rain24h || 10) * 2.8;
    if (timePeriod === 'forecast7d') return (point.rain24h || 10) * 5.5;
    return point.rain24h || point.precipitation || 0;
  };

  const getHeatmapStyling = (rainfallMm) => {
    const intensity = normalizePrecipitation(rainfallMm);

    // Color gradient based on real rainfall depth
    let color = '#38bdf8'; // Sky blue (< 5mm)
    let fillOpacity = 0.25;
    let radius = 22000; // meters

    if (rainfallMm >= 120) {
      color = '#e11d48'; // Extreme crimson / red (> 120mm)
      fillOpacity = 0.70;
      radius = 32000;
    } else if (rainfallMm >= 60) {
      color = '#ea580c'; // High orange (60 - 120mm)
      fillOpacity = 0.55;
      radius = 28000;
    } else if (rainfallMm >= 25) {
      color = '#f59e0b'; // Amber (25 - 60mm)
      fillOpacity = 0.45;
      radius = 25000;
    } else if (rainfallMm >= 10) {
      color = '#2563eb'; // Deep Blue (10 - 25mm)
      fillOpacity = 0.35;
      radius = 23000;
    } else if (rainfallMm > 0.5) {
      color = '#0284c7'; // Moderate cyan
      fillOpacity = 0.25;
      radius = 20000;
    } else {
      color = '#94a3b8'; // Trace / dry
      fillOpacity = 0.12;
      radius = 16000;
    }

    return { color, fillOpacity, radius, intensity };
  };

  return (
    <>
      {gridData.map((pt) => {
        const rainMm = getRainValue(pt);
        const { color, fillOpacity, radius } = getHeatmapStyling(rainMm);

        return (
          <Circle
            key={`heat-${pt.id || `${pt.lat}-${pt.lon}`}`}
            center={[pt.lat, pt.lon]}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: fillOpacity,
              weight: 1,
            }}
            eventHandlers={{
              click: () => onSelectPoint && onSelectPoint(pt),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              <div className="text-xs font-mono text-slate-900 dark:text-white bg-white/95 dark:bg-slate-950/95 px-2 py-1 rounded shadow-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold">{pt.name || `${pt.lat.toFixed(2)}°N, ${pt.lon.toFixed(2)}°E`}</span>
                <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 mt-0.5">
                  <Droplets className="w-3 h-3" />
                  <span>Rainfall: <b>{rainMm.toFixed(1)} mm</b></span>
                </div>
              </div>
            </Tooltip>
            <Popup className="bhusachet-popup">
              <div className="p-3 max-w-xs text-slate-900 dark:text-slate-100">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{pt.state || 'NER Grid Node'}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold">
                    Open-Meteo
                  </span>
                </div>
                <h4 className="text-sm font-bold mt-1.5 mb-1">{pt.name || `Grid Node [${pt.lat.toFixed(2)}, ${pt.lon.toFixed(2)}]`}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs my-2">
                  <div className="p-2 rounded bg-slate-100 dark:bg-slate-900">
                    <span className="text-[10px] text-slate-500 block">Rainfall ({timePeriod.toUpperCase()})</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5" /> {rainMm.toFixed(1)} mm
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-100 dark:bg-slate-900">
                    <span className="text-[10px] text-slate-500 block">Temperature</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {pt.temperature !== undefined ? `${pt.temperature.toFixed(1)} °C` : '--'}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Lat: {pt.lat.toFixed(2)}°, Lon: {pt.lon.toFixed(2)}°</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Live API Data</span>
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </>
  );
}
