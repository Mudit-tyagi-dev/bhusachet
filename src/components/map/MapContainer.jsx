import React, { useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import FilterPanel from './FilterPanel';
import StateSelector from './StateSelector';
import RiskHeatmapLayer from './layers/RiskHeatmapLayer';
import RoadStatusLayer from './layers/RoadStatusLayer';
import CitizenReportsLayer from './layers/CitizenReportsLayer';
import DistrictBoundariesLayer from './layers/DistrictBoundariesLayer';
import WeatherOverlayLayer from './layers/WeatherOverlayLayer';
import { useTheme } from '../../context/ThemeContext';

// Sub-component to handle map centering, zooming, and robust size invalidation
function MapViewController({ center, zoom, sidebarCollapsed, panelOpen }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  // Smoothly flyTo on coordinates or zoom change
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

  // Force map size recalculation on sidebar / drawer transitions and window resize
  useEffect(() => {
    // Immediate check
    map.invalidateSize();

    // After animation transitions finish
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 80);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 320);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [sidebarCollapsed, panelOpen, map]);

  // Attach a ResizeObserver to the Leaflet map container to detect ANY layout changes
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(container);

    // Initial mount invalidation
    const initialTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(initialTimer);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

export default function MapContainer({
  layers,
  onToggleLayer,
  activeRegion,
  onSelectRegion,
  riskZones,
  roads,
  reports,
  districts,
  weatherCells,
  onVerifyReport,
  onRejectReport,
  onSelectFeature,
  mapCenter,
  mapZoom,
  sidebarCollapsed,
  panelOpen,
}) {
  const { isDark } = useTheme();

  return (
    <div
      className={`relative w-full h-full min-h-full flex-1 overflow-hidden ${
        isDark ? 'bg-slate-950 dark dark-tile-filter' : 'bg-slate-100 light'
      }`}
    >
      {/* Floating Map Filter Panel (Top Left) */}
      <FilterPanel
        layers={layers}
        onToggleLayer={onToggleLayer}
        activeCounts={{
          riskZones: riskZones.length,
          roads: roads.length,
          reports: reports.length,
          districts: districts.length,
          weather: weatherCells.length,
        }}
      />

      {/* Floating State Selector (Top Right) */}
      <StateSelector activeState={activeRegion} onSelectState={onSelectRegion} />

      {/* Main Interactive Leaflet Map */}
      <LeafletMap
        center={mapCenter || [26.3, 90.5]}
        zoom={mapZoom || 7.5}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full min-h-full z-0"
      >
        <MapViewController
          center={mapCenter || [26.3, 90.5]}
          zoom={mapZoom || 7.5}
          sidebarCollapsed={sidebarCollapsed}
          panelOpen={panelOpen}
        />

        {/* Standard Free OpenStreetMap Public Raster Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Dynamic Data Layers */}
        {layers.boundaries && (
          <DistrictBoundariesLayer districts={districts} onSelectDistrict={onSelectFeature} />
        )}

        {layers.weather && (
          <WeatherOverlayLayer weatherCells={weatherCells} />
        )}

        {layers.roads && (
          <RoadStatusLayer roads={roads} onSelectRoad={onSelectFeature} />
        )}

        {layers.heatmap && (
          <RiskHeatmapLayer riskZones={riskZones} onSelectZone={onSelectFeature} />
        )}

        {layers.reports && (
          <CitizenReportsLayer
            reports={reports}
            onVerifyReport={onVerifyReport}
            onRejectReport={onRejectReport}
            onSelectReport={onSelectFeature}
          />
        )}
      </LeafletMap>

      {/* Map Legend in bottom-left */}
      <div className="absolute bottom-4 left-4 z-[990] pointer-events-none hidden md:flex items-center gap-3 px-3 py-1.5 glass-panel rounded-lg text-[10px] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/50 bg-white/90 dark:bg-slate-950/80 shadow-md">
        <span className="font-semibold text-slate-500 dark:text-slate-400">Risk Scale:</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low / Safe</span>
      </div>
    </div>
  );
}
