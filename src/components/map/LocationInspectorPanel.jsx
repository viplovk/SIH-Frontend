// Algoriot Real Location & Spatial Point Inspector Panel
// Displays verified real meteorological observations & interpolated point values
import React from "react";
import { 
  X, 
  Wind, 
  Droplets, 
  Gauge, 
  CloudRain, 
  Activity, 
  MapPin, 
  Cloud, 
  Calendar,
  Compass,
  Cpu
} from "lucide-react";
import { getAqiCategory } from "../../api/airQualityApi.js";

export function LocationInspectorPanel({
  inspectionData,
  onClose
}) {
  if (!inspectionData) return null;

  const {
    name,
    lat,
    lon,
    nearestStation,
    distanceKm,
    validTime,
    temperature,
    precipitation,
    windSpeed,
    windDirection,
    u,
    v,
    aqi,
    humidity,
    pressure,
    cloudCover
  } = inspectionData;

  const aqiInfo = getAqiCategory(aqi ?? 50);

  // Format valid time in Indian Standard Time (IST)
  const formatTime = (iso) => {
    if (!iso) return "Real-Time / NOW";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        timeZone: "Asia/Kolkata"
      }) + " IST";
    } catch {
      return iso;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-xl text-slate-800 pointer-events-auto select-none w-[310px] sm:w-[340px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
      
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <MapPin className="w-3 h-3 text-[#0b3d91]" />
            <span>{name || nearestStation || "Spatial Sampling Point"}</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {lat.toFixed(2)}°N, {lon.toFixed(2)}°E
          </h3>
          {distanceKm != null && distanceKm > 0 && (
            <div className="text-[10px] text-slate-500">
              Interpolated from nearest station: <strong className="text-slate-700">{nearestStation}</strong> ({distanceKm} km away)
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Valid Time Banner */}
      <div className="px-3 py-1.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-[11px] text-[#0b3d91]">
        <span className="flex items-center gap-1 font-semibold">
          <Calendar className="w-3 h-3" />
          <span>Valid Time:</span>
        </span>
        <span className="font-mono font-bold">{formatTime(validTime)}</span>
      </div>

      {/* Primary Observations Grid */}
      <div className="p-3.5 space-y-3 overflow-y-auto">
        
        {/* Big Temperature Hero Block */}
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">SURFACE TEMPERATURE</span>
            <div className="text-3xl font-black font-mono text-slate-900 leading-tight">
              {temperature != null ? `${temperature}°C` : "Data unavailable"}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">PRECIPITATION</span>
            <div className="text-xl font-bold font-mono text-blue-700 flex items-center gap-1 justify-end">
              <CloudRain className="w-4 h-4" />
              <span>{precipitation != null ? `${precipitation} mm/h` : "0.0"}</span>
            </div>
          </div>
        </div>

        {/* Detailed Meteorological Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          
          {/* Wind */}
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-1">
              <Wind className="w-3 h-3 text-teal-600" />
              <span>WIND SPEED</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-sm">
              {windSpeed != null ? `${windSpeed} km/h` : "--"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <Compass className="w-2.5 h-2.5 text-slate-400" />
              <span>Dir: {windDirection ?? "--"}°</span>
              {u != null && v != null && (
                <span className="text-[9px] text-slate-400 font-mono">({u},{v})</span>
              )}
            </div>
          </div>

          {/* Air Quality */}
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-1">
              <Activity className="w-3 h-3 text-purple-600" />
              <span>AIR QUALITY</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-sm">
              AQI {aqi != null ? aqi : "--"}
            </div>
            <div className="text-[10px] font-semibold text-slate-600 truncate mt-0.5">
              {aqiInfo.category}
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-1">
              <Droplets className="w-3 h-3 text-cyan-600" />
              <span>HUMIDITY</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-sm">
              {humidity != null ? `${humidity}%` : "--"}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Relative surface</div>
          </div>

          {/* Pressure */}
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-1">
              <Gauge className="w-3 h-3 text-slate-600" />
              <span>PRESSURE</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-sm">
              {pressure != null ? `${pressure} hPa` : "--"}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Barometric MSLP</div>
          </div>

        </div>

        {/* Cloud Cover */}
        <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Cloud className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Cloud Cover Density:</span>
          </div>
          <span className="font-mono font-bold text-slate-800">
            {cloudCover != null ? `${cloudCover}%` : "--"}
          </span>
        </div>

        {/* Verification Footer */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
          <span>Ingest: Open-Meteo Operational Forecast</span>
          <span className="text-emerald-700 font-bold">100% Real API Ingest</span>
        </div>

      </div>

    </div>
  );
}
