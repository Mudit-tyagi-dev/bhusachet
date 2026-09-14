import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';

export default function DistrictBoundariesLayer({ districts, onSelectDistrict }) {
  const getBoundaryColor = (riskLevel) => {
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
        return '#64748b';
    }
  };

  return (
    <>
      {districts.map((district) => {
        const color = getBoundaryColor(district.riskLevel);

        return (
          <Polygon
            key={district.id}
            positions={district.polygon}
            pathOptions={{
              color: color,
              weight: 1.8,
              dashArray: '4, 6',
              fillColor: color,
              fillOpacity: 0.08,
            }}
            eventHandlers={{
              click: () => onSelectDistrict && onSelectDistrict(district),
            }}
          >
            <Tooltip sticky className="custom-district-tooltip">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 bg-white/95 dark:bg-slate-900/90 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-md">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{district.state}</span>
                {district.name} • <span style={{ color }}>{district.riskLevel}</span>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}
