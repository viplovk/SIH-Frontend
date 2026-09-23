// Algoriot Real Meteorological Geospatial Data Service
// Strictly Real Data Ingestion (Open-Meteo & FastAPI Backend)
// SIH26081 — Disaster Management & Hybrid Weather Intelligence

import indiaBoundaryData from "../data/india/india-boundary.json";
import { LOCATIONS } from "../data/locations.js";
import { fetchLiveBatchAqi, getAqiCategory } from "./airQualityApi.js";
import { getApiConfig } from "./client.js";
import { getOrBuildSpatialGrid } from "../components/map/weatherRasterEngine.js";

// Bounding Box for India Subcontinent
export const INDIA_BBOX = {
  north: 37.2,
  south: 6.8,
  west: 68.0,
  east: 97.5
};

// Strategic Meteorological Grid Points spanning Indian Geography
// ~60-70 evenly spaced latitude/longitude coordinates covering all climate zones
export const INDIA_GRID_POINTS = [
  // Northern / Himalayan / Foothills
  { lat: 34.08, lon: 74.80, name: "Srinagar", zone: "Western Himalayas" },
  { lat: 32.72, lon: 74.86, name: "Jammu", zone: "Outer Himalayas" },
  { lat: 31.63, lon: 74.87, name: "Amritsar", zone: "Punjab Plains" },
  { lat: 31.10, lon: 77.17, name: "Shimla", zone: "Himachal Highlands" },
  { lat: 30.32, lon: 78.03, name: "Dehradun", zone: "Garhwal Foothills" },
  { lat: 30.73, lon: 76.78, name: "Chandigarh", zone: "Shiwalik Edge" },

  // Indo-Gangetic Plains & Desert Border
  { lat: 28.61, lon: 77.21, name: "Delhi NCR", zone: "Yamuna Basin" },
  { lat: 28.02, lon: 73.31, name: "Bikaner", zone: "Thar Arid" },
  { lat: 26.91, lon: 75.79, name: "Jaipur", zone: "Aravalli Semi-Arid" },
  { lat: 26.29, lon: 73.02, name: "Jodhpur", zone: "Marwar Desert" },
  { lat: 27.18, lon: 78.01, name: "Agra", zone: "Central Gangetic" },
  { lat: 26.85, lon: 80.95, name: "Lucknow", zone: "Awadh Plains" },
  { lat: 25.32, lon: 82.97, name: "Varanasi", zone: "Middle Ganges" },
  { lat: 25.59, lon: 85.14, name: "Patna", zone: "Bihar Floodplain" },
  { lat: 26.76, lon: 83.37, name: "Gorakhpur", zone: "Terai Belt" },

  // Northeast & Brahmaputra Basin
  { lat: 26.14, lon: 91.74, name: "Guwahati", zone: "Lower Assam" },
  { lat: 27.47, lon: 94.91, name: "Dibrugarh", zone: "Upper Assam" },
  { lat: 25.57, lon: 91.89, name: "Shillong", zone: "Meghalaya Plateau" },
  { lat: 23.83, lon: 91.28, name: "Agartala", zone: "Tripura Basin" },
  { lat: 24.81, lon: 93.94, name: "Imphal", zone: "Manipur Valley" },

  // Western Peninsular & Coast
  { lat: 23.02, lon: 72.57, name: "Ahmedabad", zone: "Gujarat Plains" },
  { lat: 22.30, lon: 70.80, name: "Rajkot", zone: "Saurashtra" },
  { lat: 21.17, lon: 72.83, name: "Surat", zone: "Tapti Delta" },
  { lat: 19.07, lon: 72.88, name: "Mumbai", zone: "Konkan Coast" },
  { lat: 18.52, lon: 73.86, name: "Pune", zone: "Western Deccan" },
  { lat: 16.99, lon: 73.30, name: "Ratnagiri", zone: "South Konkan" },
  { lat: 15.30, lon: 73.83, name: "Panaji", zone: "Goa Coastal" },

  // Central India & Plateau
  { lat: 23.26, lon: 77.41, name: "Bhopal", zone: "Malwa Plateau" },
  { lat: 22.72, lon: 75.86, name: "Indore", zone: "Vindhyan Ridge" },
  { lat: 23.18, lon: 79.99, name: "Jabalpur", zone: "Narmada Valley" },
  { lat: 21.15, lon: 79.08, name: "Nagpur", zone: "Vidarbha Central" },
  { lat: 21.25, lon: 81.63, name: "Raipur", zone: "Chhattisgarh Basin" },
  { lat: 23.34, lon: 85.31, name: "Ranchi", zone: "Chota Nagpur" },

  // Eastern Peninsular & Bay of Bengal Coast
  { lat: 22.57, lon: 88.36, name: "Kolkata", zone: "Ganges Delta" },
  { lat: 21.49, lon: 86.93, name: "Balasore", zone: "North Odisha Coast" },
  { lat: 20.30, lon: 85.82, name: "Bhubaneswar", zone: "Mahanadi Delta" },
  { lat: 17.69, lon: 83.22, name: "Visakhapatnam", zone: "Andhra Coast" },
  { lat: 16.51, lon: 80.65, name: "Vijayawada", zone: "Krishna Delta" },

  // Southern Deccan & Coromandel Coast
  { lat: 17.38, lon: 78.48, name: "Hyderabad", zone: "Telangana Plateau" },
  { lat: 12.97, lon: 77.59, name: "Bengaluru", zone: "South Mysore Plateau" },
  { lat: 15.36, lon: 75.12, name: "Hubballi", zone: "North Karnataka" },
  { lat: 13.08, lon: 80.27, name: "Chennai", zone: "Coromandel North" },
  { lat: 11.94, lon: 79.81, name: "Puducherry", zone: "Coromandel Central" },
  { lat: 10.79, lon: 78.70, name: "Tiruchirappalli", zone: "Cauvery Basin" },
  { lat: 9.93, lon: 78.12, name: "Madurai", zone: "Vaigai Valley" },

  // Malabar & Deep South
  { lat: 12.91, lon: 74.86, name: "Mangaluru", zone: "Canara Coast" },
  { lat: 11.25, lon: 75.78, name: "Kozhikode", zone: "Malabar North" },
  { lat: 9.93, lon: 76.27, name: "Kochi", zone: "Vembanad Coast" },
  { lat: 8.52, lon: 76.94, name: "Thiruvananthapuram", zone: "Travancore Coast" },
  { lat: 8.08, lon: 77.54, name: "Kanyakumari", zone: "Cape Comorin" },

  // Islands / Maritime Outposts
  { lat: 11.62, lon: 92.73, name: "Port Blair", zone: "Andaman Islands" },
  { lat: 10.57, lon: 72.64, name: "Kavaratti", zone: "Lakshadweep Islands" }
];

