import React, { useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import RainfallHeatmapLayer from './RainfallHeatmapLayer';
import WeatherScalarLayer from './WeatherScalarLayer';
import RadarLayer from './RadarLayer';
import EarthquakeLayer from './EarthquakeLayer';
import NerDistrictLayer from './NerDistrictLayer';
import { useTheme } from '../../context/ThemeContext';
import { NER_BOUNDS } from '../../data/districts/nerDistricts';

// Sub-component to manage viewport transitions and resize recalculations
function WeatherMapController({ center, zoom }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (center && zoom) {
      if (isFirstRender.current) {
        map.setView(center, zoom);
        isFirstRender.current = false;
      } else {
        map.flyTo(center, zoom, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      }
    }
  }, [center, zoom, map]);

  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function WeatherMap({
  center = NER_BOUNDS.center,
  zoom = NER_BOUNDS.defaultZoom,
  displayMode = 'rainfall',
  timePeriod = '24h',
  gridData = [],
  districts = [],
  selectedDistrictId = null,
  onSelectDistrict,
  showEarthquakes = true,
  showDistricts = true,
}) {
  const { isDark } = useTheme();

  return (
    <div
      className={`relative w-full h-full min-h-[320px] overflow-hidden ${
        isDark ? 'bg-slate-950 dark dark-tile-filter' : 'bg-slate-100 light'
      }`}
    >
      <LeafletMap
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full min-h-full z-0"
      >
        <WeatherMapController center={center} zoom={zoom} />

        {/* Standard Free OpenStreetMap Public Raster Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {/* 1. Rainfall Heatmap Layer */}
        {displayMode === 'rainfall' && (
          <RainfallHeatmapLayer
            gridData={gridData}
            timePeriod={timePeriod}
            onSelectPoint={(pt) => {
              const matched = districts.find(
                (d) => Math.abs(d.latitude - pt.lat) < 0.3 && Math.abs(d.longitude - pt.lon) < 0.3
              );
              if (matched && onSelectDistrict) onSelectDistrict(matched);
            }}
          />
        )}

        {/* 2. Temperature / Soil Moisture / Wind Scalar Layers */}
        {(displayMode === 'temperature' || displayMode === 'soil' || displayMode === 'wind') && (
          <WeatherScalarLayer
            gridData={gridData}
            displayMode={displayMode}
            onSelectPoint={(pt) => {
              const matched = districts.find(
                (d) => Math.abs(d.latitude - pt.lat) < 0.3 && Math.abs(d.longitude - pt.lon) < 0.3
              );
              if (matched && onSelectDistrict) onSelectDistrict(matched);
            }}
          />
        )}

        {/* 3. RainViewer Live Doppler Radar Layer */}
        {displayMode === 'radar' && <RadarLayer opacity={0.78} />}

        {/* 4. NER 8-State Districts Layer */}
        {showDistricts && (
          <NerDistrictLayer
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={onSelectDistrict}
          />
        )}

        {/* 5. USGS Earthquakes Layer */}
        {showEarthquakes && <EarthquakeLayer minMagnitude={2.0} />}
      </LeafletMap>

      {/* Dynamic Layer Legend in bottom-left */}
      <div className="absolute bottom-3 left-3 z-[900] pointer-events-none hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 shadow-md font-mono">
        {displayMode === 'rainfall' && (
          <>
            <span className="font-bold text-slate-500">Rainfall Scale:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Extreme &gt;120mm</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Heavy &gt;60mm</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate &gt;25mm</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Light &gt;5mm</span>
          </>
        )}
        {displayMode === 'temperature' && (
          <>
            <span className="font-bold text-slate-500">Temp Scale:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> &gt;35°C</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 20-35°C</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> &lt;20°C</span>
          </>
        )}
        {displayMode === 'soil' && (
          <>
            <span className="font-bold text-slate-500">Soil Saturation:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Saturated (&gt;38%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Optimal (20-38%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Dry (&lt;20%)</span>
          </>
        )}
        {displayMode === 'radar' && (
          <>
            <span className="font-bold text-slate-500">RainViewer Radar:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span> Reflectivity dBZ</span>
          </>
        )}
        {displayMode === 'wind' && (
          <>
            <span className="font-bold text-slate-500">Wind Velocity:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Gale (&gt;50 km/h)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Moderate (15-50)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Light (&lt;15)</span>
          </>
        )}
      </div>
    </div>
  );
}
