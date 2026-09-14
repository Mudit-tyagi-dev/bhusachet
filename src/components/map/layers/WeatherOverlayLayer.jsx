import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import { CloudRain, Radio, AlertCircle } from 'lucide-react';
import Badge from '../../common/Badge';

export default function WeatherOverlayLayer({ weatherCells }) {
  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'EXTREME':
        return '#8b5cf6'; // Violet / extreme radar
      case 'HEAVY':
        return '#0284c7'; // Deep blue
      case 'MODERATE':
        return '#06b6d4'; // Cyan
      case 'LIGHT':
        return '#14b8a6'; // Teal
      default:
        return '#38bdf8';
    }
  };

  return (
    <>
      {weatherCells.map((cell) => {
        const color = getIntensityColor(cell.intensity);

        return (
          <React.Fragment key={cell.id}>
            {/* Outer radar precipitation band */}
            <Circle
              center={cell.center}
              radius={cell.radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.22,
                weight: 1.5,
              }}
            >
              <Popup className="bhusachet-popup">
                <div className="p-3 max-w-xs text-slate-900 dark:text-slate-100">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300">
                      <Radio className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                      <span>IMD Doppler Radar Cell</span>
                    </div>
                    <Badge variant="info">{cell.intensity}</Badge>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-2 mb-1">{cell.name}</h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px] my-2">
                    <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Rainfall Rate</span>
                      <span className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-sky-500" /> {cell.rainfallRate}
                      </span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Reflectivity</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{cell.radarReflectivity}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded border border-amber-200 dark:border-amber-500/20 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{cell.warning}</span>
                  </div>
                </div>
              </Popup>
            </Circle>
          </React.Fragment>
        );
      })}
    </>
  );
}
