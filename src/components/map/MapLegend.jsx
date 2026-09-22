import React from "react";
import { 
  Thermometer, 
  Wind, 
  CloudRain, 
  Activity, 
  Droplets, 
  Gauge, 
  Cloud,
  Cpu
} from "lucide-react";

export function MapLegend({
  activeLayer = "temperature",
  dataset = null,
  frameIndex = 0
}) {
  // Calculate dynamic min/max from dataset if available
  const stats = React.useMemo(() => {
    if (!dataset || !dataset.stations) return null;
    let min = Infinity;
    let max = -Infinity;

    dataset.stations.forEach((s) => {
      const f = s.forecastSeries?.[frameIndex] || s.current;
      if (!f) return;
      let val = null;
      if (activeLayer === "temperature") val = f.temperature;
      else if (activeLayer === "precipitation") val = f.precipitation;
      else if (activeLayer === "wind") val = f.windSpeed;
      else if (activeLayer === "aqi") val = f.aqi;
      else if (activeLayer === "humidity") val = f.humidity;
      else if (activeLayer === "pressure") val = f.pressure;
      else if (activeLayer === "clouds") val = f.cloudCover;

      if (val != null) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    });

    if (min === Infinity) return null;
    return { min, max };
  }, [dataset, frameIndex, activeLayer]);

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-3 shadow-md text-xs pointer-events-auto select-none min-w-[260px] max-w-[320px]">
      
      {/* 1. TEMPERATURE */}
      {activeLayer === "temperature" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-orange-600" />
              <span>Surface Temperature</span>
            </span>
            <span className="font-mono font-bold text-[#0b3d91]">°C</span>
          </div>

          <div className="relative mb-1">
            <div 
              className="h-2.5 w-full rounded-sm border border-slate-300"
              style={{
                background: "linear-gradient(to right, #1e3a8a 0%, #3b82f6 20%, #06b6d4 38%, #10b981 55%, #eab308 72%, #f97316 88%, #dc2626 100%)"
              }}
            />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 mt-0.5 px-0.5">
              <span>&lt;15°</span>
              <span>20°</span>
              <span>25°</span>
              <span>30°</span>
              <span>35°</span>
              <span>40°+</span>
            </div>
          </div>

          {stats && (
            <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
              <span>Current India Min: <strong className="text-blue-700">{stats.min}°C</strong></span>
              <span>Max: <strong className="text-red-700">{stats.max}°C</strong></span>
            </div>
          )}
        </div>
      )}

      {/* 2. PRECIPITATION */}
      {activeLayer === "precipitation" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              <span>Precipitation Rate</span>
            </span>
            <span className="font-mono font-bold text-blue-700">mm/h</span>
          </div>

          <div className="relative mb-1">
            <div 
              className="h-2.5 w-full rounded-sm border border-slate-300"
              style={{
                background: "linear-gradient(to right, rgba(56, 189, 248, 0.4) 0%, #2563eb 25%, #1e40af 50%, #8b5cf6 75%, #ec4899 90%, #ef4444 100%)"
              }}
            />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 mt-0.5 px-0.5">
              <span>0.1</span>
              <span>1.0</span>
              <span>3.5</span>
              <span>8.0</span>
              <span>15</span>
              <span>25+</span>
            </div>
          </div>

          <div className="flex justify-between text-[8px] font-semibold text-slate-500 text-center tracking-tight pb-1">
            <span>Drizzle</span>
            <span>Light</span>
            <span>Moderate</span>
            <span>Heavy</span>
            <span className="text-red-600 font-bold">Cloudburst</span>
          </div>

          {stats && (
            <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
              <span>Active Peak: <strong className="text-blue-700">{stats.max} mm/h</strong></span>
              <span className="text-[9px] text-emerald-700 font-bold">Real Open-Meteo Ingest</span>
            </div>
          )}
        </div>
      )}

      {/* 3. WIND */}
      {activeLayer === "wind" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <span>Wind Velocity & Vectors</span>
            </span>
            <span className="font-mono font-bold text-teal-700">km/h</span>
          </div>

          <div className="relative mb-1">
            <div 
              className="h-2.5 w-full rounded-sm border border-slate-300"
              style={{
                background: "linear-gradient(to right, #93c5fd 0%, #38bdf8 25%, #34d399 50%, #fbbf24 75%, #f87171 90%, #c084fc 100%)"
              }}
            />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 mt-0.5 px-0.5">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>35</span>
              <span>50</span>
              <span>65+</span>
            </div>
          </div>

          <div className="flex justify-between text-[8px] font-semibold text-slate-500 text-center tracking-tight pb-1">
            <span>Calm</span>
            <span>Breeze</span>
            <span>Moderate</span>
            <span>Strong</span>
            <span className="text-purple-700 font-bold">Gale</span>
          </div>

          {stats && (
            <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
              <span>Peak Observed Gust: <strong className="text-teal-800">{stats.max} km/h</strong></span>
            </div>
          )}
        </div>
      )}

      {/* 4. AIR QUALITY */}
      {activeLayer === "aqi" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>Air Quality Index (AQI)</span>
            </span>
            <span className="font-mono font-bold text-purple-700">US AQI</span>
          </div>

          <div className="relative mb-1">
            <div 
              className="h-2.5 w-full rounded-sm border border-slate-300"
              style={{
                background: "linear-gradient(to right, #10b981 0%, #eab308 25%, #f97316 50%, #ef4444 75%, #8b5cf6 90%, #881337 100%)"
              }}
            />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 mt-0.5 px-0.5">
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300+</span>
            </div>
          </div>

          <div className="flex justify-between text-[8px] font-semibold text-slate-500 text-center tracking-tight pb-1">
            <span className="text-emerald-700">Good</span>
            <span className="text-amber-700">Moderate</span>
            <span className="text-orange-700">Unhealthy</span>
            <span className="text-red-700">Poor</span>
            <span className="text-purple-800 font-bold">Hazardous</span>
          </div>
        </div>
      )}

      {/* 5. HUMIDITY */}
      {activeLayer === "humidity" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-600" />
              <span>Relative Humidity</span>
            </span>
            <span className="font-mono font-bold text-cyan-700">%</span>
          </div>

          <div className="relative mb-1">
            <div 
              className="h-2.5 w-full rounded-sm border border-slate-300"
              style={{
                background: "linear-gradient(to right, #eab308 0%, #10b981 30%, #06b6d4 60%, #1e40af 100%)"
              }}
            />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 mt-0.5 px-0.5">
              <span>20%</span>
              <span>40%</span>
              <span>60%</span>
              <span>80%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. PRESSURE */}
      {activeLayer === "pressure" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-700" />
              <span>Surface Pressure</span>
            </span>
            <span className="font-mono font-bold text-slate-800">hPa</span>
          </div>

          <div className="relative mb-1">
            <div 
              className="h-2.5 w-full rounded-sm border border-slate-300"
              style={{
                background: "linear-gradient(to right, #991b1b 0%, #ef4444 25%, #eab308 50%, #3b82f6 75%, #1e3a8a 100%)"
              }}
            />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 mt-0.5 px-0.5">
              <span>995</span>
              <span>1005</span>
              <span>1012</span>
              <span>1018</span>
              <span>1025</span>
            </div>
          </div>

          <div className="flex justify-between text-[8px] font-semibold text-slate-500 text-center tracking-tight pb-1">
            <span className="text-red-700 font-bold">Depression / Low</span>
            <span>Neutral</span>
            <span className="text-blue-700 font-bold">Anticyclone High</span>
          </div>
        </div>
      )}

      {/* 7. CLOUDS */}
      {activeLayer === "clouds" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-slate-500" />
              <span>Cloud Cover Density</span>
            </span>
            <span className="font-mono font-bold text-slate-600">%</span>
          </div>

          <div className="relative mb-1">
            <div 
              className="h-2.5 w-full rounded-sm border border-slate-300"
              style={{
                background: "linear-gradient(to right, #ffffff 0%, #cbd5e1 50%, #475569 100%)"
              }}
            />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 mt-0.5 px-0.5">
              <span>0% (Clear)</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100% (Overcast)</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. HYBRID MODEL */}
      {activeLayer === "hybrid" && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#0b3d91]" />
              <span>Hybrid NWP-AI Model Blend</span>
            </span>
            <span className="font-mono font-bold text-[#0b3d91]">% Contribution</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Dynamic weighting of physical NWP (ECMWF, GFS) and Foundation AI (GraphCast, ClimaX, Pangu-Weather).
          </p>
        </div>
      )}

    </div>
  );
}
