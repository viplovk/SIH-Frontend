import React from "react";
import { UncertaintyBands } from "../components/uncertainty/UncertaintyBands.jsx";
import { LocationSelector } from "../components/weather/LocationSelector.jsx";
import { Compass, HelpCircle, ShieldCheck } from "lucide-react";
import { useWeather } from "../context/WeatherContext.jsx";

export function Uncertainty() {
  const { openExplainModal } = useWeather();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
              FORECAST UNCERTAINTY & CONFORMAL CALIBRATION
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Quantifying meteorological chaos with distribution-free prediction bands and Brier-score reliability.
          </p>
        </div>

        <button
          onClick={openExplainModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono-tech hover:bg-cyan-500/30 transition-colors self-start md:self-auto cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Audit Confidence Math</span>
        </button>
      </div>

      {/* Location Selector */}
      <LocationSelector />

      {/* Uncertainty Suite */}
      <UncertaintyBands />

    </div>
  );
}
