import React from 'react';
import { CircleMarker, Tooltip, Popup } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { NER_DISTRICTS } from '../../data/districts/nerDistricts';

export default function NerDistrictLayer({ districts = NER_DISTRICTS, selectedDistrictId, onSelectDistrict }) {
  return (
    <>
      {districts.map((district) => {
        const isSelected = selectedDistrictId === district.id;

        return (
          <CircleMarker
            key={district.id}
            center={[district.latitude, district.longitude]}
            radius={isSelected ? 8 : 4.5}
            pathOptions={{
              color: isSelected ? '#f59e0b' : '#3b82f6',
              fillColor: isSelected ? '#f59e0b' : '#60a5fa',
              fillOpacity: isSelected ? 0.9 : 0.6,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{
              click: () => onSelectDistrict && onSelectDistrict(district),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
              <div className="text-xs font-semibold text-slate-900 dark:text-white bg-white/95 dark:bg-slate-900/95 px-2 py-0.5 rounded shadow border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">{district.state}</span>
                {district.name}
              </div>
            </Tooltip>

            <Popup className="bhusachet-popup">
              <div className="p-2.5 max-w-xs text-slate-900 dark:text-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{district.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 mb-2">
                  <span>State: <b>{district.state}</b></span>
                  {district.elevationM && <span> • Elev: <b>{district.elevationM}m</b></span>}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectDistrict && onSelectDistrict(district)}
                  className="w-full py-1 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Navigation className="w-3 h-3" /> Select for Weather Intelligence
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
