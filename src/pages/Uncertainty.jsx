import React from "react";
import { UncertaintyBands } from "../components/uncertainty/UncertaintyBands.jsx";
import { LocationSelector } from "../components/weather/LocationSelector.jsx";
import { Compass, HelpCircle } from "lucide-react";
import { useWeather } from "../context/WeatherContext.jsx";

export function Uncertainty() {
  const { openExplainModal } = useWeather();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <Compass className="w-4 h-4 text-[#0b3d91]" />
            <span>Probabilistic Calibration Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            FORECAST UNCERTAINTY & CONFORMAL CALIBRATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Quantifying meteorological chaos with distribution-free prediction bands and Brier-score reliability.
          </p>
        </div>

        <button
          onClick={openExplainModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0b3d91] hover:bg-[#082a66] text-white text-xs font-semibold transition-colors self-start md:self-auto cursor-pointer shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-white" />
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
