import React, { useMemo } from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Video, CheckCircle2, XCircle, Clock, MapPin, Layers } from 'lucide-react';
import Badge from '../../common/Badge';

// Helper to create individual report marker
const createReportIcon = (severity, status) => {
  const isPending = status === 'PENDING';
  const isVerified = status === 'VERIFIED';

  const borderColor = isVerified ? '#10b981' : isPending ? '#f59e0b' : '#64748b';
  const bgColor = severity === 'CRITICAL' ? '#ef4444' : severity === 'HIGH' ? '#f97316' : '#3b82f6';

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
      ${
        isPending
          ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>'
          : ''
      }
      <div class="relative flex items-center justify-center w-7 h-7 rounded-full text-white shadow-xl border-2 transition-transform group-hover:scale-125" 
           style="background-color: ${bgColor}; border-color: ${borderColor};">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
          <circle cx="12" cy="13" r="3"></circle>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-report-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Helper to create cluster marker
const createClusterIcon = (count, hasCritical) => {
  const bgColor = hasCritical ? '#ef4444' : '#f59e0b';
  const ringColor = hasCritical ? '#fca5a5' : '#fde68a';

  const html = `
    <div class="relative flex items-center justify-center w-10 h-10 cursor-pointer group">
      <span class="animate-pulse absolute inline-flex w-full h-full rounded-full opacity-60" style="background-color: ${ringColor};"></span>
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full text-slate-950 font-extrabold text-xs shadow-xl border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-125" style="background-color: ${bgColor};">
        ${count}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-cluster-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default function CitizenReportsLayer({
  reports,
  onVerifyReport,
  onRejectReport,
  onSelectReport,
}) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = React.useState(map.getZoom());

  useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
    },
  });

  // Simple and fast proximity clustering
  const clusteredData = useMemo(() => {
    // Cluster threshold in degrees (smaller at higher zoom)
    const clusterDistanceThreshold = currentZoom <= 8 ? 0.35 : currentZoom <= 10 ? 0.15 : 0.04;

    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < reports.length; i++) {
      if (visited.has(reports[i].id)) continue;

      const group = [reports[i]];
      visited.add(reports[i].id);

      for (let j = i + 1; j < reports.length; j++) {
        if (visited.has(reports[j].id)) continue;

        const dist = Math.hypot(
          reports[i].coordinates[0] - reports[j].coordinates[0],
          reports[i].coordinates[1] - reports[j].coordinates[1]
        );

        if (dist < clusterDistanceThreshold) {
          group.push(reports[j]);
          visited.add(reports[j].id);
        }
      }

      if (group.length > 1 && currentZoom < 11) {
        // Average coordinates for cluster centroid
        const avgLat = group.reduce((acc, r) => acc + r.coordinates[0], 0) / group.length;
        const avgLng = group.reduce((acc, r) => acc + r.coordinates[1], 0) / group.length;
        const hasCritical = group.some((r) => r.severity === 'CRITICAL');

        clusters.push({
          isCluster: true,
          id: `cluster-${reports[i].id}`,
          count: group.length,
          coordinates: [avgLat, avgLng],
          reports: group,
          hasCritical,
        });
      } else {
        group.forEach((item) => {
          clusters.push({
            isCluster: false,
            id: item.id,
            data: item,
          });
        });
      }
    }

    return clusters;
  }, [reports, currentZoom]);

  return (
    <>
      {clusteredData.map((item) => {
        if (item.isCluster) {
          return (
            <Marker
              key={item.id}
              position={item.coordinates}
              icon={createClusterIcon(item.count, item.hasCritical)}
              eventHandlers={{
                click: () => {
                  map.flyTo(item.coordinates, currentZoom + 2, { duration: 0.8 });
                },
              }}
            >
              <Popup className="bhusachet-popup">
                <div className="p-3 max-w-xs text-slate-900 dark:text-slate-100">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <Layers className="w-4 h-4" />
                      <span>Cluster: {item.count} Reports</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Click to zoom in</span>
                  </div>
                  <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
                    {item.reports.map((r) => (
                      <div
                        key={r.id}
                        className="p-1.5 rounded bg-slate-100 dark:bg-slate-900 text-xs border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span className="truncate pr-2 font-medium">{r.locationName}</span>
                        <Badge variant={r.severity.toLowerCase()} size="sm">
                          {r.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        }

        const report = item.data;
        return (
          <Marker
            key={report.id}
            position={report.coordinates}
            icon={createReportIcon(report.severity, report.status)}
            eventHandlers={{
              click: () => onSelectReport && onSelectReport(report),
            }}
          >
            <Popup className="bhusachet-popup">
              <div className="p-3.5 max-w-sm text-slate-900 dark:text-slate-100">
                {/* Photo Banner if Available */}
                {report.hasPhoto && (
                  <div className="relative -mx-3.5 -mt-3.5 mb-3 h-32 overflow-hidden rounded-t-xl bg-slate-200 dark:bg-slate-900">
                    <img
                      src={report.photoUrl}
                      alt="Report Evidence"
                      className="w-full h-full object-cover brightness-95 dark:brightness-90 hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge variant={report.severity.toLowerCase()}>{report.severity}</Badge>
                      <Badge
                        variant={
                          report.status === 'VERIFIED'
                            ? 'low'
                            : report.status === 'PENDING'
                            ? 'medium'
                            : 'neutral'
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                    {report.hasVideo && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/75 backdrop-blur-sm rounded text-[10px] text-white flex items-center gap-1 font-medium">
                        <Video className="w-3 h-3 text-red-400" /> Video attached
                      </div>
                    )}
                  </div>
                )}

                {/* Title & Reporter info */}
                <div className="mb-2">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">
                    {report.state} • {report.district}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {report.category}
                  </h4>
                  <div className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1 mt-0.5 font-medium">
                    <Clock className="w-3 h-3" /> {report.timestamp} • {report.locationName}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 mb-2 leading-relaxed">
                  "{report.description}"
                </p>

                {/* AI Precheck Insight */}
                <div className="text-[11px] p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 rounded-lg mb-3 flex items-center justify-between">
                  <span className="text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">
                    AI Vision Pre-check:
                  </span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 text-[10px]">
                    {report.aiPreCheck}
                  </span>
                </div>

                {/* Action Buttons for Admin Verification */}
                {report.status === 'PENDING' ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onVerifyReport && onVerifyReport(report.id)}
                      className="flex-1 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Verify &
                      Dispatch
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectReport && onRejectReport(report.id)}
                      className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-center py-1 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 rounded font-medium">
                    Status: <b className="text-slate-900 dark:text-slate-200">{report.status}</b> by SDMA Operations
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
