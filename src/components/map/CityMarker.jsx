import L from "leaflet";
import { getTemperatureColor, getTemperatureRgb } from "../../api/mapApi.js";

/**
 * Creates custom HTML DivIcon for Leaflet station marker
 */
export function createCityDivIcon(location, currentForecast, isSelected) {
  const temp = currentForecast?.weather?.temperature ?? location.baseWeather.temperature;
  const [r, g, b] = getTemperatureRgb(temp);

  const html = `
    <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-150 ${
      isSelected ? "scale-110 z-50" : "hover:scale-105 z-30"
    }">
      <!-- Outer pulse ring if focused -->
      ${
        isSelected
          ? `<div class="absolute -inset-1 rounded-full animate-ping opacity-30" style="background: rgb(${r}, ${g}, ${b});"></div>`
          : ""
      }
      
      <!-- Temperature Badge pill -->
      <div 
        class="flex items-center gap-1 px-1.5 py-0.5 rounded-full shadow-md text-[11px] font-bold font-mono-tech text-white border border-white/90 whitespace-nowrap"
        style="background: rgb(${r}, ${g}, ${b});"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-white opacity-90"></span>
        <span>${Math.round(temp)}°</span>
      </div>

      <!-- City name label -->
      <div class="mt-0.5 px-1.5 py-0.2 bg-white/90 backdrop-blur-xs border border-slate-300 rounded shadow-2xs text-[10px] font-bold text-slate-900 tracking-tight whitespace-nowrap pointer-events-none">
        ${location.name}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "algoriot-city-div-icon",
    iconSize: [60, 42],
    iconAnchor: [30, 20],
    popupAnchor: [0, -22]
  });
}

/**
 * Builds rich, institutional scientific popup HTML for station inspection
 */
export function buildCityPopupHtml(location, currentForecast, timelineStep = "NOW") {
  const weather = currentForecast?.weather || location.baseWeather || {};
  const temp = weather.temperature ?? location.baseWeather.temperature;
  const feelsLike = weather.feelsLike ?? (temp + 2.5);
  const humidity = weather.humidity ?? location.baseWeather.humidity;
  const windSpeed = weather.windSpeed ?? location.baseWeather.windSpeed;
  const windDirection = weather.windDirection ?? location.baseWeather.windDirection ?? "W (270°)";
  const pressure = weather.pressure ?? location.baseWeather.pressure ?? 1008;
  const condition = weather.condition ?? "Observation Active";
  const weights = location.modelWeights || { nwp: 50, aiA: 35, aiB: 15 };
  const alert = location.extremeAlert;

  const tempColor = getTemperatureColor(temp, 1.0);

  return `
    <div class="p-1 font-sans text-slate-800 select-none max-w-[280px]">
      <!-- Header -->
      <div class="flex items-start justify-between border-b border-slate-200 pb-2 mb-2.5">
        <div>
          <div class="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            ${location.state || "India"} • ${location.elevation || 100}m ASL
          </div>
          <h3 class="text-base font-extrabold text-slate-900 tracking-tight">
            ${location.name}
          </h3>
          <div class="text-[10px] text-slate-600 mt-0.5 font-medium">
            ${location.radarStation || "Surface Observation Hub"}
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-black font-mono-tech leading-none" style="color: ${tempColor};">
            ${temp}°C
          </div>
          <div class="text-[10px] text-slate-500 font-medium mt-1">
            Feels ${feelsLike}°C
          </div>
        </div>
      </div>

      <!-- Forecast lead-time & condition banner -->
      <div class="flex items-center justify-between bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] mb-2.5">
        <span class="font-bold text-slate-700">${condition}</span>
        <span class="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-blue-100 text-[#0b3d91] font-bold">
          LEAD: T${timelineStep}
        </span>
      </div>

      <!-- Core Meteorological Telemetry Grid -->
      <div class="grid grid-cols-2 gap-1.5 text-[11px] mb-2.5 bg-slate-50/60 p-2 rounded border border-slate-100">
        <div>
          <span class="text-[9px] text-slate-400 font-bold uppercase block">RELATIVE HUMIDITY</span>
          <span class="font-bold text-slate-800 font-mono-tech">${humidity}%</span>
        </div>
        <div>
          <span class="text-[9px] text-slate-400 font-bold uppercase block">WIND VELOCITY</span>
          <span class="font-bold text-slate-800 font-mono-tech">${windSpeed} km/h</span>
          <span class="text-[9px] text-slate-500 block">${windDirection}</span>
        </div>
        <div class="mt-1">
          <span class="text-[9px] text-slate-400 font-bold uppercase block">BAROMETRIC PRESSURE</span>
          <span class="font-bold text-slate-800 font-mono-tech">${pressure} hPa</span>
        </div>
        <div class="mt-1">
          <span class="text-[9px] text-slate-400 font-bold uppercase block">ATMOSPHERIC REGIME</span>
          <span class="font-bold text-teal-800 text-[10px] truncate block" title="${location.currentRegime}">
            ${location.currentRegime ? location.currentRegime.split("/")[0].trim() : "MONSOONAL"}
          </span>
        </div>
      </div>

      <!-- Hybrid Model Allocation -->
      <div class="mb-2">
        <div class="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-semibold">
          <span>HYBRID MODEL WEIGHTS</span>
          <span class="font-mono-tech">NWP ${weights.nwp}% | AI ${weights.aiA + weights.aiB}%</span>
        </div>
        <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div style="width: ${weights.nwp}%; background-color: #0b3d91;" title="NWP IFS/GFS: ${weights.nwp}%"></div>
          <div style="width: ${weights.aiA}%; background-color: #0284c7;" title="AI Model A (FuXi): ${weights.aiA}%"></div>
          <div style="width: ${weights.aiB}%; background-color: #059669;" title="AI Model B: ${weights.aiB}%"></div>
        </div>
      </div>

      <!-- Active Threat Badge if present -->
      ${
        alert
          ? `
        <div class="mt-2 p-1.5 rounded bg-rose-50 border border-rose-200 text-[10px] text-rose-800 flex items-center justify-between">
          <span class="font-bold truncate mr-1">⚠️ ${alert.type}</span>
          <span class="font-mono-tech font-bold uppercase text-[9px] px-1 bg-rose-200 rounded text-rose-900">${alert.severity}</span>
        </div>
      `
          : ""
      }
    </div>
  `;
}
