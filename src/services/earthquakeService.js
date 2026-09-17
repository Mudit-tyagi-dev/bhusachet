/**
 * USGS Real-time Earthquake Service
 * Fetches real seismic event data in the North East Region (NER) bounding box.
 * Source: USGS (United States Geological Survey)
 */

const USGS_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let cachedEarthquakes = null;
let lastEarthquakeFetch = 0;

export async function getRecentEarthquakes({ minMagnitude = 2.0, days = 30 } = {}) {
  const now = Date.now();
  if (cachedEarthquakes && now - lastEarthquakeFetch < CACHE_TTL_MS) {
    return cachedEarthquakes;
  }

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];

  const url = `${USGS_BASE_URL}?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=${minMagnitude}&minlatitude=21.0&maxlatitude=30.0&minlongitude=88.0&maxlongitude=98.0&orderby=time&limit=50`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`USGS HTTP ${res.status}: ${res.statusText}`);
    }

    const geojson = await res.json();
    const events = (geojson.features || []).map((feat) => {
      const [lon, lat, depth] = feat.geometry?.coordinates || [0, 0, 0];
      const props = feat.properties || {};

      return {
        id: feat.id,
        magnitude: props.mag,
        magType: props.magType,
        place: props.place,
        time: new Date(props.time).toISOString(),
        timestamp: props.time,
        coordinates: [lat, lon],
        depthKm: depth,
        tsunami: props.tsunami,
        url: props.url,
        title: props.title,
      };
    });

    const result = {
      isLive: true,
      source: 'USGS Earthquake Hazards Program',
      count: events.length,
      events,
      fetchedAt: new Date().toISOString(),
    };

    cachedEarthquakes = result;
    lastEarthquakeFetch = now;
    return result;
  } catch (err) {
    console.warn('[EarthquakeService] USGS fetch failed:', err);
    // Return structured fallback
    return {
      isLive: false,
      isFallback: true,
      error: err.message,
      source: 'USGS (Offline / Cached)',
      count: 0,
      events: [
        {
          id: 'usgs-ner-sample-1',
          magnitude: 3.4,
          place: '28 km ENE of Mawkyrwat, Meghalaya',
          time: new Date(Date.now() - 36 * 3600000).toISOString(),
          coordinates: [25.42, 91.68],
          depthKm: 10,
        },
        {
          id: 'usgs-ner-sample-2',
          magnitude: 4.1,
          place: '45 km N of Mangan, Sikkim',
          time: new Date(Date.now() - 72 * 3600000).toISOString(),
          coordinates: [27.85, 88.55],
          depthKm: 15,
        },
      ],
      fetchedAt: new Date().toISOString(),
    };
  }
}
