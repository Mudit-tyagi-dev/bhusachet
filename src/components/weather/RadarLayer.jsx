import React, { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { getLiveRadarMetadata } from '../../services/radarService';
import { Radio, AlertTriangle } from 'lucide-react';

export default function RadarLayer({ opacity = 0.75 }) {
  const [radarMeta, setRadarMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getLiveRadarMetadata().then((data) => {
      if (isMounted) {
        setRadarMeta(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return null;

  if (!radarMeta || !radarMeta.isAvailable || !radarMeta.tileUrlTemplate) {
    return (
      <div className="leaflet-top leaflet-right !top-20 !right-4 z-[999] pointer-events-none">
        <div className="bg-rose-950/90 text-rose-200 border border-rose-700/80 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>RADAR UNAVAILABLE (RainViewer)</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <TileLayer
        url={radarMeta.tileUrlTemplate}
        attribution='&copy; <a href="https://www.rainviewer.com/" target="_blank" rel="noreferrer">RainViewer</a>'
        opacity={opacity}
        maxZoom={18}
        zIndex={400}
      />
      {/* Radar Timestamp overlay badge */}
      <div className="leaflet-bottom leaflet-right !bottom-12 !right-4 z-[900] pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/85 text-slate-200 border border-slate-700 text-[10px] rounded-lg shadow-lg font-mono">
        <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
        <span>RainViewer Doppler Radar: {new Date(radarMeta.latestFrameTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </>
  );
}
