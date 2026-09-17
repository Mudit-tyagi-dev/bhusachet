import React, { useState, useEffect, useMemo } from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Layers,
  Calendar,
  Clock,
  TrendingUp,
  Info,
  RefreshCw,
} from 'lucide-react';
import { getHistoricalWeather } from '../../services/weatherService';

export default function WeatherChart({
  district,
  forecastWeatherData,
  loading: parentLoading = false,
}) {
  const [tabType, setTabType] = useState('forecast'); // 'past' | 'forecast'
  const [timeRange, setTimeRange] = useState('7D'); // '24H' | '3D' | '7D' | '30D'
  const [metric, setMetric] = useState('rainfall'); // 'rainfall' | 'temperature' | 'wind' | 'soil'
  const [historicalData, setHistoricalData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // When tabType switches to 'past', ensure timeRange is valid for past ('24H', '7D', '30D')
  // When tabType switches to 'forecast', ensure timeRange is valid for forecast ('24H', '3D', '7D')
  useEffect(() => {
    if (tabType === 'past' && timeRange === '3D') {
      setTimeRange('7D');
    } else if (tabType === 'forecast' && timeRange === '30D') {
      setTimeRange('7D');
    }
  }, [tabType, timeRange]);

  // Fetch historical data from Open-Meteo archive when in 'past' mode
  useEffect(() => {
    if (tabType !== 'past' || !district?.latitude || !district?.longitude) return;

    let isMounted = true;
    setLoadingHistory(true);

    const now = new Date();
    // Reanalysis archive is typically available up to 2-3 days ago or yesterday
    const endDaysAgo = 2;
    const endDateObj = new Date(now.getTime() - endDaysAgo * 24 * 60 * 60 * 1000);
    const endDate = endDateObj.toISOString().split('T')[0];

    const daysCount = timeRange === '24H' ? 2 : timeRange === '7D' ? 8 : 31;
    const startDateObj = new Date(endDateObj.getTime() - daysCount * 24 * 60 * 60 * 1000);
    const startDate = startDateObj.toISOString().split('T')[0];

    getHistoricalWeather(district.latitude, district.longitude, startDate, endDate)
      .then((res) => {
        if (isMounted) {
          setHistoricalData(res);
          setLoadingHistory(false);
        }
      })
      .catch((err) => {
        console.warn('[WeatherChart] Historical archive fetch error:', err);
        if (isMounted) setLoadingHistory(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tabType, timeRange, district]);

  // Extract chart series based on active tab and metric
  const chartData = useMemo(() => {
    let rawHourly = {};

    if (tabType === 'forecast') {
      rawHourly = forecastWeatherData?.hourly || {};
    } else {
      rawHourly = historicalData?.hourly || {};
    }

    const times = rawHourly.time || [];
    if (times.length === 0) return [];

    let limitHours = 168; // 7 days default
    if (timeRange === '24H') limitHours = 24;
    else if (timeRange === '3D') limitHours = 72;
    else if (timeRange === '7D') limitHours = 168;
    else if (timeRange === '30D') limitHours = 720;

    const sliceTimes = times.slice(0, limitHours);
    let values = [];

    if (metric === 'rainfall') {
      values = (rawHourly.precipitation || []).slice(0, limitHours);
    } else if (metric === 'temperature') {
      values = (rawHourly.temperature_2m || []).slice(0, limitHours);
    } else if (metric === 'wind') {
      values = (rawHourly.wind_speed_10m || []).slice(0, limitHours);
    } else if (metric === 'soil') {
      values = (rawHourly.soil_moisture_0_to_7cm || []).slice(0, limitHours);
    }

    // Downsample if more than 48 points for clean SVG rendering
    const step = Math.max(1, Math.floor(sliceTimes.length / 48));

    const points = [];
    for (let i = 0; i < sliceTimes.length; i += step) {
      points.push({
        time: sliceTimes[i],
        value: typeof values[i] === 'number' ? Number(values[i].toFixed(2)) : 0,
      });
    }

    return points;
  }, [tabType, timeRange, metric, forecastWeatherData, historicalData]);

  // Metric configs
  const metricConfigs = {
    rainfall: {
      label: 'Precipitation',
      unit: 'mm',
      icon: CloudRain,
      color: '#38bdf8',
      fill: 'rgba(56, 189, 248, 0.15)',
      bar: true,
    },
    temperature: {
      label: 'Temperature (2m)',
      unit: '°C',
      icon: Thermometer,
      color: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.15)',
      bar: false,
    },
    wind: {
      label: 'Wind Speed (10m)',
      unit: 'km/h',
      icon: Wind,
      color: '#818cf8',
      fill: 'rgba(129, 140, 248, 0.15)',
      bar: false,
    },
    soil: {
      label: 'Soil Moisture (0-7cm)',
      unit: 'm³/m²',
      icon: Layers,
      color: '#10b981',
      fill: 'rgba(16, 185, 129, 0.15)',
      bar: false,
    },
  };

  const currentConfig = metricConfigs[metric];
  const maxVal = Math.max(...chartData.map((d) => d.value), 0.1);
  const minVal = Math.min(...chartData.map((d) => d.value), 0);
  const avgVal = chartData.length > 0 ? chartData.reduce((s, d) => s + d.value, 0) / chartData.length : 0;
  const totalVal = metric === 'rainfall' ? chartData.reduce((s, d) => s + d.value, 0) : null;

  const width = 600;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 25, left: 38 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const pointsString = useMemo(() => {
    if (chartData.length === 0) return '';
    const range = maxVal - minVal || 1;
    return chartData
      .map((d, i) => {
        const x = padding.left + (i / (chartData.length - 1 || 1)) * graphWidth;
        const y = padding.top + graphHeight - ((d.value - minVal) / range) * graphHeight;
        return `${x},${y}`;
      })
      .join(' ');
  }, [chartData, maxVal, minVal, graphWidth, graphHeight]);

  const areaString = useMemo(() => {
    if (!pointsString || chartData.length === 0) return '';
    const startX = padding.left;
    const endX = padding.left + graphWidth;
    const bottomY = padding.top + graphHeight;
    return `${startX},${bottomY} ${pointsString} ${endX},${bottomY}`;
  }, [pointsString, chartData, graphWidth, graphHeight]);

  const isLoading = parentLoading || loadingHistory;

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3 transition-colors">
      {/* 1. Header: Navigation Tabs (Past vs Forecast) and Time Spans */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {/* Past vs Forecast Pill Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTabType('forecast')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              tabType === 'forecast'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            FORECAST
          </button>
          <button
            type="button"
            onClick={() => setTabType('past')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              tabType === 'past'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            PAST / ARCHIVE
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 text-xs">
          {tabType === 'forecast' ? (
            ['24H', '3D', '7D'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg font-bold font-mono transition-colors ${
                  timeRange === r
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))
          ) : (
            ['24H', '7D', '30D'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg font-bold font-mono transition-colors ${
                  timeRange === r
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))
          )}
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1">
          {Object.entries(metricConfigs).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isSelected = metric === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setMetric(key)}
                className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1 ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-900 border-amber-500/50 text-slate-900 dark:text-white font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
                title={cfg.label}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                <span className="hidden sm:inline">{cfg.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Source Attribution & Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Data Source</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            {tabType === 'past'
              ? 'Historical Weather: Open-Meteo / ERA5-based data'
              : 'Forecast Weather: Open-Meteo High-Resolution Model'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Peak / Max</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {maxVal.toFixed(1)} {currentConfig.unit}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Average</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {avgVal.toFixed(1)} {currentConfig.unit}
            </span>
          </div>
          {totalVal !== null && (
            <div>
              <span className="text-[10px] text-slate-400 block">Cumulative Total</span>
              <span className="font-extrabold text-sky-600 dark:text-sky-400">
                {totalVal.toFixed(1)} mm
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Interactive Chart Visual Canvas (SVG) */}
      <div className="relative w-full h-48 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            <span>Fetching Open-Meteo series telemetry...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-xs text-slate-400">No time-series data available for the selected range.</div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full select-none"
            preserveAspectRatio="none"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + graphHeight * (1 - ratio);
              const val = minVal + (maxVal - minVal) * ratio;
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="3, 3"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Render Area fill */}
            {areaString && (
              <polygon points={areaString} fill={currentConfig.fill} />
            )}

            {/* Render Polyline */}
            {pointsString && (
              <polyline
                points={pointsString}
                fill="none"
                stroke={currentConfig.color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data point circles and hover targets */}
            {chartData.map((d, i) => {
              const range = maxVal - minVal || 1;
              const cx = padding.left + (i / (chartData.length - 1 || 1)) * graphWidth;
              const cy = padding.top + graphHeight - ((d.value - minVal) / range) * graphHeight;
              const isHovered = hoveredPoint?.index === i;

              return (
                <g key={i}>
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill={currentConfig.color}
                      className="animate-ping opacity-75"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 4 : 2}
                    fill={currentConfig.color}
                    className="transition-all"
                  />
                  {/* Invisible broad hitbox for touch/mouse */}
                  <rect
                    x={cx - 6}
                    y={padding.top}
                    width={12}
                    height={graphHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ ...d, x: cx, y: cy, index: i })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-xl border border-slate-700 font-mono -translate-x-1/2 -translate-y-8"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <div>{new Date(hoveredPoint.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div className="font-bold text-amber-400">
              {currentConfig.label}: {hoveredPoint.value} {currentConfig.unit}
            </div>
          </div>
        )}
      </div>

      {/* 4. Time range date limits text */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>{chartData[0] ? new Date(chartData[0].time).toLocaleDateString() : 'Start'}</span>
        <span>Telemetry timeline ({chartData.length} sampled data points)</span>
        <span>{chartData[chartData.length - 1] ? new Date(chartData[chartData.length - 1].time).toLocaleDateString() : 'End'}</span>
      </div>
    </div>
  );
}
