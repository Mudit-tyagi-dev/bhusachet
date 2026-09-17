import React, { useState, useEffect } from 'react';
import WeatherFilters from './WeatherFilters';
import WeatherMap from './WeatherMap';
import WeatherPanel from './WeatherPanel';
import WeatherChart from './WeatherChart';
import WeatherOverview from './WeatherOverview';
import {
  NER_BOUNDS,
  NER_DISTRICTS,
  STATE_CENTROIDS,
  getDistrictsByState,
  getDistrictById,
} from '../../data/districts/nerDistricts';
import { generateNERGrid } from '../../utils/weatherGrid';
import {
  getWeatherGrid,
  getForecastWeather,
} from '../../services/weatherService';
import { CloudSun, Radio, Shield, MapPin, RefreshCw } from 'lucide-react';

export default function Weather() {
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrictId, setSelectedDistrictId] = useState('mg-east-khasi'); // Default East Khasi Hills (Shillong) for rich preview
  const [displayMode, setDisplayMode] = useState('rainfall'); // 'rainfall' | 'temperature' | 'soil' | 'wind' | 'radar'
  const [timePeriod, setTimePeriod] = useState('24h');

  // Map Coordinates & Zoom
  const [mapCenter, setMapCenter] = useState([25.5788, 91.8933]);
  const [mapZoom, setMapZoom] = useState(8);

  // Weather Data States
  const [districtWeatherData, setDistrictWeatherData] = useState(null);
  const [loadingDistrictWeather, setLoadingDistrictWeather] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loadingGrid, setLoadingGrid] = useState(true);

  // Filtered districts list
  const filteredDistricts = getDistrictsByState(selectedState);
  const selectedDistrict = getDistrictById(selectedDistrictId);

  // 1. Initial Load: Fetch Grid Points for NER region
  useEffect(() => {
    let isMounted = true;
    setLoadingGrid(true);

    const points = generateNERGrid(0.7); // Generates ~50 sample points across NER
    getWeatherGrid(points)
      .then((data) => {
        if (isMounted) {
          setGridData(data);
          setLoadingGrid(false);
        }
      })
      .catch((err) => {
        console.warn('[Weather] Grid weather fetch failed:', err);
        if (isMounted) setLoadingGrid(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch District Weather on district selection or coordinate change
  useEffect(() => {
    if (!selectedDistrict) {
      setDistrictWeatherData(null);
      return;
    }

    let isMounted = true;
    setLoadingDistrictWeather(true);

    getForecastWeather(selectedDistrict.latitude, selectedDistrict.longitude, 7)
      .then((res) => {
        if (isMounted) {
          setDistrictWeatherData(res);
          setLoadingDistrictWeather(false);
        }
      })
      .catch((err) => {
        console.warn('[Weather] District weather fetch error:', err);
        if (isMounted) setLoadingDistrictWeather(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDistrictId]);

  // Handle state change: Update state filter, reset/filter district, zoom map
  const handleSelectState = (stateName) => {
    setSelectedState(stateName);
    if (stateName === 'ALL') {
      setMapCenter(NER_BOUNDS.center);
      setMapZoom(NER_BOUNDS.defaultZoom);
    } else if (STATE_CENTROIDS[stateName]) {
      setMapCenter(STATE_CENTROIDS[stateName].center);
      setMapZoom(STATE_CENTROIDS[stateName].zoom);

      // Auto-select first district in that state
      const stateDistricts = getDistrictsByState(stateName);
      if (stateDistricts.length > 0) {
        setSelectedDistrictId(stateDistricts[0].id);
      }
    }
  };

  // Handle district selection: update district, fly to coordinate
  const handleSelectDistrict = (district) => {
    if (!district) return;
    setSelectedDistrictId(district.id);
    setSelectedState(district.state);
    setMapCenter([district.latitude, district.longitude]);
    setMapZoom(10);
  };

  const handleSelectDistrictById = (distId) => {
    setSelectedDistrictId(distId);
    if (!distId) return;
    const dist = getDistrictById(distId);
    if (dist) {
      setSelectedState(dist.state);
      setMapCenter([dist.latitude, dist.longitude]);
      setMapZoom(10);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-y-auto bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors select-none">
      {/* 1. Top Section: Header & Metadata */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                WEATHER INTELLIGENCE
              </h1>
              {/* <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 uppercase tracking-wide">
                NER • LIVE & HISTORICAL
              </span> */}
            </div>
            {/* <p className="text-[11px] text-slate-500 dark:text-slate-400">
              High-resolution meteorological, Doppler radar, and hydrological sensing across 8 North Eastern states
            </p> */}
          </div>
        </div>

        {/* Live Service Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Open-Meteo & RainViewer Active</span>
          </span>
        </div>
      </div>

      {/* 2. Top Filter Controls Bar */}
      <WeatherFilters
        selectedState={selectedState}
        onSelectState={handleSelectState}
        selectedDistrictId={selectedDistrictId}
        onSelectDistrictId={handleSelectDistrictById}
        districts={filteredDistricts}
        displayMode={displayMode}
        onSelectDisplayMode={setDisplayMode}
        timePeriod={timePeriod}
        onSelectTimePeriod={setTimePeriod}
        isLive={true}
      />

      {/* 3. Main Weather Map Area */}
      <div className="w-full h-[45vh] min-h-[340px] max-h-[520px] relative border-b border-slate-200 dark:border-slate-800 shrink-0">
        <WeatherMap
          center={mapCenter}
          zoom={mapZoom}
          displayMode={displayMode}
          timePeriod={timePeriod}
          gridData={gridData}
          districts={filteredDistricts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={handleSelectDistrict}
          showEarthquakes={true}
          showDistricts={true}
        />
      </div>

      {/* 4. Bottom Split Workspace: District Weather Panel / Overview + Weather Chart */}
      <div className="flex-1 min-h-[380px] grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Left Column: District Weather Panel OR NER Synoptic Overview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {selectedDistrict ? (
            <WeatherPanel
              weatherData={districtWeatherData}
              district={selectedDistrict}
              loading={loadingDistrictWeather}
            />
          ) : (
            <WeatherOverview
              gridData={gridData}
              onSelectState={handleSelectState}
              onSelectDistrict={handleSelectDistrict}
              districts={filteredDistricts}
            />
          )}
        </div>

        {/* Right Column: Time Series Weather Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <WeatherChart
            district={selectedDistrict}
            forecastWeatherData={districtWeatherData}
            loading={loadingDistrictWeather}
          />

          {/* Quick Context & Landslide Warning Callout */}
          {/* <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3 text-xs">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-white block">
                Geohazard Hydrological Correlation Note
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Cumulative rainfall exceeding 70mm/24h combined with topsoil moisture above 35% substantially elevates hill slope shear stress in fragile tectonic corridors. Weather conditions contribute directly to the BhuSachet early warning signal.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
