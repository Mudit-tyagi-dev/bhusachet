import React from 'react';
import { Circle, Popup, Tooltip } from 'react-leaflet';
import { Thermometer, Layers, Wind } from 'lucide-react';
import { getScalarColor } from '../../utils/weatherGrid';

export default function WeatherScalarLayer({ gridData = [], displayMode = 'temperature', onSelectPoint }) {
  if (!gridData || gridData.length === 0) return null;

  const getMetricInfo = (pt) => {
    switch (displayMode) {
      case 'temperature':
        return {
          value: pt.temperature ?? 22.0,
          unit: '°C',
          label: 'Temperature',
          icon: Thermometer,
          color: getScalarColor('temperature', pt.temperature ?? 22.0),
        };
      case 'soil':
        return {
          value: pt.soilMoisture ?? 0.28,
          unit: 'm³/m³',
          label: 'Topsoil Moisture (0-7cm)',
          icon: Layers,
          color: getScalarColor('soil', pt.soilMoisture ?? 0.28),
        };
      case 'wind':
        return {
          value: pt.windSpeed ?? 10.0,
          unit: 'km/h',
          label: 'Wind Speed (10m)',
          icon: Wind,
          color: getScalarColor('wind', pt.windSpeed ?? 10.0),
        };
      default:
        return {
          value: pt.temperature ?? 22.0,
          unit: '°C',
          label: 'Temperature',
          icon: Thermometer,
          color: 'rgba(59, 130, 246, 0.5)',
        };
    }
  };

  return (
    <>
      {gridData.map((pt) => {
        const metric = getMetricInfo(pt);
        const Icon = metric.icon;

        return (
          <Circle
            key={`scalar-${displayMode}-${pt.id || `${pt.lat}-${pt.lon}`}`}
            center={[pt.lat, pt.lon]}
            radius={24000}
            pathOptions={{
              color: metric.color,
              fillColor: metric.color,
              fillOpacity: 0.5,
              weight: 1,
            }}
            eventHandlers={{
              click: () => onSelectPoint && onSelectPoint(pt),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              <div className="text-xs font-mono text-slate-900 dark:text-white bg-white/95 dark:bg-slate-950/95 px-2 py-1 rounded shadow-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold">{pt.name || `${pt.lat.toFixed(2)}°N, ${pt.lon.toFixed(2)}°E`}</span>
                <div className="flex items-center gap-1 mt-0.5 font-bold" style={{ color: metric.color }}>
                  <Icon className="w-3 h-3" />
                  <span>{metric.label}: {metric.value} {metric.unit}</span>
                </div>
              </div>
            </Tooltip>
            <Popup className="bhusachet-popup">
              <div className="p-3 max-w-xs text-slate-900 dark:text-slate-100">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{pt.state || 'NER Grid Node'}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">
                    Open-Meteo
                  </span>
                </div>
                <h4 className="text-sm font-bold mt-1.5 mb-1">{pt.name || `Grid [${pt.lat.toFixed(2)}, ${pt.lon.toFixed(2)}]`}</h4>
                <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-900 my-2">
                  <span className="text-[10px] text-slate-500 block">{metric.label}</span>
                  <span className="text-base font-extrabold flex items-center gap-1.5 mt-0.5 text-slate-900 dark:text-white">
                    <Icon className="w-4 h-4 text-amber-500" />
                    {metric.value} {metric.unit}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Lat: {pt.lat.toFixed(2)}°, Lon: {pt.lon.toFixed(2)}°</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Live Sensor Mesh</span>
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </>
  );
}
