import React from 'react';
import { Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CloudRain, Mountain, Cpu, TrendingUp } from 'lucide-react';
import Badge from '../../common/Badge';

// Helper to create custom modern glowing DivIcon markers
const createRiskIcon = (riskLevel, probability) => {
  const colorMap = {
    CRITICAL: {
      bg: '#ef4444',
      ring: '#f87171',
      pulse: 'animate-ping',
    },
    HIGH: {
      bg: '#f97316',
      ring: '#fb923c',
      pulse: 'animate-pulse',
    },
    MEDIUM: {
      bg: '#f59e0b',
      ring: '#fbbf24',
      pulse: '',
    },
    LOW: {
      bg: '#10b981',
      ring: '#34d399',
      pulse: '',
    },
  };

  const style = colorMap[riskLevel] || colorMap.MEDIUM;

  const html = `
    <div class="relative flex items-center justify-center w-9 h-9 cursor-pointer group">
      ${
        riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
          ? `<span class="absolute inline-flex w-full h-full rounded-full opacity-75 ${style.pulse}" style="background-color: ${style.ring};"></span>`
          : ''
      }
      <div class="relative flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-[11px] shadow-lg border-2 border-slate-900 transition-transform group-hover:scale-125" style="background-color: ${style.bg};">
        ${probability}%
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-risk-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export default function RiskHeatmapLayer({ riskZones, onSelectZone }) {
  const getRadius = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return 7000;
      case 'HIGH':
        return 5500;
      case 'MEDIUM':
        return 4000;
      case 'LOW':
        return 2800;
      default:
        return 3500;
    }
  };

  const getColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f97316';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  return (
    <>
      {riskZones.map((zone) => {
        const color = getColor(zone.riskLevel);
        const radius = getRadius(zone.riskLevel);

        return (
          <React.Fragment key={zone.id}>
            {/* Heatmap intensity halo circle */}
            <Circle
              center={zone.coordinates}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: zone.riskLevel === 'CRITICAL' ? 0.28 : 0.18,
                weight: 1.5,
                dashArray: zone.riskLevel === 'CRITICAL' ? '4, 4' : undefined,
              }}
            />

            {/* Core marker */}
            <Marker
              position={zone.coordinates}
              icon={createRiskIcon(zone.riskLevel, zone.probability)}
              eventHandlers={{
                click: () => onSelectZone && onSelectZone(zone),
              }}
            >
              <Popup className="bhusachet-popup">
                <div className="p-3.5 max-w-xs text-slate-900 dark:text-slate-100">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                        {zone.state} • {zone.district}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{zone.locationName}</h4>
                    </div>
                    <Badge variant={zone.riskLevel.toLowerCase()}>{zone.riskLevel}</Badge>
                  </div>

                  {/* AI Prediction Score */}
                  <div className="my-2.5 p-2 bg-slate-100 dark:bg-slate-900/90 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                      <Cpu className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Probability</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{zone.probability}%</span>
                  </div>

                  {/* Sensor & Environmental Telemetry */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-2.5">
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px]">
                        <CloudRain className="w-3 h-3 text-sky-500" /> 24h Rainfall
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{zone.rainfall24h} mm</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px]">
                        <Mountain className="w-3 h-3 text-emerald-500" /> Slope Angle
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{zone.slopeAngle}° ({zone.slopeAspect})</span>
                    </div>
                  </div>

                  {/* Trigger & Infrastructure */}
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1 mb-2 bg-slate-100 dark:bg-slate-950/40 p-2 rounded">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Trigger Factor:</div>
                    <p className="text-slate-800 dark:text-slate-200 leading-tight">{zone.dominantTrigger}</p>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Pop. at Risk: <b className="text-slate-800 dark:text-slate-200">{zone.estimatedPopulationAtRisk.toLocaleString()}</b></span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-semibold">
                      <TrendingUp className="w-2.5 h-2.5" /> {zone.trend}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
}
