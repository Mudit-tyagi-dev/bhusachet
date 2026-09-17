/**
 * BhuSachet Weather Severity Indicator & Classification Utility
 * Note: These thresholds are prototype indicator thresholds tailored for
 * steep mountainous terrain in the North Eastern Region (NER).
 * Attribution: BhuSachet prototype severity classification.
 */

export const RAINFALL_THRESHOLDS = {
  // 24-Hour Cumulative Rainfall (mm)
  rain24h: {
    extreme: 150.0, // > 150 mm/24h: Critical landslide trigger zone
    high: 70.0,     // 70 - 150 mm/24h: High debris flow potential
    moderate: 30.0, // 30 - 70 mm/24h: Saturated soil alert
    low: 0.0,       // 0 - 30 mm/24h: Normal / Low risk
  },
  // 6-Hour Short-duration Burst Rainfall (mm)
  rain6h: {
    extreme: 65.0,
    high: 35.0,
    moderate: 15.0,
    low: 0.0,
  },
  // 1-Hour Peak Intensity (mm/h)
  hourlyIntensity: {
    extreme: 25.0,
    high: 12.0,
    moderate: 5.0,
    low: 0.0,
  },
  // Topsoil Moisture (m³/m³) 0-7cm
  soilMoisture0_7cm: {
    saturated: 0.42,
    high: 0.35,
    moderate: 0.25,
    normal: 0.15,
  },
};

/**
 * Classifies weather severity based on cumulative 24h rainfall, 6h rainfall and soil moisture
 * Returns: { level: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME', score: number, description: string, label: string }
 */
export function calculateWeatherSeverity({ rain24h = 0, rain6h = 0, hourlyRain = 0, soilMoisture = 0 }) {
  let score = 0;

  // 24h Rain Contribution (up to 45 pts)
  if (rain24h >= RAINFALL_THRESHOLDS.rain24h.extreme) score += 45;
  else if (rain24h >= RAINFALL_THRESHOLDS.rain24h.high) score += 32;
  else if (rain24h >= RAINFALL_THRESHOLDS.rain24h.moderate) score += 18;
  else if (rain24h > 5) score += 8;

  // 6h Rain Burst Contribution (up to 30 pts)
  if (rain6h >= RAINFALL_THRESHOLDS.rain6h.extreme) score += 30;
  else if (rain6h >= RAINFALL_THRESHOLDS.rain6h.high) score += 22;
  else if (rain6h >= RAINFALL_THRESHOLDS.rain6h.moderate) score += 12;
  else if (rain6h > 2) score += 5;

  // Hourly Peak Intensity (up to 15 pts)
  if (hourlyRain >= RAINFALL_THRESHOLDS.hourlyIntensity.extreme) score += 15;
  else if (hourlyRain >= RAINFALL_THRESHOLDS.hourlyIntensity.high) score += 10;
  else if (hourlyRain >= RAINFALL_THRESHOLDS.hourlyIntensity.moderate) score += 5;

  // Soil Moisture Saturation (up to 10 pts)
  if (soilMoisture >= RAINFALL_THRESHOLDS.soilMoisture0_7cm.saturated) score += 10;
  else if (soilMoisture >= RAINFALL_THRESHOLDS.soilMoisture0_7cm.high) score += 7;
  else if (soilMoisture >= RAINFALL_THRESHOLDS.soilMoisture0_7cm.moderate) score += 4;

  let level = 'LOW';
  let description = 'Normal meteorological conditions. Low landslide trigger probability.';
  let color = 'text-emerald-600 dark:text-emerald-400';
  let bg = 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30';

  if (score >= 65 || rain24h >= RAINFALL_THRESHOLDS.rain24h.extreme || rain6h >= RAINFALL_THRESHOLDS.rain6h.extreme) {
    level = 'EXTREME';
    description = 'Severe orographic downpour. Critical pore-pressure elevation with imminent slope instability danger.';
    color = 'text-rose-600 dark:text-rose-400';
    bg = 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30';
  } else if (score >= 40 || rain24h >= RAINFALL_THRESHOLDS.rain24h.high || rain6h >= RAINFALL_THRESHOLDS.rain6h.high) {
    level = 'HIGH';
    description = 'Heavy rainfall accumulation. High potential for debris flows, rockfalls, and road blockages.';
    color = 'text-orange-600 dark:text-orange-400';
    bg = 'bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30';
  } else if (score >= 20 || rain24h >= RAINFALL_THRESHOLDS.rain24h.moderate || rain6h >= RAINFALL_THRESHOLDS.rain6h.moderate) {
    level = 'MODERATE';
    description = 'Moderate rainfall detected. Saturated topsoil may weaken vulnerable hillside cuts.';
    color = 'text-amber-600 dark:text-amber-400';
    bg = 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30';
  }

  return {
    level,
    score: Math.min(score, 100),
    description,
    color,
    bg,
    indicatorLabel: 'BhuSachet weather severity indicator',
  };
}

/**
 * WMO Weather Code Translation (Standard Open-Meteo interpretation)
 */
export function interpretWeatherCode(code) {
  if (code === undefined || code === null) {
    return { label: 'Clear / Variable', icon: 'Sun', description: 'Fair conditions' };
  }

  const numericCode = Number(code);

  switch (numericCode) {
    case 0:
      return { label: 'Clear Sky', icon: 'Sun', description: 'Sunny / clear sky' };
    case 1:
      return { label: 'Mainly Clear', icon: 'SunMedium', description: 'Scattered clouds' };
    case 2:
      return { label: 'Partly Cloudy', icon: 'CloudSun', description: 'Partially clouded' };
    case 3:
      return { label: 'Overcast', icon: 'Cloud', description: 'Heavy cloud cover' };
    case 45:
    case 48:
      return { label: 'Fog / Mist', icon: 'CloudFog', description: 'Dense mountain fog' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', icon: 'CloudDrizzle', description: 'Light to dense drizzle' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', icon: 'CloudSnow', description: 'Freezing drizzle' };
    case 61:
      return { label: 'Slight Rain', icon: 'CloudRain', description: 'Continuous light rain' };
    case 63:
      return { label: 'Moderate Rain', icon: 'CloudRain', description: 'Moderate continuous rain' };
    case 65:
      return { label: 'Heavy Rain', icon: 'CloudRain', description: 'Torrential mountain rain' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', icon: 'CloudSnow', description: 'Freezing precipitation' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snow Fall', icon: 'Snowflake', description: 'Alpine snowfall' };
    case 77:
      return { label: 'Snow Grains', icon: 'Snowflake', description: 'Snow grains' };
    case 80:
      return { label: 'Light Showers', icon: 'CloudRain', description: 'Isolated rain showers' };
    case 81:
      return { label: 'Moderate Showers', icon: 'CloudRain', description: 'Passing rain showers' };
    case 82:
      return { label: 'Violent Showers', icon: 'CloudLightning', description: 'Severe convective cloudburst' };
    case 85:
    case 86:
      return { label: 'Snow Showers', icon: 'Snowflake', description: 'Heavy snow showers' };
    case 95:
      return { label: 'Thunderstorm', icon: 'CloudLightning', description: 'Thunderstorm with lightning' };
    case 96:
    case 99:
      return { label: 'Severe Thunderstorm', icon: 'CloudLightning', description: 'Thunderstorm with heavy hail' };
    default:
      return { label: `Weather Code ${code}`, icon: 'Cloud', description: 'Observed weather state' };
  }
}
