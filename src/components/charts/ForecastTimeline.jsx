import React, { useState } from "react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { TrendingUp, Thermometer, CloudRain, Wind, Droplets } from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import { generateTimelineData, FORECAST_HORIZONS } from "../../data/mockForecast.js";

export function ForecastTimeline() {
  const { selectedLocation, forecastHorizon, setForecastHorizon, isMockMode } = useWeather();
  const [activeMetric, setActiveMetric] = useState("temperature"); // temperature | precipitation | wind | humidity
  const [showComponents, setShowComponents] = useState(true);

  const timelineData = generateTimelineData(selectedLocation.id, forecastHorizon);

  const metricConfigs = {
    temperature: {
      label: "Temperature (°C)",
      unit: "°C",
      hybridKey: "temperature",
      yDomain: ["auto", "auto"],
      color: "#0b3d91"
    },
    precipitation: {
      label: "Precipitation (mm / h)",
      unit: "mm",
      hybridKey: "precipitation",
      yDomain: [0, "auto"],
      color: "#0284c7"
    },
    wind: {
      label: "Wind Velocity (km/h)",
      unit: "km/h",
      hybridKey: "wind",
      yDomain: [0, "auto"],
      color: "#4f46e5"
    },
    humidity: {
      label: "Relative Humidity (%)",
      unit: "%",
      hybridKey: "humidity",
      yDomain: [0, 100],
      color: "#059669"
    }
  };

  const currentCfg = metricConfigs[activeMetric];

  // Custom tooltips with clean scientific institutional card
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-300 rounded-md p-3 shadow-md text-xs text-slate-800 space-y-1.5 min-w-[200px]">
          <div className="text-slate-900 font-bold border-b border-slate-200 pb-1 flex items-center justify-between">
            <span className="uppercase text-[11px] text-[#0b3d91]">LEAD: {label}</span>
            <span className="text-[10px] text-slate-500">{selectedLocation.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-900 font-bold text-sm">
            <span>Hybrid Forecast:</span>
            <span className="text-[#0b3d91]">
              {data[currentCfg.hybridKey]} {currentCfg.unit}
            </span>
          </div>
          {data.tempLower && activeMetric === "temperature" && (
            <div className="text-[11px] text-slate-500 font-mono-tech">
              90% Range: {data.tempLower}°C — {data.tempUpper}°C
            </div>
          )}
          {showComponents && (
            <div className="pt-1.5 border-t border-slate-200 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>NWP Physics:</span>
                <span className="font-semibold text-slate-800">{data.nwp ? data.nwp[activeMetric === "temperature" ? "temp" : activeMetric === "precipitation" ? "precip" : activeMetric] : "--"} {currentCfg.unit}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>AI Model A (FuXi):</span>
                <span className="font-semibold">{data.aiA ? data.aiA[activeMetric === "temperature" ? "temp" : activeMetric === "precipitation" ? "precip" : activeMetric] : "--"} {currentCfg.unit}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>AI Model B (WeatherNext):</span>
                <span className="font-semibold">{data.aiB ? data.aiB[activeMetric === "temperature" ? "temp" : activeMetric === "precipitation" ? "precip" : activeMetric] : "--"} {currentCfg.unit}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
      
      {/* Chart Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0b3d91]" />
            <span>Multi-Model Trajectory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MULTI-MODEL FORECAST TIMELINE
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Synchronized comparison between physics NWP, AI Model A, AI Model B, and blended Hybrid.
          </p>
        </div>

        {/* Horizon and Variable Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Selectors */}
          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
            {FORECAST_HORIZONS.map((h) => (
              <button
                key={h.id}
                onClick={() => setForecastHorizon(h.id)}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  forecastHorizon === h.id
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>

          {/* Toggle sub-model curves */}
          <button
            onClick={() => setShowComponents(!showComponents)}
            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
              showComponents
                ? "bg-slate-100 text-slate-900 border-slate-300"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {showComponents ? "Sub-models: Visible" : "Sub-models: Hidden"}
          </button>
        </div>
      </div>

      {/* Variable Switch Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs">
        {[
          { id: "temperature", label: "Temperature", icon: Thermometer },
          { id: "precipitation", label: "Precipitation", icon: CloudRain },
          { id: "wind", label: "Wind Velocity", icon: Wind },
          { id: "humidity", label: "Humidity", icon: Droplets }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMetric === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#0b3d91] text-white shadow-2xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timelineData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="hybridSoftGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0b3d91" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#0b3d91" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Subtle slate-200 gridlines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="monospace" 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="monospace" 
              domain={currentCfg.yDomain}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Confidence Interval Band (Soft shaded area, NOT neon glow) */}
            {activeMetric === "temperature" && (
              <Area
                type="monotone"
                dataKey="tempUpper"
                stroke="transparent"
                fill="#0b3d91"
                fillOpacity={0.06}
                name="90% Confidence Interval"
              />
            )}

            {/* Sub-models (NWP, AI A, AI B) */}
            {showComponents && (
              <>
                <Line
                  type="monotone"
                  dataKey="nwp.temp"
                  name="NWP Physics"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  data={timelineData.map(d => ({ ...d, 'nwp.temp': d.nwp[activeMetric === 'temperature' ? 'temp' : activeMetric === 'precipitation' ? 'precip' : activeMetric] }))}
                />
                <Line
                  type="monotone"
                  dataKey="aiA.temp"
                  name="AI Model A (FuXi)"
                  stroke="#059669"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                  data={timelineData.map(d => ({ ...d, 'aiA.temp': d.aiA[activeMetric === 'temperature' ? 'temp' : activeMetric === 'precipitation' ? 'precip' : activeMetric] }))}
                />
                <Line
                  type="monotone"
                  dataKey="aiB.temp"
                  name="AI Model B (WeatherNext)"
                  stroke="#d97706"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                  data={timelineData.map(d => ({ ...d, 'aiB.temp': d.aiB[activeMetric === 'temperature' ? 'temp' : activeMetric === 'precipitation' ? 'precip' : activeMetric] }))}
                />
              </>
            )}

            {/* The primary blended Hybrid Line */}
            <Area
              type="monotone"
              dataKey={currentCfg.hybridKey}
              stroke="#0b3d91"
              strokeWidth={2.5}
              fill="url(#hybridSoftGrad)"
              name="ALGORIOT Hybrid"
              dot={{ r: 3, fill: "#0b3d91", stroke: "#ffffff", strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: "#0b3d91", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Institutional Legend */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#0b3d91] rounded-full" />
            <strong className="text-slate-900">ALGORIOT Hybrid (Blended)</strong>
          </div>
          {showComponents && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-slate-500 border-b border-dashed" />
                <span>NWP Physics (IFS/GFS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-emerald-600 border-b border-dashed" />
                <span>AI Model A (FuXi)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-amber-600 border-b border-dashed" />
                <span>AI Model B (WeatherNext)</span>
              </div>
            </>
          )}
        </div>

        <div className="text-slate-500 font-mono-tech text-[11px]">
          Evaluated via Conformal Quantile Meta-Learner
        </div>
      </div>

    </div>
  );
}