// In-Memory Real Weather Cache
let cachedWeatherGrid = null;
let lastFetchTimestamp = 0;
const CACHE_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes cache

// Forecast Horizon Offsets (hours from current time)
export const FORECAST_OFFSETS = [
  { index: 0, label: "NOW", offsetHours: 0, isLive: true },
  { index: 1, label: "+1H", offsetHours: 1, isLive: false },
  { index: 2, label: "+2H", offsetHours: 2, isLive: false },
  { index: 3, label: "+3H", offsetHours: 3, isLive: false },
  { index: 4, label: "+6H", offsetHours: 6, isLive: false },
  { index: 5, label: "+9H", offsetHours: 9, isLive: false },
  { index: 6, label: "+12H", offsetHours: 12, isLive: false },
  { index: 7, label: "+24H", offsetHours: 24, isLive: false }
];

/**
 * Returns India GeoJSON boundary for Canvas clipping
 */
export function getIndiaBoundary() {
  return indiaBoundaryData;
}

/**
 * Mathematical Meteorological Wind Vector conversion:
 * Direction theta is in degrees from North (clockwise).
 * Meteorological convention: wind blowing FROM theta.
 * u = -speed * sin(theta_rad) (Eastward component)
 * v = -speed * cos(theta_rad) (Northward component)
 */
export function convertWindToVector(speedKmh, directionDeg) {
  const rad = ((directionDeg % 360) * Math.PI) / 180;
  // Convert km/h to m/s for standard velocity (1 m/s = 3.6 km/h)
  const speedMs = (speedKmh || 0) / 3.6;
  const u = -speedMs * Math.sin(rad);
  const v = -speedMs * Math.cos(rad);
  return {
    speedKmh: Number(speedKmh.toFixed(1)),
    speedMs: Number(speedMs.toFixed(2)),
    directionDeg: Math.round(directionDeg),
    u: Number(u.toFixed(2)),
    v: Number(v.toFixed(2))
  };
}

