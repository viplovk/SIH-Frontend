// Map Data and Meteorological Grid API
// Supports both offline/mock simulation and real Open-Meteo integration
import indiaBoundaryData from "../data/india/india-boundary.json";
import indiaGridData from "../data/india/india-grid.json";
import { LOCATIONS } from "../data/locations.js";
import { isMockModeActive } from "./client.js";

/**
 * Temperature Color Scale
 * < 20°C       → cool (blue/cyan)
 * 20–25°C      → mild (teal/green)
 * 25–30°C      → warm (yellow/amber)
 * 30–35°C      → hot (orange)
 * 35–40°C      → very hot (red)
 * 40°C+        → extreme (dark crimson/purple)
 */
const COLOR_STOPS = [
  { temp: 12, r: 30, g: 64, b: 175 },   // deep blue
  { temp: 18, r: 14, g: 165, b: 233 },  // sky cyan
  { temp: 20, r: 6, g: 182, b: 212 },   // cyan-teal
  { temp: 24, r: 16, g: 185, b: 129 },  // emerald green
  { temp: 28, r: 234, g: 179, b: 8 },   // amber yellow
  { temp: 33, r: 249, g: 115, b: 22 },  // hot orange
  { temp: 38, r: 239, g: 68, b: 68 },   // very hot red
  { temp: 42, r: 185, g: 28, b: 28 },   // severe red
  { temp: 48, r: 112, g: 26, b: 117 }   // extreme purple-crimson
];

export function getTemperatureRgb(temp) {
  if (temp <= COLOR_STOPS[0].temp) {
    const s = COLOR_STOPS[0];
    return [s.r, s.g, s.b];
  }
  if (temp >= COLOR_STOPS[COLOR_STOPS.length - 1].temp) {
    const s = COLOR_STOPS[COLOR_STOPS.length - 1];
    return [s.r, s.g, s.b];
  }

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const s1 = COLOR_STOPS[i];
    const s2 = COLOR_STOPS[i + 1];
    if (temp >= s1.temp && temp <= s2.temp) {
      const t = (temp - s1.temp) / (s2.temp - s1.temp);
      const r = Math.round(s1.r + (s2.r - s1.r) * t);
      const g = Math.round(s1.g + (s2.g - s1.g) * t);
      const b = Math.round(s1.b + (s2.b - s1.b) * t);
      return [r, g, b];
    }
  }
  return [234, 179, 8];
}

export function getTemperatureColor(temp, alpha = 1.0) {
  const [r, g, b] = getTemperatureRgb(temp);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getTemperatureCategory(temp) {
  if (temp < 20) return { label: "Cool", class: "text-blue-700 bg-blue-50 border-blue-200" };
  if (temp < 25) return { label: "Mild", class: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (temp < 30) return { label: "Warm", class: "text-amber-700 bg-amber-50 border-amber-200" };
  if (temp < 35) return { label: "Hot", class: "text-orange-700 bg-orange-50 border-orange-200" };
  if (temp < 40) return { label: "Very Hot", class: "text-rose-700 bg-rose-50 border-rose-200" };
  return { label: "Extreme", class: "text-purple-800 bg-purple-50 border-purple-200" };
}

/**
 * Returns India GeoJSON boundary
 */
export function getIndiaBoundary() {
  return indiaBoundaryData;
}

/**
 * Returns India grid with temperatures evaluated for the chosen timeline step
 */
export function getIndiaTemperatureGrid(timelineStep = "NOW") {
  return indiaGridData.map((cell) => {
    const temp = cell.forecasts?.[timelineStep] ?? cell.baseTemp;
    return {
      lat: cell.lat,
      lon: cell.lon,
      elevation: cell.elevation,
      zone: cell.zone,
      temperature: temp,
      color: getTemperatureColor(temp, 0.75)
    };
  });
}

/**
 * Computes location forecast state at the selected timeline step
 */
export function getLocationForecastAtStep(location, timelineStep = "NOW") {
  if (!location) return null;
  const base = location.baseWeather || {};
  const baseTemp = base.temperature || 30.0;

  // Realistic diurnal & synoptic variation factors for timeline steps
  const stepOffsets = {
    "NOW": { temp: 0.0, feels: 0.0, humid: 0, wind: 0, precip: 0 },
    "+3H": { temp: 1.4, feels: 1.8, humid: -4, wind: 1.5, precip: 5 },
    "+6H": { temp: 2.8, feels: 3.4, humid: -8, wind: 3.2, precip: 12 },
    "+12H": { temp: -2.2, feels: -1.9, humid: 8, wind: -2.0, precip: -4 },
    "+24H": { temp: 0.4, feels: 0.6, humid: 1, wind: 0.5, precip: 2 },
    "+48H": { temp: -0.8, feels: -0.5, humid: 4, wind: -1.2, precip: -6 },
    "+72H": { temp: 1.2, feels: 1.5, humid: -2, wind: 1.0, precip: 8 }
  };

  const offset = stepOffsets[timelineStep] || stepOffsets["NOW"];
  const temp = Number((baseTemp + offset.temp).toFixed(1));
  const feelsLike = Number(((base.feelsLike || baseTemp + 2) + offset.feels).toFixed(1));
  const humidity = Math.min(99, Math.max(20, (base.humidity || 65) + offset.humid));
  const windSpeed = Number((Math.max(2, (base.windSpeed || 12) + offset.wind)).toFixed(1));
  const pressure = Number(((base.pressure || 1008) - (offset.temp * 0.4)).toFixed(1));

  let condition = "Partly Cloudy";
  if (temp >= 38) condition = "Intense Heatwave";
  else if (base.precipitation > 70) condition = "Heavy Monsoon Rain";
  else if (base.precipitation > 40) condition = "Scattered Showers";
  else if (temp < 20) condition = "Alpine Cool / Clear";
  else if (humidity > 80) condition = "Tropical Humid";

  return {
    ...location,
    currentStep: timelineStep,
    weather: {
      temperature: temp,
      feelsLike,
      humidity,
      windSpeed,
      windDirection: base.windDirection || "W (270°)",
      pressure,
      condition,
      precipitation: Math.min(100, Math.max(0, (base.precipitation || 30) + offset.precip)),
      uvIndex: base.uvIndex || 7,
      airQualityIndex: base.airQualityIndex || 85
    }
  };
}

/**
 * Batch fetch for real live data via Open-Meteo free API
 * Used when VITE_USE_MOCK_DATA is false or live data requested
 */
export async function fetchLiveOpenMeteoStations(locations = LOCATIONS) {
  if (isMockModeActive()) {
    return { isLive: false, data: locations };
  }

  try {
    const lats = locations.map((l) => l.lat).join(",");
    const lons = locations.map((l) => l.lon).join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo status: ${res.status}`);
    
    const json = await res.json();
    const results = Array.isArray(json) ? json : [json];

    const updatedLocations = locations.map((loc, idx) => {
      const liveItem = results[idx]?.current;
      if (!liveItem) return loc;

      return {
        ...loc,
        baseWeather: {
          ...loc.baseWeather,
          temperature: liveItem.temperature_2m,
          feelsLike: Number((liveItem.temperature_2m + 2.1).toFixed(1)),
          humidity: liveItem.relative_humidity_2m,
          pressure: liveItem.surface_pressure,
          windSpeed: liveItem.wind_speed_10m
        }
      };
    });

    return { isLive: true, data: updatedLocations };
  } catch (err) {
    console.warn("[Algoriot] Live Open-Meteo fetch failed, using calibrated simulation:", err.message);
    return { isLive: false, data: locations };
  }
}
