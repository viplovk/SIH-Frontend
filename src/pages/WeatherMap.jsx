import React from "react";
import { IndiaWeatherMap } from "../components/map/IndiaWeatherMap.jsx";
import { LocationSelector } from "../components/weather/LocationSelector.jsx";
import { useWeather } from "../context/WeatherContext.jsx";
import { MapPin, Compass, Info, Radio, ShieldAlert } from "lucide-react";

export function WeatherMap() {
  const { selectedLocation, setSelectedLocation, locationsList, activeVariable, timelineStep } = useWeather();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">
              SYNOPTIC RADAR & NUMERICAL GRID VIEWER
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Geospatial multi-model visualization across Indian meteorological radar stations and climate zones.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-tech text-xs">
          <span className="text-slate-400">Projection:</span>
          <span className="text-cyan-300 font-bold bg-[#111622] px-2.5 py-1 rounded border border-white/[0.08]">
            EPSG:3857 (WGS 84 / Pseudo-Mercator)
          </span>
        </div>
      </div>

      {/* Quick Jump Station Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono-tech">
        <span className="text-slate-400 uppercase text-[11px] mr-1 hidden sm:inline">
          Radar Hubs:
        </span>
        {locationsList.map((loc) => {
          const isSelected = loc.id === selectedLocation.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_#38bdf8]"
                  : "bg-[#111622] text-slate-300 hover:text-white border border-white/[0.06]"
              }`}
            >
              {loc.name}
            </button>
          );
        })}
      </div>

      {/* Main Full-Size Map Component */}
      <IndiaWeatherMap standalone={true} />

      {/* Technical Station Telemetry Strip */}
      <div className="bg-[#111622] border border-white/[0.08] rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono-tech">
        <div>
          <span className="text-slate-500 uppercase text-[10px] block">ACTIVE RADAR STATION</span>
          <span className="text-white font-bold">{selectedLocation.name} ({selectedLocation.radarStation})</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase text-[10px] block">COORDINATES</span>
          <span className="text-cyan-300">{selectedLocation.lat}°N / {selectedLocation.lon}°E</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase text-[10px] block">TERRAIN / ELEVATION</span>
          <span className="text-slate-200">{selectedLocation.terrain} ({selectedLocation.elevation}m)</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase text-[10px] block">CLASSIFIED REGIME</span>
          <span className="text-emerald-400 font-bold">{selectedLocation.currentRegime}</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase text-[10px] block">DYNAMIC WEIGHTS</span>
          <span className="text-slate-300">NWP {selectedLocation.modelWeights.nwp}% | AI-A {selectedLocation.modelWeights.aiA}%</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase text-[10px] block">LEAD TIME POSITION</span>
          <span className="text-amber-400 font-bold">{timelineStep}</span>
        </div>
      </div>

    </div>
  );
}
