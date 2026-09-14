import React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { Navigation, Clock, Route } from 'lucide-react';
import Badge from '../../common/Badge';

export default function RoadStatusLayer({ roads, onSelectRoad }) {
  const getRoadColor = (status) => {
    switch (status) {
      case 'blocked':
        return '#ef4444'; // Red
      case 'at-risk':
        return '#f59e0b'; // Amber
      case 'safe':
        return '#10b981'; // Green
      default:
        return '#64748b';
    }
  };

  const getDashArray = (status) => {
    switch (status) {
      case 'blocked':
        return '6, 6';
      case 'at-risk':
        return '8, 4';
      default:
        return undefined;
    }
  };

  return (
    <>
      {roads.map((road) => {
        const color = getRoadColor(road.status);
        const dashArray = getDashArray(road.status);

        return (
          <React.Fragment key={road.id}>
            {/* Wider subtle glow stroke underlay for high visibility */}
            <Polyline
              positions={road.coordinates}
              pathOptions={{
                color: color,
                weight: road.status === 'blocked' ? 10 : 8,
                opacity: 0.25,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />

            {/* Core road line */}
            <Polyline
              positions={road.coordinates}
              pathOptions={{
                color: color,
                weight: road.status === 'blocked' ? 4.5 : 3.5,
                opacity: 0.95,
                dashArray: dashArray,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => onSelectRoad && onSelectRoad(road),
              }}
            >
              <Popup className="bhusachet-popup">
                <div className="p-3.5 max-w-xs text-slate-900 dark:text-slate-100">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        <Route className="w-3 h-3 text-amber-500" />
                        <span>{road.state} • {road.district}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{road.name}</h4>
                    </div>
                    <Badge variant={road.status}>{road.status}</Badge>
                  </div>

                  {/* Status Reason */}
                  <div className="my-2.5 p-2 bg-slate-100 dark:bg-slate-900/90 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Condition Report:</div>
                    <p className="text-slate-800 dark:text-slate-200 leading-snug">{road.statusReason}</p>
                  </div>

                  {/* Alternate Route Detour if Blocked */}
                  {road.alternateRoute && (
                    <div className="text-[11px] p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 rounded-lg mb-2">
                      <div className="flex items-center gap-1 text-amber-800 dark:text-amber-400 font-semibold text-[10px] mb-0.5">
                        <Navigation className="w-3 h-3" /> Alternate Detour:
                      </div>
                      <p className="text-amber-900/90 dark:text-amber-200/90 text-[11px] leading-tight">{road.alternateRoute}</p>
                    </div>
                  )}

                  {/* Agency & ETA */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block">Clearing Unit:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-300">{road.clearingAgency}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block">Clearance ETA:</span>
                      <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {road.estimatedClearanceTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Polyline>
          </React.Fragment>
        );
      })}
    </>
  );
}
