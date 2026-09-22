import React from "react";
import { IndiaWeatherMap } from "../components/map/IndiaWeatherMap.jsx";
import { useWeather } from "../context/WeatherContext.jsx";
import { Radio } from "lucide-react";

export function WeatherMap() {
  const { selectedLocation, setSelectedLocation, locationsList, timelineStep } = useWeather();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <Radio className="w-4 h-4 text-[#0b3d91]" />
            <span>Interactive Geospatial Meteorological Network</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            INDIA TEMPERATURE & WEATHER OBSERVATION MAP
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Geospatial command center featuring continuous 0.5° thermal grids, animated wind vector streamlines, Doppler radar reflectivity, NAQI dispersion, and hybrid AI-NWP model blending.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Projection:</span>
          <span className="text-slate-700 font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            EPSG:3857 (WGS 84 / Pseudo-Mercator)
          </span>
        </div>
      </div>

      {/* Quick Jump Station Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold uppercase text-[11px] mr-1 hidden sm:inline">
          Radar Hubs:
        </span>
        {locationsList.map((loc) => {
          const isSelected = loc.id === selectedLocation.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer font-medium ${
                isSelected
                  ? "bg-[#0b3d91] text-white shadow-2xs font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs shadow-xs">
        <div>
          <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">ACTIVE RADAR STATION</span>
          <span className="text-slate-900 font-bold">{selectedLocation.name} ({selectedLocation.radarStation})</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">COORDINATES</span>
          <span className="text-slate-700 font-medium">{selectedLocation.lat}°N / {selectedLocation.lon}°E</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">TERRAIN / ELEVATION</span>
          <span className="text-slate-700">{selectedLocation.terrain} ({selectedLocation.elevation}m)</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">CLASSIFIED REGIME</span>
          <span className="text-teal-800 font-bold">{selectedLocation.currentRegime}</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">DYNAMIC WEIGHTS</span>
          <span className="text-slate-700 font-medium">NWP {selectedLocation.modelWeights.nwp}% | AI-A {selectedLocation.modelWeights.aiA}%</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">LEAD TIME POSITION</span>
          <span className="text-slate-900 font-bold">{timelineStep}</span>
        </div>
      </div>

    </div>
  );
}
