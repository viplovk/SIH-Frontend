import React, { useState } from "react";
import { Compass, CheckCircle2, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";

export function AtmosphericRegimeCard() {
  const { selectedLocation, timelineStep } = useWeather();
  const [isExpanded, setIsExpanded] = useState(true);

  // Dynamic conditions based on current selected location
  const detectedConditions = [
    { label: "Relative humidity threshold exceeded (> 65%)", active: selectedLocation.baseWeather.humidity > 65 },
    { label: "Mesoscale convective instability & positive CAPE index", active: true },
    { label: "Elevated precipitation probability (> 50%)", active: selectedLocation.baseWeather.precipitation > 50 },
    { label: `Active forecast lead horizon: [${timelineStep}]`, active: true },
    { label: `Boundary terrain: ${selectedLocation.terrain}`, active: true }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#0b3d91]" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Atmospheric Dynamics
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              CURRENT ATMOSPHERIC REGIME
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Confidence:</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            {selectedLocation.regimeConfidence}%
          </span>
        </div>
      </div>

      {/* Primary Regime Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-md p-4 mb-4">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Identified Atmospheric Cluster
        </div>
        <div className="text-xl font-bold text-slate-900 tracking-tight">
          {selectedLocation.currentRegime}
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Station: <strong className="text-slate-900">{selectedLocation.name}</strong> ({selectedLocation.lat}°N, {selectedLocation.lon}°E) • {selectedLocation.terrain}
        </div>
      </div>

      {/* Observed Atmospheric Predictors Checklist */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
          Observed Atmospheric Indicators:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {detectedConditions.map((cond, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50/80 px-3 py-2 rounded border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{cond.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Reasoning Section */}
      <div className="border-t border-slate-200 pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 py-1 font-semibold cursor-pointer"
        >
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#0b3d91]" />
            Why Model Weights Changed (Dynamic Adaptation)
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900 mb-1">
              Automated Reasoning Explanation:
            </p>
            <p className="text-slate-600 leading-relaxed">
              {selectedLocation.weightRationale}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-mono-tech">
              <span>NWP Allocation: <strong className="text-slate-900">{selectedLocation.modelWeights.nwp}%</strong></span>
              <span>AI-A (FuXi): <strong className="text-emerald-700">{selectedLocation.modelWeights.aiA}%</strong></span>
              <span>AI-B (WeatherNext): <strong className="text-amber-700">{selectedLocation.modelWeights.aiB}%</strong></span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