/**
 * Temperature Color Ramp
 */
export const TEMPERATURE_STOPS = [
  { temp: 5, r: 30, g: 58, b: 138 },    // Deep royal blue (< 10°C)
  { temp: 15, r: 37, g: 99, b: 235 },   // Blue (15°C)
  { temp: 22, r: 6, g: 182, b: 212 },   // Cyan (22°C)
  { temp: 27, r: 16, g: 185, b: 129 },  // Emerald green (27°C)
  { temp: 32, r: 234, g: 179, b: 8 },   // Amber yellow (32°C)
  { temp: 37, r: 249, g: 115, b: 22 },  // Hot orange (37°C)
  { temp: 42, r: 239, g: 68, b: 68 },   // Very hot red (42°C)
  { temp: 48, r: 126, g: 34, b: 206 }   // Extreme crimson-purple (> 45°C)
];

export function getTemperatureRgb(temp) {
  if (temp <= TEMPERATURE_STOPS[0].temp) {
    const s = TEMPERATURE_STOPS[0];
    return [s.r, s.g, s.b];
  }
  const last = TEMPERATURE_STOPS[TEMPERATURE_STOPS.length - 1];
  if (temp >= last.temp) {
    return [last.r, last.g, last.b];
  }

  for (let i = 0; i < TEMPERATURE_STOPS.length - 1; i++) {
    const s1 = TEMPERATURE_STOPS[i];
    const s2 = TEMPERATURE_STOPS[i + 1];
    if (temp >= s1.temp && temp <= s2.temp) {
      const t = (temp - s1.temp) / (s2.temp - s1.temp);
      return [
        Math.round(s1.r + (s2.r - s1.r) * t),
        Math.round(s1.g + (s2.g - s1.g) * t),
        Math.round(s1.b + (s2.b - s1.b) * t)
      ];
    }
  }
  return [234, 179, 8];
}

/**
 * Precipitation Intensity Color Ramp (mm/h)
 */
export function getPrecipitationRgb(mmh) {
  if (mmh <= 0.05) return null; // Transparent / dry
  if (mmh < 1.0) return [56, 189, 248];   // Light drizzle (sky blue)
  if (mmh < 3.5) return [37, 99, 235];   // Light-to-moderate rain (blue)
  if (mmh < 8.0) return [30, 64, 175];   // Moderate steady rain (deep blue)
  if (mmh < 15.0) return [139, 92, 246]; // Heavy rain (violet)
  if (mmh < 25.0) return [236, 72, 153]; // Intense tropical downpour (pink)
  return [239, 68, 68];                  // Extreme convective cloudburst (red)
}

/**
 * Relative Humidity Color Ramp (%)
 */
export function getHumidityRgb(humidity) {
  if (humidity < 35) return [234, 179, 8];   // Arid dry (amber)
  if (humidity < 55) return [16, 185, 129];  // Comfortable (green)
  if (humidity < 75) return [6, 182, 212];   // Humid (cyan)
  if (humidity < 90) return [37, 99, 235];   // Very humid (blue)
  return [30, 58, 138];                      // Saturated (deep blue)
}

/**
 * Atmospheric Pressure Color Ramp (hPa)
 */
export function getPressureRgb(hpa) {
  if (hpa < 1000) return [153, 27, 27];   // Deep cyclone low (deep red)
  if (hpa < 1006) return [239, 68, 68];   // Low pressure depression (red)
  if (hpa < 1012) return [234, 179, 8];   // Neutral (amber)
  if (hpa < 1018) return [59, 130, 246];  // Mild high (blue)
  return [30, 64, 175];                   // Strong anticyclone high (royal blue)
}

/**
 * Cloud Cover Color Ramp (%)
 */
export function getCloudCoverRgb(cloudPct) {
  // Grayscale with soft opacity
  const v = Math.round(240 - (cloudPct / 100) * 80);
  return [v, v, v];
}

/**
 * Fetch Full Real Meteorological Dataset for India
 * Queries Open-Meteo Weather API + Air Quality API in batch
 * Results are cached in memory for 10 minutes
 */
