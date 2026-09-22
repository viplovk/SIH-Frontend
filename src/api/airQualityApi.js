// Algoriot Air Quality API Service Layer
// Real Open-Meteo Air Quality & CPCB Classification
import { apiFetch } from "./client.js";

// Cache for Air Quality Grid
let aqiGridCache = null;
let aqiCacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Standard CPCB / EPA AQI Category definitions
 */
export function getAqiCategory(aqiValue) {
  if (aqiValue <= 50) {
    return {
      category: "Good",
      label: "Good (0–50)",
      color: "#10b981",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      advisory: "Air quality is satisfactory and poses little or no risk."
    };
  }
  if (aqiValue <= 100) {
    return {
      category: "Moderate",
      label: "Satisfactory / Moderate (51–100)",
      color: "#eab308",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      advisory: "Acceptable quality; sensitive individuals may experience mild symptoms."
    };
  }
  if (aqiValue <= 150) {
    return {
      category: "Unhealthy for Sensitive Groups",
      label: "Unhealthy for Sensitive (101–150)",
      color: "#f97316",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      advisory: "General public not likely affected; people with respiratory disease should limit outdoor exertion."
    };
  }
  if (aqiValue <= 200) {
    return {
      category: "Poor / Unhealthy",
      label: "Poor (151–200)",
      color: "#ef4444",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      advisory: "Increased likelihood of breathing discomfort in active children and adults."
    };
  }
  if (aqiValue <= 300) {
    return {
      category: "Very Poor",
      label: "Very Poor (201–300)",
      color: "#8b5cf6",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      advisory: "Health alert: serious risk of health effects for everyone."
    };
  }
  return {
    category: "Severe / Hazardous",
    label: "Severe (301+)",
    color: "#881337",
    textColor: "text-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    advisory: "Health emergency conditions: entire population likely affected."
  };
}

export function getAqiRgb(aqi) {
  if (aqi <= 50) return [16, 185, 129];
  if (aqi <= 100) return [234, 179, 8];
  if (aqi <= 150) return [249, 115, 22];
  if (aqi <= 200) return [239, 68, 68];
  if (aqi <= 300) return [139, 92, 246];
  return [136, 19, 55];
}

/**
 * Fetch live Air Quality for single point
 */
export async function fetchLivePointAqi(lat, lon) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,nitrogen_dioxide,ozone,us_aqi,european_aqi&hourly=pm2_5,pm10,us_aqi&forecast_hours=24&timezone=Asia%2FKolkata`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo Air Quality HTTP ${res.status}`);
  }
  const data = await res.json();
  const current = data.current || {};
  return {
    source: "Open-Meteo Air Quality",
    timestamp: current.time || new Date().toISOString(),
    lat: data.latitude,
    lon: data.longitude,
    pm2_5: current.pm2_5 ?? null,
    pm10: current.pm10 ?? null,
    no2: current.nitrogen_dioxide ?? null,
    o3: current.ozone ?? null,
    us_aqi: current.us_aqi ?? Math.round((current.pm2_5 || 25) * 3.5),
    european_aqi: current.european_aqi ?? null
  };
}

/**
 * Batch fetch Air Quality for coordinate list
 */
export async function fetchLiveBatchAqi(coordinates, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && aqiGridCache && (now - aqiCacheTime < CACHE_TTL_MS)) {
    return aqiGridCache;
  }

  const lats = coordinates.map((c) => Number(c.lat).toFixed(2)).join(",");
  const lons = coordinates.map((c) => Number(c.lon).toFixed(2)).join(",");
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=pm2_5,pm10,nitrogen_dioxide,ozone,us_aqi,european_aqi&hourly=pm2_5,pm10,us_aqi&forecast_hours=25&timezone=Asia%2FKolkata`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo Batch Air Quality HTTP ${res.status}`);
  }

  const json = await res.json();
  const results = Array.isArray(json) ? json : [json];

  const processed = coordinates.map((coord, idx) => {
    const item = results[idx] || {};
    const cur = item.current || {};
    const hourly = item.hourly || {};
    const aqi = cur.us_aqi ?? (cur.pm2_5 ? Math.round(cur.pm2_5 * 3.2) : 45);

    return {
      lat: coord.lat,
      lon: coord.lon,
      name: coord.name || null,
      source: "Open-Meteo Air Quality",
      timestamp: cur.time || new Date().toISOString(),
      aqi,
      pm2_5: cur.pm2_5 ?? null,
      pm10: cur.pm10 ?? null,
      hourlyAqi: hourly.us_aqi || [],
      hourlyTimes: hourly.time || []
    };
  });

  aqiGridCache = {
    source: "Open-Meteo Air Quality API",
    retrievedAt: new Date().toISOString(),
    stations: processed
  };
  aqiCacheTime = now;

  return aqiGridCache;
}
