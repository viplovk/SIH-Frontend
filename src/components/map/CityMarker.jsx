import L from "leaflet";

/**
 * Creates subtle, refined secondary station markers for Leaflet.
 * Ensures the continuous meteorological fields remain the primary visual hero.
 */
export function createCityDivIcon(station, isSelected = false, activeValue = null, unit = "") {
  const displayVal = activeValue != null ? `${activeValue}${unit}` : "";

  const html = `
    <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-150 ${
      isSelected ? "scale-110 z-50" : "hover:scale-105 z-30"
    }">
      <!-- Small pin centroid -->
      <div class="relative flex items-center justify-center">
        <div class="w-2.5 h-2.5 rounded-full ${
          isSelected ? "bg-[#0b3d91] ring-3 ring-blue-300 ring-opacity-70" : "bg-slate-800 border border-white"
        } shadow-xs"></div>
        ${isSelected ? '<span class="absolute -inset-1 rounded-full bg-blue-500 animate-ping opacity-30"></span>' : ""}
      </div>

      <!-- City Label & value badge -->
      <div class="mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs border border-slate-300 shadow-xs pointer-events-none whitespace-nowrap">
        <span class="text-[10px] font-bold text-slate-800 tracking-tight">${station.name}</span>
        ${
          displayVal
            ? `<span class="text-[9px] font-mono font-bold text-[#0b3d91] bg-blue-50 px-1 rounded">${displayVal}</span>`
            : ""
        }
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "algoriot-secondary-city-icon",
    iconSize: [64, 30],
    iconAnchor: [32, 5],
    popupAnchor: [0, -10]
  });
}

/**
 * Builds clean popover for station orientation
 */
export function buildCityPopupHtml(station, weather) {
  if (!weather) return `<div class="p-2 text-xs">Loading station data...</div>`;

  return `
    <div class="p-1 font-sans text-slate-800 select-none min-w-[210px]">
      <div class="border-b border-slate-200 pb-1.5 mb-2">
        <div class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Meteorological Station</div>
        <h4 class="text-sm font-extrabold text-slate-900">${station.name}</h4>
        <div class="text-[10px] text-slate-500">${station.lat.toFixed(2)}°N, ${station.lon.toFixed(2)}°E</div>
      </div>
      <div class="grid grid-cols-2 gap-1.5 text-[11px] mb-2 bg-slate-50 p-1.5 rounded">
        <div>
          <span class="text-[9px] text-slate-400 uppercase font-bold block">TEMP</span>
          <span class="font-bold text-slate-900">${weather.temperature ?? "--"}°C</span>
        </div>
        <div>
          <span class="text-[9px] text-slate-400 uppercase font-bold block">WIND</span>
          <span class="font-bold text-slate-900">${weather.windSpeed ?? "--"} km/h</span>
        </div>
        <div>
          <span class="text-[9px] text-slate-400 uppercase font-bold block">PRECIP</span>
          <span class="font-bold text-slate-900">${weather.precipitation ?? "0"} mm/h</span>
        </div>
        <div>
          <span class="text-[9px] text-slate-400 uppercase font-bold block">AIR QUALITY</span>
          <span class="font-bold text-slate-900">AQI ${weather.aqi ?? "--"}</span>
        </div>
      </div>
      <div class="text-[9px] text-slate-400 flex items-center justify-between">
        <span>Source: Open-Meteo</span>
        <span>Valid: ${weather.validTime ? weather.validTime.split("T")[1]?.slice(0, 5) : "NOW"}</span>
      </div>
    </div>
  `;
}