export async function fetchLiveMeteorologicalDataset(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedWeatherGrid && (now - lastFetchTimestamp < CACHE_LIFETIME_MS)) {
    return cachedWeatherGrid;
  }

  const coordinates = INDIA_GRID_POINTS;
  const lats = coordinates.map((c) => Number(c.lat).toFixed(2)).join(",");
  const lons = coordinates.map((c) => Number(c.lon).toFixed(2)).join(",");

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,cloud_cover,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,cloud_cover&forecast_hours=26&timezone=Asia%2FKolkata`;

  try {
    // 1. Fetch Weather Data and Air Quality in parallel
    const [weatherRes, aqiData] = await Promise.all([
      fetch(weatherUrl),
      fetchLiveBatchAqi(coordinates, forceRefresh).catch((e) => {
        console.warn("AQI batch fetch fallback:", e.message);
        return { stations: [] };
      })
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo Forecast HTTP ${weatherRes.status}`);
    }

    const weatherJson = await weatherRes.json();
    const weatherResults = Array.isArray(weatherJson) ? weatherJson : [weatherJson];

    // Align each station with weather time series and AQI
    const processedStations = coordinates.map((station, idx) => {
      const w = weatherResults[idx] || {};
      const cur = w.current || {};
      const hourly = w.hourly || {};
      const aqiItem = aqiData.stations?.[idx] || {};

      // Build hourly forecast timeline frames
      const forecastSeries = FORECAST_OFFSETS.map((fo) => {
        const hIdx = fo.offsetHours;
        const validTime = hourly.time?.[hIdx] || cur.time || new Date().toISOString();

        const temp = fo.isLive 
          ? (cur.temperature_2m ?? hourly.temperature_2m?.[0] ?? 28.0)
          : (hourly.temperature_2m?.[hIdx] ?? cur.temperature_2m ?? 28.0);

        const precip = fo.isLive
          ? (cur.precipitation ?? hourly.precipitation?.[0] ?? 0.0)
          : (hourly.precipitation?.[hIdx] ?? 0.0);

        const windSpeed = fo.isLive
          ? (cur.wind_speed_10m ?? hourly.wind_speed_10m?.[0] ?? 10.0)
          : (hourly.wind_speed_10m?.[hIdx] ?? 10.0);

        const windDir = fo.isLive
          ? (cur.wind_direction_10m ?? hourly.wind_direction_10m?.[0] ?? 270)
          : (hourly.wind_direction_10m?.[hIdx] ?? 270);

        const humidity = fo.isLive
          ? (cur.relative_humidity_2m ?? hourly.relative_humidity_2m?.[0] ?? 60)
          : (hourly.relative_humidity_2m?.[hIdx] ?? 60);

        const pressure = fo.isLive
          ? (cur.surface_pressure ?? hourly.surface_pressure?.[0] ?? 1010)
          : (hourly.surface_pressure?.[hIdx] ?? 1010);

        const cloudCover = fo.isLive
          ? (cur.cloud_cover ?? hourly.cloud_cover?.[0] ?? 20)
          : (hourly.cloud_cover?.[hIdx] ?? 20);

        const aqiVal = aqiItem.hourlyAqi?.[hIdx] ?? aqiItem.aqi ?? 75;

        const vector = convertWindToVector(windSpeed, windDir);

        return {
          frameIndex: fo.index,
          label: fo.label,
          offsetHours: fo.offsetHours,
          isLive: fo.isLive,
          validTime,
          temperature: Number(temp.toFixed(1)),
          precipitation: Number(precip.toFixed(1)),
          windSpeed: vector.speedKmh,
          windDirection: vector.directionDeg,
          u: vector.u,
          v: vector.v,
          humidity: Math.round(humidity),
          pressure: Number(pressure.toFixed(1)),
          cloudCover: Math.round(cloudCover),
          aqi: Math.round(aqiVal)
        };
      });

      return {
        lat: station.lat,
        lon: station.lon,
        name: station.name,
        zone: station.zone,
        current: forecastSeries[0],
        forecastSeries
      };
    });

    const dataset = {
      source: "Open-Meteo Operational Forecast & CPCB Air Quality",
      retrievedAt: new Date().toISOString(),
      bbox: INDIA_BBOX,
      frames: FORECAST_OFFSETS,
      stations: processedStations
    };

    cachedWeatherGrid = dataset;
    lastFetchTimestamp = now;

    return dataset;
  } catch (err) {
    console.error("[Algoriot] Live Meteorological Data fetch failed:", err);
    throw err;
  }
}

