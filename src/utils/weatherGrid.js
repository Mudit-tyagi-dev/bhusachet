/**
 * NER Weather Grid Generator & Normalization Utilities
 * Generates an optimized spatial sampling grid across the 8 NER states
 * and provides robust mathematical scaling for map visualizations.
 */

export const WEATHER_GRID_CONFIG = {
  minLat: 24.0,
  maxLat: 29.5,
  minLon: 88.0,
  maxLon: 97.5,
  defaultStep: 0.65, // ~70km spatial resolution (~60-70 query points) - optimal for Open-Meteo batch latency
};

/**
 * Generates uniform grid points across the North Eastern Region
 */
export function generateNERGrid(step = WEATHER_GRID_CONFIG.defaultStep) {
  const points = [];
  let id = 0;

  for (let lat = WEATHER_GRID_CONFIG.minLat; lat <= WEATHER_GRID_CONFIG.maxLat; lat += step) {
    for (let lon = WEATHER_GRID_CONFIG.minLon; lon <= WEATHER_GRID_CONFIG.maxLon; lon += step) {
      // Coarse mask to filter out points deep inside Bangladesh/Tibet outside NER bounds
      const isNERRegion =
        (lat >= 25.0 && lat <= 29.5 && lon >= 88.0 && lon <= 97.5) || // Sikkim, Assam, Arunachal, Meghalaya, Nagaland
        (lat >= 23.0 && lat < 25.0 && lon >= 91.0 && lon <= 94.5);   // Tripura, Mizoram, Manipur

      if (isNERRegion) {
        points.push({
          id: `grid-${id++}`,
          lat: Number(lat.toFixed(2)),
          lon: Number(lon.toFixed(2)),
        });
      }
    }
  }

  return points;
}

/**
 * Normalizes precipitation (mm) into an intensity score [0.0 - 1.0] using logarithmic scaling
 * to preserve visual distinction between 5mm, 30mm, and 120mm without blowout.
 */
export function normalizePrecipitation(mm) {
  if (!mm || mm <= 0) return 0;
  // Logarithmic transformation: log10(1 + mm) / log10(1 + 150)
  const normalized = Math.log10(1 + mm) / Math.log10(1 + 120);
  return Math.max(0.05, Math.min(1.0, Number(normalized.toFixed(3))));
}

/**
 * Normalizes temperature (°C) for color mapping (range -5°C to 40°C)
 */
export function normalizeTemperature(tempC) {
  if (tempC === undefined || tempC === null) return 0.5;
  const min = -5;
  const max = 40;
  const normalized = (tempC - min) / (max - min);
  return Math.max(0.0, Math.min(1.0, Number(normalized.toFixed(3))));
}

/**
 * Normalizes soil moisture (0-7cm) (range 0.05 to 0.55 m³/m³)
 */
export function normalizeSoilMoisture(moisture) {
  if (moisture === undefined || moisture === null) return 0.2;
  const min = 0.05;
  const max = 0.50;
  const normalized = (moisture - min) / (max - min);
  return Math.max(0.0, Math.min(1.0, Number(normalized.toFixed(3))));
}

/**
 * Normalizes wind speed (km/h) (range 0 to 80 km/h)
 */
export function normalizeWindSpeed(speedKmh) {
  if (!speedKmh || speedKmh <= 0) return 0;
  const normalized = speedKmh / 70.0;
  return Math.max(0.0, Math.min(1.0, Number(normalized.toFixed(3))));
}

/**
 * Color mapper for scalar display modes
 */
export function getScalarColor(mode, value) {
  if (mode === 'rainfall') {
    if (value <= 0.1) return 'rgba(56, 189, 248, 0.25)'; // Light blue
    if (value <= 10) return 'rgba(14, 165, 233, 0.5)';   // Sky
    if (value <= 30) return 'rgba(37, 99, 235, 0.65)';   // Blue
    if (value <= 70) return 'rgba(234, 88, 12, 0.75)';   // Orange
    return 'rgba(225, 29, 72, 0.85)';                    // Red/Crimson
  }

  if (mode === 'temperature') {
    if (value < 10) return 'rgba(96, 165, 250, 0.6)';    // Cool Blue
    if (value < 20) return 'rgba(52, 211, 153, 0.6)';    // Greenish
    if (value < 28) return 'rgba(251, 191, 36, 0.65)';   // Warm Amber
    if (value < 35) return 'rgba(249, 115, 22, 0.75)';   // Orange
    return 'rgba(239, 68, 68, 0.85)';                    // Hot Red
  }

  if (mode === 'soil') {
    if (value < 0.15) return 'rgba(254, 215, 170, 0.5)'; // Dry sand
    if (value < 0.25) return 'rgba(134, 239, 172, 0.6)'; // Moist green
    if (value < 0.38) return 'rgba(56, 189, 248, 0.7)';  // Saturated blue
    return 'rgba(99, 102, 241, 0.85)';                   // Over-saturated indigo
  }

  if (mode === 'wind') {
    if (value < 15) return 'rgba(148, 163, 184, 0.4)';   // Calm
    if (value < 30) return 'rgba(56, 189, 248, 0.6)';    // Moderate breeze
    if (value < 50) return 'rgba(245, 158, 11, 0.75)';   // Strong wind
    return 'rgba(239, 68, 68, 0.85)';                    // Gale / storm
  }

  return 'rgba(59, 130, 246, 0.5)';
}
