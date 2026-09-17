/**
 * BhuSachet Weather Service Layer
 * Centralizes all Open-Meteo API requests (Current, Forecast, Multi-location Batch, Historical Reanalysis)
 * Integrates frontend caching (In-Memory + LocalStorage) and resilient error handling.
 *
 * NOTE: UI components must NEVER call fetch() directly.
 */

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

// Cache TTL Configurations
const CACHE_TTL_FORECAST_MS = 10 * 60 * 1000; // 10 minutes
const CACHE_TTL_HISTORICAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_TTL_GRID_MS = 15 * 60 * 1000; // 15 minutes

// In-Memory Fast Cache Map
const memoryCache = new Map();

/**
 * Cache Helper: Get cached payload if valid
 */
function getFromCache(key, ttlMs) {
  const now = Date.now();

  // 1. Check Memory Cache
  if (memoryCache.has(key)) {
    const entry = memoryCache.get(key);
    if (now - entry.timestamp < ttlMs) {
      return entry.data;
    }
    memoryCache.delete(key);
  }

  // 2. Check LocalStorage
  try {
    const raw = localStorage.getItem(`bhusachet_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (now - parsed.timestamp < ttlMs) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
      localStorage.removeItem(`bhusachet_cache_${key}`);
    }
  } catch {
    // Ignore storage quota or disabled errors
  }

  return null;
}

function saveToCache(key, data) {
  const entry = { timestamp: Date.now(), data };
  memoryCache.set(key, entry);

  try {
    localStorage.setItem(`bhusachet_cache_${key}`, JSON.stringify(entry));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Standard parameters for Open-Meteo Current & Hourly Forecast
 */
const FORECAST_CURRENT_VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'rain',
  'wind_speed_10m',
  'wind_direction_10m',
].join(',');

const FORECAST_HOURLY_VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'rain',
  'showers',
  'wind_speed_10m',
  'wind_direction_10m',
  'soil_moisture_0_to_7cm',
  'soil_moisture_7_to_28cm',
  'weather_code',
].join(',');

const HISTORICAL_HOURLY_VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'rain',
  'wind_speed_10m',
  'soil_moisture_0_to_7cm',
].join(',');

/**
 * 1. Fetch Current & 7-Day Forecast Weather for a single coordinate
 */
export async function getForecastWeather(latitude, longitude, days = 7) {
  const lat = Number(latitude).toFixed(4);
  const lon = Number(longitude).toFixed(4);
  const cacheKey = `forecast_${lat}_${lon}_${days}d`;

  const cached = getFromCache(cacheKey, CACHE_TTL_FORECAST_MS);
  if (cached) {
    return { ...cached, isCached: true };
  }

  const url = `${OPEN_METEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current=${FORECAST_CURRENT_VARS}&hourly=${FORECAST_HOURLY_VARS}&forecast_days=${days}&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo Forecast HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();

    const formatted = {
      isLive: true,
      source: 'Open-Meteo Forecast',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      elevation: data.elevation,
      current: data.current || {},
      currentUnits: data.current_units || {},
      hourly: data.hourly || {},
      hourlyUnits: data.hourly_units || {},
      updatedAt: data.current?.time || new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
    };

    saveToCache(cacheKey, formatted);
    return formatted;
  } catch (error) {
    console.warn('[WeatherService] getForecastWeather error:', error);
    // Return structured fallback
    return {
      isLive: false,
      isFallback: true,
      error: error.message,
      source: 'Open-Meteo (Offline / Fallback)',
      current: {
        temperature_2m: 21.4,
        relative_humidity_2m: 78,
        precipitation: 2.4,
        rain: 2.0,
        wind_speed_10m: 12.5,
        wind_direction_10m: 140,
        weather_code: 61,
        time: new Date().toISOString(),
      },
      hourly: {
        time: Array.from({ length: 24 * days }, (_, i) => new Date(Date.now() + i * 3600000).toISOString()),
        temperature_2m: Array.from({ length: 24 * days }, () => +(20 + Math.random() * 6).toFixed(1)),
        precipitation: Array.from({ length: 24 * days }, () => +(Math.random() * 4).toFixed(1)),
        wind_speed_10m: Array.from({ length: 24 * days }, () => +(8 + Math.random() * 10).toFixed(1)),
        soil_moisture_0_to_7cm: Array.from({ length: 24 * days }, () => +(0.28 + Math.random() * 0.08).toFixed(2)),
      },
      updatedAt: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 2. Convenience method: Get Current Weather
 */
export async function getCurrentWeather(latitude, longitude) {
  const result = await getForecastWeather(latitude, longitude, 1);
  return result;
}

/**
 * 3. Fetch Historical Weather from Open-Meteo Archive API
 * Attribution: "Historical Weather Open-Meteo / ERA5-based data"
 */
export async function getHistoricalWeather(latitude, longitude, startDate, endDate) {
  const lat = Number(latitude).toFixed(4);
  const lon = Number(longitude).toFixed(4);
  const cacheKey = `archive_${lat}_${lon}_${startDate}_${endDate}`;

  const cached = getFromCache(cacheKey, CACHE_TTL_HISTORICAL_MS);
  if (cached) {
    return { ...cached, isCached: true };
  }

  const url = `${OPEN_METEO_ARCHIVE_URL}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=${HISTORICAL_HOURLY_VARS}&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo Archive HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();

    const formatted = {
      isLive: true,
      source: 'Historical Weather Open-Meteo / ERA5-based data',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      hourly: data.hourly || {},
      hourlyUnits: data.hourly_units || {},
      fetchedAt: new Date().toISOString(),
    };

    saveToCache(cacheKey, formatted);
    return formatted;
  } catch (error) {
    console.warn('[WeatherService] getHistoricalWeather error:', error);
    return {
      isLive: false,
      isFallback: true,
      error: error.message,
      source: 'Historical Weather Open-Meteo / ERA5-based data (Fallback)',
      hourly: {
        time: [],
        temperature_2m: [],
        precipitation: [],
        wind_speed_10m: [],
        soil_moisture_0_to_7cm: [],
      },
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 4. Fetch Weather for a specific district object
 */
export async function getWeatherForDistrict(district, days = 7) {
  if (!district || !district.latitude || !district.longitude) {
    throw new Error('Invalid district coordinate specified');
  }
  const weather = await getForecastWeather(district.latitude, district.longitude, days);
  return {
    ...weather,
    district: district.name,
    state: district.state,
    districtId: district.id,
  };
}

/**
 * 5. Batch Weather for multiple locations using Open-Meteo's comma-separated coords
 * locations: [{ id, name, state, latitude, longitude }]
 */
export async function getWeatherForLocations(locations) {
  if (!locations || locations.length === 0) return [];

  // Break into chunks of 40 coordinates to respect URL size limits
  const CHUNK_SIZE = 40;
  const results = [];

  for (let i = 0; i < locations.length; i += CHUNK_SIZE) {
    const chunk = locations.slice(i, i + CHUNK_SIZE);
    const lats = chunk.map((l) => Number(l.latitude || l.lat).toFixed(4)).join(',');
    const lons = chunk.map((l) => Number(l.longitude || l.lon).toFixed(4)).join(',');

    const cacheKey = `batch_${chunk[0].id || i}_${chunk.length}`;
    const cached = getFromCache(cacheKey, CACHE_TTL_GRID_MS);

    if (cached) {
      results.push(...cached);
      continue;
    }

    const url = `${OPEN_METEO_BASE_URL}?latitude=${lats}&longitude=${lons}&current=${FORECAST_CURRENT_VARS}&hourly=precipitation,soil_moisture_0_to_7cm,temperature_2m,wind_speed_10m&forecast_days=1&timezone=auto`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Open-Meteo Batch HTTP ${res.status}`);
      const data = await res.json();

      // If multiple coordinates requested, Open-Meteo returns an Array of results
      const responses = Array.isArray(data) ? data : [data];

      const mappedChunk = chunk.map((loc, idx) => {
        const item = responses[idx] || {};
        const current = item.current || {};
        const hourly = item.hourly || {};

        // Calculate 6-hour rainfall sum if hourly is present
        const rain6h = (hourly.precipitation || []).slice(0, 6).reduce((acc, v) => acc + (v || 0), 0);
        const rain24h = (hourly.precipitation || []).slice(0, 24).reduce((acc, v) => acc + (v || 0), 0);

        return {
          id: loc.id,
          name: loc.name || loc.id,
          state: loc.state || 'NER',
          lat: loc.latitude || loc.lat,
          lon: loc.longitude || loc.lon,
          temperature: current.temperature_2m ?? 22.0,
          humidity: current.relative_humidity_2m ?? 75,
          precipitation: current.precipitation ?? 0.0,
          rain: current.rain ?? 0.0,
          rain6h: +(rain6h).toFixed(1),
          rain24h: +(rain24h).toFixed(1),
          windSpeed: current.wind_speed_10m ?? 10.0,
          windDirection: current.wind_direction_10m ?? 0,
          soilMoisture: (hourly.soil_moisture_0_to_7cm && hourly.soil_moisture_0_to_7cm[0]) ?? 0.28,
          updatedAt: current.time || new Date().toISOString(),
          isLive: true,
        };
      });

      saveToCache(cacheKey, mappedChunk);
      results.push(...mappedChunk);
    } catch (err) {
      console.warn('[WeatherService] Batch fetch chunk failed:', err);
      // Generate fallback for this chunk
      const fallbackChunk = chunk.map((loc) => ({
        id: loc.id,
        name: loc.name || loc.id,
        state: loc.state || 'NER',
        lat: loc.latitude || loc.lat,
        lon: loc.longitude || loc.lon,
        temperature: 22.5,
        humidity: 80,
        precipitation: 1.2,
        rain: 1.0,
        rain6h: 5.4,
        rain24h: 18.2,
        windSpeed: 12.0,
        windDirection: 90,
        soilMoisture: 0.30,
        updatedAt: new Date().toISOString(),
        isLive: false,
      }));
      results.push(...fallbackChunk);
    }
  }

  return results;
}

/**
 * 6. Fetch Real Weather for NER Weather Grid Points
 */
export async function getWeatherGrid(points) {
  return getWeatherForLocations(points);
}