/**
 * Returns Normalized Spatial Grid for Section 9 endpoints
 * Full 2D regular geographic grid matching width * height
 */
export async function getNormalizedSpatialGrid(variable = "temperature", frameIndex = 0) {
  const dataset = await fetchLiveMeteorologicalDataset();
  const frameInfo = FORECAST_OFFSETS[frameIndex] || FORECAST_OFFSETS[0];
  const grid = getOrBuildSpatialGrid(dataset.stations, variable, frameIndex);

  const unitMap = {
    temperature: "°C",
    wind: "km/h",
    precipitation: "mm/h",
    aqi: "US AQI",
    humidity: "%",
    pressure: "hPa",
    cloudCover: "%"
  };

  return {
    source: "Open-Meteo Operational Forecast & CPCB Air Quality",
    timestamp: dataset.retrievedAt,
    valid_time: frameInfo.validTime || dataset.retrievedAt,
    is_live: frameInfo.isLive,
    timeline_label: frameInfo.label,
    variable,
    unit: unitMap[variable] || "",
    bbox: grid.bbox,
    width: grid.width,
    height: grid.height,
    latitudes: Array.from(grid.latitudes),
    longitudes: Array.from(grid.longitudes),
    values: Array.from(grid.values),
    corners: grid.corners
  };
}

/**
 * Spatial Inverse-Distance Weighting (IDW) Interpolation
 * Evaluates real continuous value at any clicked or sampled (lat, lon)
 */
export function interpolateSpatialPoint(stations, lat, lon, frameIndex = 0) {
  if (!stations || stations.length === 0) return null;

  let sumWeights = 0;
  let weightedTemp = 0;
  let weightedPrecip = 0;
  let weightedU = 0;
  let weightedV = 0;
  let weightedAqi = 0;
  let weightedHumidity = 0;
  let weightedPressure = 0;
  let weightedClouds = 0;

  let nearestStation = null;
  let minDistanceKm = Infinity;

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    // Haversine / Euclidean approximation for distances in India
    const dLat = (s.lat - lat) * 111.0;
    const dLon = (s.lon - lon) * 111.0 * Math.cos(((lat + s.lat) * Math.PI) / 360);
    const distKm = Math.hypot(dLat, dLon);

    if (distKm < minDistanceKm) {
      minDistanceKm = distKm;
      nearestStation = s;
    }

    // Exact hit
    if (distKm < 1.0) {
      const f = s.forecastSeries[frameIndex] || s.current;
      return {
        lat,
        lon,
        nearestStation: s.name,
        distanceKm: Math.round(distKm),
        validTime: f.validTime,
        temperature: f.temperature,
        precipitation: f.precipitation,
        windSpeed: f.windSpeed,
        windDirection: f.windDirection,
        u: f.u,
        v: f.v,
        aqi: f.aqi,
        humidity: f.humidity,
        pressure: f.pressure,
        cloudCover: f.cloudCover
      };
    }

    // IDW weight with power p=2
    const w = 1.0 / (distKm * distKm);
    sumWeights += w;

    const f = s.forecastSeries[frameIndex] || s.current;
    weightedTemp += f.temperature * w;
    weightedPrecip += f.precipitation * w;
    weightedU += f.u * w;
    weightedV += f.v * w;
    weightedAqi += f.aqi * w;
    weightedHumidity += f.humidity * w;
    weightedPressure += f.pressure * w;
    weightedClouds += f.cloudCover * w;
  }

  const interpU = weightedU / sumWeights;
  const interpV = weightedV / sumWeights;
  const speedMs = Math.hypot(interpU, interpV);
  const speedKmh = Number((speedMs * 3.6).toFixed(1));
  
  // Back-calculate wind direction angle (deg)
  const dirRad = Math.atan2(-interpU, -interpV);
  const windDir = Math.round(((dirRad * 180) / Math.PI + 360) % 360);

  const f0 = stations[0]?.forecastSeries[frameIndex] || stations[0]?.current;

  return {
    lat: Number(lat.toFixed(3)),
    lon: Number(lon.toFixed(3)),
    nearestStation: nearestStation ? nearestStation.name : "Regional AWS",
    distanceKm: Math.round(minDistanceKm),
    validTime: f0?.validTime || new Date().toISOString(),
    temperature: Number((weightedTemp / sumWeights).toFixed(1)),
    precipitation: Number(Math.max(0, (weightedPrecip / sumWeights)).toFixed(1)),
    windSpeed: speedKmh,
    windDirection: windDir,
    u: Number(interpU.toFixed(2)),
    v: Number(interpV.toFixed(2)),
    aqi: Math.round(weightedAqi / sumWeights),
    humidity: Math.round(weightedHumidity / sumWeights),
    pressure: Number((weightedPressure / sumWeights).toFixed(1)),
    cloudCover: Math.round(weightedClouds / sumWeights)
  };
}

