import React, { useState } from "react";
import { 
  Layers, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Wind, 
  CloudRain, 
  Thermometer, 
  Activity, 
  Droplets, 
  Gauge, 
  Cloud, 
  Cpu, 
  MapPin,
  Sliders
} from "lucide-react";

export function MapLayerControl({
  activeLayer = "temperature",
  onSelectLayer,
  showCityMarkers = true,
  onToggleCityMarkers,
  showWindParticles = true,
  onToggleWindParticles,
  layerOpacity = 0.8,
  onChangeOpacity
}) {
  const [isOpen, setIsOpen] = useState(false);

  const primaryLayers = [
    {
      id: "temperature",
      label: "Temperature Field",
      desc: "Continuous surface thermal raster (°C)",
      icon: Thermometer,
      accent: "text-amber-600"
    },
    {
      id: "wind",
      label: "Wind Vector Field",
      desc: "Kinetic velocity streamlines & advection (km/h)",
      icon: Wind,
      accent: "text-teal-600"
    },
    {
      id: "precipitation",
      label: "Precipitation & Rain",
      desc: "Continuous rainfall intensity field (mm/h)",
      icon: CloudRain,
      accent: "text-blue-600"
    },
    {
      id: "aqi",
      label: "Air Quality (AQI)",
      desc: "CPCB / EPA particulate aerosol dispersion",
      icon: Activity,
      accent: "text-purple-600"
    },
    {
      id: "humidity",
      label: "Relative Humidity",
      desc: "Atmospheric saturation percentage (%)",
      icon: Droplets,
      accent: "text-cyan-600"
    },
    {
      id: "pressure",
      label: "Surface Pressure",
      desc: "Barometric synoptic isobar field (hPa)",
      icon: Gauge,
      accent: "text-slate-700"
    },
    {
      id: "clouds",
      label: "Cloud Cover Density",
      desc: "Optical satellite cloud density (%)",
      icon: Cloud,
      accent: "text-slate-500"
    },
    {
      id: "hybrid",
      label: "Hybrid AI-NWP Blend",
      desc: "Backend ensemble weighting & confidence",
      icon: Cpu,
      accent: "text-[#0b3d91]"
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-md text-xs pointer-events-auto select-none min-w-[230px] sm:min-w-[270px]">
      {/* Header bar toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-slate-800 hover:text-[#0b3d91] font-bold transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#0b3d91]" />
          <span className="uppercase tracking-wider text-[11px]">Meteorological Layers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase bg-blue-50 text-[#0b3d91] px-1.5 py-0.5 rounded font-bold">
            {activeLayer}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </div>
      </button>

      {/* Layer selector body */}
      {isOpen && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Active Continuous Field
          </div>

          <div className="space-y-1">
            {primaryLayers.map((l) => {
              const Icon = l.icon;
              const isSelected = activeLayer === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => {
                    onSelectLayer(l.id);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#0b3d91] text-white shadow-2xs"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : l.accent}`} />
                    <div>
                      <div className="font-bold text-[11px] leading-tight">{l.label}</div>
                      <div className={`text-[9px] ${isSelected ? "text-blue-100" : "text-slate-400"} leading-tight`}>
                        {l.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Secondary Overlays */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Overlay Controls
            </div>

            <label className="flex items-center justify-between py-1 text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3 h-3 text-teal-600" />
                <span className="text-[11px] font-medium">Wind Streamline Particles</span>
              </span>
              <input
                type="checkbox"
                checked={showWindParticles}
                onChange={(e) => onToggleWindParticles?.(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#0b3d91] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between py-1 text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#0b3d91]" />
                <span className="text-[11px] font-medium">City & Station Labels</span>
              </span>
              <input
                type="checkbox"
                checked={showCityMarkers}
                onChange={(e) => onToggleCityMarkers?.(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#0b3d91] rounded cursor-pointer"
              />
            </label>

            {/* Opacity slider */}
            <div className="pt-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-slate-400" />
                  <span>Layer Opacity</span>
                </span>
                <span className="font-mono font-bold text-slate-700">{Math.round(layerOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={layerOpacity}
                onChange={(e) => onChangeOpacity?.(parseFloat(e.target.value))}
                className="w-full accent-[#0b3d91] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
