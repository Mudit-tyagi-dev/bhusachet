import React, { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import MapContainer from '../map/MapContainer';
import PredictionPanel from '../prediction/PredictionPanel';
import ReportsPanel from '../reports/ReportsPanel';
import RoadsPanel from '../roads/RoadsPanel';
import AlertsPanel from '../alerts/AlertsPanel';
import EmergencyPriorityQueue from '../emergency/EmergencyPriorityQueue';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import { useMapLayers } from '../../hooks/useMapLayers';
import { useRefreshData } from '../../hooks/useRefreshData';
import { MOCK_RISK_ZONES } from '../../data/mockRiskZones';
import { MOCK_ROADS } from '../../data/mockRoads';
import { MOCK_REPORTS } from '../../data/mockReports';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { MOCK_DISTRICTS } from '../../data/mockDistricts';
import { MOCK_WEATHER_CELLS } from '../../data/mockWeather';
import { ChevronRight, X, PanelLeftOpen } from 'lucide-react';

export default function Shell() {
  // Sidebar and UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('prediction'); // 'prediction' | 'reports' | 'roads' | 'alerts' | 'emergency' | 'mapOnly'
  const [panelOpen, setPanelOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Map state and layers
  const {
    layers,
    toggleLayer,
    setLayerActive,
    activeRegion,
    setActiveRegion,
    selectedFeature,
    setSelectedFeature,
  } = useMapLayers();

  // Initial center: Midpoint between Sikkim and Meghalaya [26.3, 90.5]
  const [mapCenter, setMapCenter] = useState([26.3, 90.5]);
  const [mapZoom, setMapZoom] = useState(7.5);

  // Data states with mock mutation capability (verify/reject reports, etc.)
  const [riskZones, setRiskZones] = useState(MOCK_RISK_ZONES);
  const [roads, setRoads] = useState(MOCK_ROADS);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  // Refresh data hook
  const { isRefreshing, timeAgoText, triggerRefresh } = useRefreshData(() => {
    setRiskZones((prev) =>
      prev.map((z) => ({
        ...z,
        rainfall24h: +(z.rainfall24h + (Math.random() * 2 - 1)).toFixed(1),
      }))
    );
  });

  // When a sidebar tab is selected, activate relevant map layer and open panel
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setPanelOpen(true);

    if (tabId === 'prediction') {
      setLayerActive('heatmap', true);
    } else if (tabId === 'reports') {
      setLayerActive('reports', true);
    } else if (tabId === 'roads') {
      setLayerActive('roads', true);
    } else if (tabId === 'emergency') {
      setLayerActive('heatmap', true);
      setLayerActive('roads', true);
    }
  };

  // State / Region selector zoom handler
  const handleSelectRegion = (regionId, coords, zoom) => {
    setActiveRegion(regionId);
    setMapCenter(coords);
    setMapZoom(zoom);
  };

  // Focus a specific feature on map
  const handleFocusFeature = (feature) => {
    if (feature.coordinates) {
      if (Array.isArray(feature.coordinates[0])) {
        // Line or polygon: pick center
        const midIndex = Math.floor(feature.coordinates.length / 2);
        setMapCenter(feature.coordinates[midIndex]);
        setMapZoom(11);
      } else {
        // Point
        setMapCenter(feature.coordinates);
        setMapZoom(12);
      }
    }
    setSelectedFeature(feature);
  };

  // Report verification actions
  const handleVerifyReport = (reportId) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'VERIFIED' } : r))
    );
  };

  const handleRejectReport = (reportId) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'REJECTED' } : r))
    );
  };

  // Badges count calculations
  const pendingReportsCount = reports.filter((r) => r.status === 'PENDING').length;
  const blockedRoadsCount = roads.filter((r) => r.status === 'blocked').length;
  const criticalRiskCount = riskZones.filter((z) => z.riskLevel === 'CRITICAL').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Bar Header */}
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        isRefreshing={isRefreshing}
        timeAgoText={timeAgoText}
        onRefresh={triggerRefresh}
        systemLive={true}
        onOpenPriorityQueue={() => handleSelectTab('emergency')}
        activeAlertsCount={3}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative w-full h-full">
        {/* Left Collapsible Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          badgeCounts={{
            criticalRisk: criticalRiskCount,
            pendingReports: pendingReportsCount,
            blockedRoads: blockedRoadsCount,
            activeAlerts: alerts.length,
          }}
        />

        {/* Secondary Contextual Split Drawer / Detail Panel */}
        {panelOpen && activeTab !== 'mapOnly' && (
          <div className="absolute inset-y-0 left-16 sm:left-auto sm:relative w-[calc(100vw-4rem)] sm:w-80 md:w-96 lg:w-[420px] h-full z-20 shrink-0 border-r border-slate-200 dark:border-slate-800/90 shadow-2xl relative flex flex-col bg-white dark:bg-slate-950 transition-colors">
            {/* Context Panel Content based on current sidebar selection */}
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'prediction' && (
                <PredictionPanel
                  riskZones={riskZones}
                  onFocusZone={handleFocusFeature}
                  isRefreshing={isRefreshing}
                />
              )}
              {activeTab === 'reports' && (
                <ReportsPanel
                  reports={reports}
                  onVerifyReport={handleVerifyReport}
                  onRejectReport={handleRejectReport}
                  onFocusReport={handleFocusFeature}
                  isRefreshing={isRefreshing}
                />
              )}
              {activeTab === 'roads' && (
                <RoadsPanel
                  roads={roads}
                  onFocusRoad={handleFocusFeature}
                  isRefreshing={isRefreshing}
                />
              )}
              {activeTab === 'alerts' && (
                <AlertsPanel alerts={alerts} isRefreshing={isRefreshing} />
              )}
              {activeTab === 'emergency' && (
                <EmergencyPriorityQueue
                  riskZones={riskZones}
                  onFocusZone={handleFocusFeature}
                />
              )}
            </div>

            {/* Quick close drawer button */}
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors z-20"
              title="Close panel to view full map"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Re-open panel tab if collapsed - positioned on middle-left edge so it NEVER overlaps FilterPanel */}
        {!panelOpen && (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="absolute top-1/2 -translate-y-1/2 left-0 z-[1000] py-3 px-1.5 rounded-r-xl glass-panel bg-white/95 dark:bg-slate-950/95 border-y border-r border-slate-200 dark:border-slate-700 shadow-2xl text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all hover:pr-2.5 group"
            title={`Open ${activeTab.toUpperCase()} Panel`}
          >
            <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
            <span className="[writing-mode:vertical-lr] rotate-180 uppercase text-[10px] tracking-wider py-1 font-bold">
              {activeTab}
            </span>
          </button>
        )}

        {/* Main Central Interactive Map — Fills all remaining width & height */}
        <main className="flex-1 w-full h-full min-w-0 relative overflow-hidden flex">
          <MapContainer
            layers={layers}
            onToggleLayer={toggleLayer}
            activeRegion={activeRegion}
            onSelectRegion={handleSelectRegion}
            riskZones={riskZones}
            roads={roads}
            reports={reports}
            districts={MOCK_DISTRICTS}
            weatherCells={MOCK_WEATHER_CELLS}
            onVerifyReport={handleVerifyReport}
            onRejectReport={handleRejectReport}
            onSelectFeature={handleFocusFeature}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            sidebarCollapsed={sidebarCollapsed}
            panelOpen={panelOpen}
          />
        </main>
      </div>

      {/* Floating AI Chatbot Assistant Widget */}
      <ChatbotWidget />
    </div>
  );
}