/**
 * Helper to fetch hybrid multi-model weights from backend /api/v1/models
 */
export async function fetchHybridModelInfo() {
  const { baseUrl } = getApiConfig();
  try {
    const res = await fetch(`${baseUrl}/models`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      available: false,
      message: "Hybrid model telemetry offline on backend"
    };
  }
}

/**
 * Live Open-Meteo Batch Ingest for Locations List in Context
 */
export async function fetchLiveOpenMeteoStations(locations = []) {
  if (!locations || locations.length === 0) return { data: [] };

  const lats = locations.map((l) => Number(l.lat).toFixed(2)).join(",");
  const lons = locations.map((l) => Number(l.lon).toFixed(2)).join(",");

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&timezone=Asia%2FKolkata`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const results = await res.json();
    const list = Array.isArray(results) ? results : [results];

    const updated = locations.map((loc, idx) => {
      const cur = list[idx]?.current;
      if (!cur) return loc;

      const temp = Number(cur.temperature_2m?.toFixed(1) ?? loc.baseWeather.temperature);
      const hum = Math.round(cur.relative_humidity_2m ?? loc.baseWeather.humidity);
      const wspd = Math.round(cur.wind_speed_10m ?? loc.baseWeather.windSpeed);
      const wdir = cur.wind_direction_10m ?? 270;
      const pres = Math.round(cur.surface_pressure ?? loc.baseWeather.pressure);
      const precip = Number(cur.precipitation?.toFixed(1) ?? loc.baseWeather.precipitation);

      return {
        ...loc,
        baseWeather: {
          ...loc.baseWeather,
          temperature: temp,
          feelsLike: Number((temp + 2.0).toFixed(1)),
          humidity: hum,
          windSpeed: wspd,
          windDirection: `${Math.round(wdir)}°`,
          pressure: pres,
          precipitation: precip,
          lastUpdated: cur.time || new Date().toISOString()
        }
      };
    });

    return { data: updated };
  } catch (err) {
    console.warn("fetchLiveOpenMeteoStations network error:", err.message);
    return { data: locations };
  }
}

/**
 * Compatibility helper for existing heatmap references
 */
export async function getIndiaTemperatureGrid() {
  const dataset = await fetchLiveMeteorologicalDataset();
  return dataset.stations.map((s) => ({
    lat: s.lat,
    lon: s.lon,
    name: s.name,
    temperature: s.current.temperature
  }));
}

/**
 * Temperature styling & category utilities
 */
export function getTemperatureColor(temp, opacity = 1.0) {
  const [r, g, b] = getTemperatureRgb(temp);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function getTemperatureCategory(temp) {
  if (temp < 18) return { label: "Cool", class: "text-blue-700 bg-blue-50 border-blue-200" };
  if (temp < 26) return { label: "Pleasant", class: "text-teal-700 bg-teal-50 border-teal-200" };
  if (temp < 33) return { label: "Warm", class: "text-amber-700 bg-amber-50 border-amber-200" };
  if (temp < 40) return { label: "Hot", class: "text-orange-700 bg-orange-50 border-orange-200" };
  return { label: "Severe Heat", class: "text-red-700 bg-red-50 border-red-200 font-bold" };
}

export function getLocationForecastAtStep(location, timelineStep = "NOW") {
  if (!location) return null;
  return {
    weather: location.baseWeather,
    step: timelineStep,
    isLive: timelineStep === "NOW"
  };
}

