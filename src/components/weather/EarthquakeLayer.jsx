import React, { useEffect, useState } from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Activity, Clock, Layers, ExternalLink } from 'lucide-react';
import { getRecentEarthquakes } from '../../services/earthquakeService';
import Badge from '../common/Badge';

const createEarthquakeIcon = (mag) => {
  const isHigh = mag >= 4.5;
  const isMedium = mag >= 3.5;

  const bg = isHigh ? '#dc2626' : isMedium ? '#ea580c' : '#d97706';
  const size = isHigh ? 32 : isMedium ? 26 : 22;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: ${size}px; height: ${size}px;">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style="background-color: ${bg};"></span>
      <div class="relative flex items-center justify-center rounded-full text-white font-extrabold text-[10px] shadow-lg border border-white dark:border-slate-900" style="width: ${size}px; height: ${size}px; background-color: ${bg};">
        M${Number(mag).toFixed(1)}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-earthquake-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function EarthquakeLayer({ minMagnitude = 2.0 }) {
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getRecentEarthquakes({ minMagnitude }).then((data) => {
      if (isMounted) {
        setEarthquakeData(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [minMagnitude]);

  if (loading || !earthquakeData || !earthquakeData.events) return null;

  return (
    <>
      {earthquakeData.events.map((eq) => {
        const radius = Math.max(8000, eq.magnitude * 7000);

        return (
          <React.Fragment key={eq.id}>
            {/* Seismic wave spread radius */}
            <Circle
              center={eq.coordinates}
              radius={radius}
              pathOptions={{
                color: eq.magnitude >= 4.0 ? '#dc2626' : '#ea580c',
                fillColor: eq.magnitude >= 4.0 ? '#dc2626' : '#ea580c',
                fillOpacity: 0.12,
                weight: 1,
                dashArray: '3, 4',
              }}
            />

            {/* Earthquake Event Marker */}
            <Marker
              position={eq.coordinates}
              icon={createEarthquakeIcon(eq.magnitude)}
            >
              <Popup className="bhusachet-popup">
                <div className="p-3 max-w-xs text-slate-900 dark:text-slate-100">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                      <span>USGS Seismic Event</span>
                    </div>
                    <Badge variant={eq.magnitude >= 4.5 ? 'critical' : eq.magnitude >= 3.5 ? 'high' : 'warning'}>
                      M {Number(eq.magnitude).toFixed(1)}
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold mt-2 mb-1 leading-snug">{eq.place || eq.title}</h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px] my-2">
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Focal Depth</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{eq.depthKm} km</span>
                    </div>
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Magnitude</span>
                      <span className="font-extrabold text-rose-600 dark:text-rose-400">M {eq.magnitude}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(eq.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1.5 border-t border-slate-200 dark:border-slate-800">
                    <span>Source: USGS GeoJSON</span>
                    {eq.url && (
                      <a
                        href={eq.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                      >
                        USGS Event Details <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
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
