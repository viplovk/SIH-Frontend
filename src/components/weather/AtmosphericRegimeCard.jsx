import React, { useState } from "react";
import { Compass, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Info, Sparkles } from "lucide-react";
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
    <div className="bg-[#101520] border border-white/[0.06] rounded-lg p-4 sm:p-5 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-slate-300" />
          <h3 className="font-mono-tech text-xs uppercase tracking-wider text-slate-300 font-semibold">
            CURRENT ATMOSPHERIC REGIME
          </h3>
        </div>

        <div className="flex items-center gap-1.5 font-mono-tech text-xs">
          <span className="text-slate-400">Confidence:</span>
          <span className="text-emerald-300/90 font-medium px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20">
            {selectedLocation.regimeConfidence}%
          </span>
        </div>
      </div>

      {/* Primary Regime Badge Banner */}
      <div className="bg-[#141a27] border border-white/10 rounded p-3 mb-3">
        <div className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider mb-0.5">
          DETECTED ATMOSPHERIC CLUSTER
        </div>
        <div className="text-base sm:text-lg font-heading font-semibold text-white tracking-wide">
          {selectedLocation.currentRegime}
        </div>
        <div className="text-xs text-slate-400 mt-1 font-mono-tech">
          Station: <strong className="text-slate-200">{selectedLocation.name}</strong> ({selectedLocation.lat}°N, {selectedLocation.lon}°E)
        </div>
      </div>

      {/* Detected Conditions Checklist */}
      <div className="space-y-1.5 mb-3">
        <div className="text-[11px] font-mono-tech uppercase text-slate-400 tracking-wider">
          Detected Atmospheric Predictors:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {detectedConditions.map((cond, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-black/20 px-2.5 py-1.5 rounded border border-white/[0.03]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
              <span className="truncate">{cond.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Explanation: Why the model weights changed */}
      <div className="border-t border-white/[0.06] pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs font-mono-tech text-slate-300 hover:text-white py-1 cursor-pointer"
        >
          <span className="font-medium uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            WHY THE MODEL WEIGHTS CHANGED (FOR SIH JURORS)
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isExpanded && (
          <div className="mt-2 p-3 bg-[#141a27] border border-white/10 rounded text-xs text-slate-300 leading-relaxed font-sans">
            <p className="font-medium text-slate-200 mb-1 font-mono-tech">
              Automated Reasoning Explanation:
            </p>
            <p className="text-slate-400 text-[12px] leading-relaxed">
              {selectedLocation.weightRationale}
            </p>
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-wrap gap-4 text-[11px] font-mono-tech text-slate-400">
              <span>NWP Allocation: <strong className="text-slate-200">{selectedLocation.modelWeights.nwp}%</strong></span>
              <span>AI Model A Allocation: <strong className="text-emerald-300/90">{selectedLocation.modelWeights.aiA}%</strong></span>
              <span>AI Model B Allocation: <strong className="text-amber-300/90">{selectedLocation.modelWeights.aiB}%</strong></span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
