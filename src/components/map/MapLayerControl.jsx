import React, { useState } from "react";
import { Layers, Check, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Clean Map Layer Selector for ALGORIOT Weather Command Center
 */
export function MapLayerControl({
  layers = {
    heatmap: true,
    cityMarkers: true,
    weatherOverlay: false,
    extremeZones: false,
    uncertainty: false
  },
  onToggleLayer
}) {
  const [isOpen, setIsOpen] = useState(false);

  const layerItems = [
    {
      id: "heatmap",
      label: "Temperature Heatmap",
      desc: "Spatially continuous 0.5° meteorological thermal grid",
      active: layers.heatmap
    },
    {
      id: "cityMarkers",
      label: "City Temperatures",
      desc: "Surface observation stations with lead-time telemetry",
      active: layers.cityMarkers
    },
    {
      id: "weatherOverlay",
      label: "Weather / Forecast Overlay",
      desc: "Convective precipitation & synoptic streamline advection",
      active: layers.weatherOverlay
    },
    {
      id: "extremeZones",
      label: "Extreme Weather",
      desc: "Heatwave domes, squalls & localized flash inundation zones",
      active: layers.extremeZones
    },
    {
      id: "uncertainty",
      label: "Uncertainty & Model Spread",
      desc: "Multi-model standard deviation envelope across India",
      active: layers.uncertainty
    }
  ];

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-md text-xs pointer-events-auto select-none min-w-[210px] sm:min-w-[240px]">
      {/* Header bar toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-slate-800 hover:text-[#0b3d91] font-bold transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#0b3d91]" />
          <span className="uppercase tracking-wider text-[11px]">Map Layers</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0b3d91] text-[10px] font-bold">
            {activeCount}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Layer list */}
      {isOpen && (
        <div className="p-2 pt-0 border-t border-slate-100 space-y-1">
          {layerItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleLayer(item.id)}
              className={`w-full text-left p-2 rounded-md transition-all flex items-start gap-2.5 cursor-pointer ${
                item.active
                  ? "bg-blue-50/70 border border-blue-200 text-slate-900"
                  : "hover:bg-slate-50 border border-transparent text-slate-600"
              }`}
            >
              <div
                className={`mt-0.5 w-3.5 h-3.5 rounded flex items-center justify-center transition-colors border ${
                  item.active
                    ? "bg-[#0b3d91] border-[#0b3d91] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {item.active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                  <span>{item.label}</span>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
