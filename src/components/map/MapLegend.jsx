import React from "react";

/**
 * Professional Meteorological Temperature Legend
 * Features continuous gradient with clear temperature intervals:
 * < 20°C (cool) | 20-25°C (mild) | 25-30°C (warm) | 30-35°C (hot) | 35-40°C (very hot) | 40°C+ (extreme)
 */
export function MapLegend({ isMockMode = true, opacity = 0.75, onOpacityChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-3 shadow-md text-xs pointer-events-auto select-none min-w-[240px] sm:min-w-[280px]">
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
        <span className="font-bold tracking-wider uppercase text-[11px] text-[#0b3d91] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Surface Temperature (°C)
        </span>
        <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
          0.5° GRID
        </span>
      </div>

      {/* Continuous Gradient Bar */}
      <div className="relative mb-1.5">
        <div 
          className="h-3.5 w-full rounded-sm border border-slate-300 shadow-2xs"
          style={{
            background: "linear-gradient(to right, #1e40af 0%, #06b6d4 18%, #10b981 36%, #eab308 54%, #f97316 72%, #ef4444 88%, #881337 100%)"
          }}
        />

        {/* Ticks and numeric values */}
        <div className="flex justify-between text-[10px] font-mono-tech font-bold text-slate-700 mt-1 px-0.5">
          <span>&lt;20°</span>
          <span>20°</span>
          <span>25°</span>
          <span>30°</span>
          <span>35°</span>
          <span>40°</span>
          <span>45°+</span>
        </div>
      </div>

      {/* Categories sub-labels */}
      <div className="grid grid-cols-6 text-[9px] font-medium text-slate-500 text-center tracking-tight pb-2 border-b border-slate-100">
        <span className="text-blue-600">Cool</span>
        <span className="text-teal-600">Mild</span>
        <span className="text-amber-600">Warm</span>
        <span className="text-orange-600">Hot</span>
        <span className="text-rose-600">Very Hot</span>
        <span className="text-red-900 font-bold">Extreme</span>
      </div>

      {/* Opacity Control Slider */}
      {onOpacityChange && (
        <div className="mt-2 pt-1 flex items-center justify-between gap-3 text-[11px] text-slate-600">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Layer Opacity:
          </span>
          <div className="flex items-center gap-2 flex-1 max-w-[130px]">
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b3d91]"
            />
            <span className="text-[10px] font-mono-tech w-7 text-right font-bold text-slate-700">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Simulation / Real notice */}
      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span className="text-slate-500">Status:</span>
        <span className={`font-semibold px-1.5 py-0.2 rounded ${
          isMockMode 
            ? "text-amber-800 bg-amber-50 border border-amber-200" 
            : "text-emerald-800 bg-emerald-50 border border-emerald-200"
        }`}>
          {isMockMode ? "SIMULATED / DEMO" : "LIVE SATELLITE & AWS"}
        </span>
      </div>
    </div>
  );
}
