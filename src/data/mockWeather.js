// Weather Radar and Precipitation Overlay Mock Data

export const MOCK_WEATHER_CELLS = [
  // Heavy Monsoon Cloudburst Cell over Sohra (Meghalaya)
  {
    id: 'WX-MG-01',
    name: 'Orographic Cloudburst Core - Sohra Escarpment',
    center: [25.32, 91.68],
    radius: 26000, // meters
    intensity: 'EXTREME', // 'EXTREME' | 'HEAVY' | 'MODERATE' | 'LIGHT'
    rainfallRate: '48 mm/hr',
    windSpeed: '45 km/h Gusts',
    radarReflectivity: '56 dBZ',
    warning: 'Flash Flood & Rapid Debris Trigger Alert',
  },
  // Active Monsoon Trough over North Sikkim (Chungthang)
  {
    id: 'WX-SK-01',
    name: 'Alpine Convective System - North Sikkim',
    center: [27.58, 88.62],
    radius: 22000,
    intensity: 'HEAVY',
    rainfallRate: '32 mm/hr',
    windSpeed: '38 km/h',
    radarReflectivity: '48 dBZ',
    warning: 'High Risk of Moraine & Slope Destabilization',
  },
  // Moderate Rain over East Sikkim
  {
    id: 'WX-SK-02',
    name: 'Gangtok - Singtam Rain Band',
    center: [27.30, 88.58],
    radius: 18000,
    intensity: 'MODERATE',
    rainfallRate: '18 mm/hr',
    windSpeed: '20 km/h',
    radarReflectivity: '38 dBZ',
    warning: 'Saturated Topsoil Precaution',
  },
  // Light Rain over Garo Hills
  {
    id: 'WX-MG-02',
    name: 'Tura Plateau Precipitation Front',
    center: [25.52, 90.22],
    radius: 20000,
    intensity: 'LIGHT',
    rainfallRate: '8 mm/hr',
    windSpeed: '15 km/h',
    radarReflectivity: '28 dBZ',
    warning: 'Normal Monsoon Circulation',
  },
];
