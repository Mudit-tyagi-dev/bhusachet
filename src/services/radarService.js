/**
 * RainViewer Live Weather Radar Service
 * Fetches real Doppler radar frames and constructs dynamic Leaflet TileLayer URLs.
 * Attribution: "Weather data by RainViewer"
 */

const RAINVIEWER_API_URL = 'https://api.rainviewer.com/public/weather-maps.json';
const RADAR_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedRadarMetadata = null;
let lastFetchTimestamp = 0;

export async function getLiveRadarMetadata() {
  const now = Date.now();
  if (cachedRadarMetadata && now - lastFetchTimestamp < RADAR_CACHE_TTL_MS) {
    return cachedRadarMetadata;
  }

  try {
    const res = await fetch(RAINVIEWER_API_URL);
    if (!res.ok) {
      throw new Error(`RainViewer HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const host = data.host || 'https://tilecache.rainviewer.com';
    const radarFrames = data.radar?.past || [];
    const nowcastFrames = data.radar?.nowcast || [];
    const allFrames = [...radarFrames, ...nowcastFrames];

    if (allFrames.length === 0) {
      throw new Error('No radar frames available in RainViewer response');
    }

    // Pick the most recent frame
    const latestFrame = radarFrames.length > 0 ? radarFrames[radarFrames.length - 1] : allFrames[0];

    // RainViewer Tile URL format: {host}{path}/512/{z}/{x}/{y}/{color}/{smooth}_{snow}.png
    // Color scheme 2 = Universal Blue, smooth = 1, snow = 1
    const tileUrlTemplate = `${host}${latestFrame.path}/512/{z}/{x}/{y}/2/1_1.png`;

    const result = {
      isAvailable: true,
      host,
      latestFrameTime: new Date(latestFrame.time * 1000).toISOString(),
      timestamp: latestFrame.time,
      tileUrlTemplate,
      pastFramesCount: radarFrames.length,
      nowcastFramesCount: nowcastFrames.length,
      attribution: 'Weather data by RainViewer',
      raw: data,
    };

    cachedRadarMetadata = result;
    lastFetchTimestamp = now;
    return result;
  } catch (err) {
    console.warn('[RadarService] RainViewer fetch failed:', err);
    return {
      isAvailable: false,
      error: err.message || 'Radar feed unavailable',
      attribution: 'Weather data by RainViewer',
      tileUrlTemplate: null,
    };
  }
}
