import React, { useState } from "react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { Clock, TrendingUp, Thermometer, CloudRain, Wind, Droplets, Sliders } from "lucide-react";
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
      nwpKey: "nwp.temp",
      aiAKey: "aiA.temp",
      aiBKey: "aiB.temp",
      yDomain: ["auto", "auto"],
      color: "#38bdf8"
    },
    precipitation: {
      label: "Precipitation (mm / h)",
      unit: "mm",
      hybridKey: "precipitation",
      nwpKey: "nwp.precip",
      aiAKey: "aiA.precip",
      aiBKey: "aiB.precip",
      yDomain: [0, "auto"],
      color: "#34d399"
    },
    wind: {
      label: "Wind Velocity (km/h)",
      unit: "km/h",
      hybridKey: "wind",
      nwpKey: "nwp.wind",
      aiAKey: "aiA.wind",
      aiBKey: "aiB.wind",
      yDomain: [0, "auto"],
      color: "#a78bfa"
    },
    humidity: {
      label: "Relative Humidity (%)",
      unit: "%",
      hybridKey: "humidity",
      nwpKey: "nwp.humid",
      aiAKey: "aiA.humid",
      aiBKey: "aiB.humid",
      yDomain: [0, 100],
      color: "#fbbf24"
    }
  };

  const currentCfg = metricConfigs[activeMetric];

  // Custom tooltips with dark command center aesthetic
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f141f] border border-cyan-500/40 rounded p-2.5 shadow-xl text-xs font-mono-tech text-white space-y-1">
          <div className="text-cyan-400 font-bold border-b border-white/[0.08] pb-1 flex items-center justify-between">
            <span>LEAD: {label}</span>
            <span className="text-[10px] text-slate-400">CAPTION: {selectedLocation.name}</span>
          </div>
          <div className="text-white flex items-center justify-between gap-4">
            <span className="text-cyan-300 font-bold">★ HYBRID FORECAST:</span>
            <span className="font-bold text-sm">
              {data[currentCfg.hybridKey]} {currentCfg.unit}
            </span>
          </div>
          {data.tempLower && activeMetric === "temperature" && (
            <div className="text-[11px] text-slate-400">
              90% Range: {data.tempLower}°C — {data.tempUpper}°C
            </div>
          )}
          {showComponents && (
            <div className="pt-1 border-t border-white/[0.05] space-y-0.5 text-[11px] text-slate-300">
              <div className="flex justify-between text-sky-400">
                <span>NWP Model:</span>
                <span>{data.nwp ? data.nwp[activeMetric === "temperature" ? "temp" : activeMetric === "precipitation" ? "precip" : activeMetric] : "--"} {currentCfg.unit}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>AI Model A (FuXi):</span>
                <span>{data.aiA ? data.aiA[activeMetric === "temperature" ? "temp" : activeMetric === "precipitation" ? "precip" : activeMetric] : "--"} {currentCfg.unit}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>AI Model B (WeatherNext):</span>
                <span>{data.aiB ? data.aiB[activeMetric === "temperature" ? "temp" : activeMetric === "precipitation" ? "precip" : activeMetric] : "--"} {currentCfg.unit}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#111622] border border-white/[0.08] rounded-lg p-4 sm:p-5 relative">
      
      {/* Chart Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 mb-4 border-b border-white/[0.06] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-base text-white tracking-wide">
              MULTI-MODEL FORECAST TIMELINE
            </h3>
            {isMockMode && (
              <span className="text-[10px] font-mono-tech uppercase px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
                ILLUSTRATIVE DEMO
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-mono-tech mt-0.5">
            Synchronized comparison between physics NWP, AI Model A, AI Model B, and blended Hybrid
          </p>
        </div>

        {/* Horizon and Variable Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Pills */}
          <div className="flex items-center bg-[#0d121a] p-0.5 rounded border border-white/[0.06]">
            {FORECAST_HORIZONS.map((h) => (
              <button
                key={h.id}
                onClick={() => setForecastHorizon(h.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono-tech transition-colors cursor-pointer ${
                  forecastHorizon === h.id
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>

          {/* Toggle sub-model curves */}
          <button
            onClick={() => setShowComponents(!showComponents)}
            className={`px-2.5 py-1 rounded text-xs font-mono-tech border transition-colors cursor-pointer ${
              showComponents
                ? "bg-white/[0.06] text-slate-200 border-white/[0.15]"
                : "bg-transparent text-slate-500 border-white/[0.05]"
            }`}
          >
            {showComponents ? "Sub-models: Shown" : "Sub-models: Hidden"}
          </button>
        </div>
      </div>

      {/* Variable Switch Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs font-mono-tech">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold"
                  : "bg-[#161d2d] text-slate-400 hover:text-white border border-white/[0.04]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hybridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="IBM Plex Mono" 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="IBM Plex Mono" 
              domain={currentCfg.yDomain}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Uncertainty envelope if temperature */}
            {activeMetric === "temperature" && (
              <Area
                type="monotone"
                dataKey="tempUpper"
                stroke="transparent"
                fill="#38bdf8"
                fillOpacity={0.08}
                name="90% Confidence Interval"
              />
            )}

            {/* Sub-models (NWP, AI A, AI B) */}
            {showComponents && (
              <>
                <Line
                  type="monotone"
                  dataKey="nwp.temp"
                  name="NWP Baseline"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  data={timelineData.map(d => ({ ...d, 'nwp.temp': d.nwp[activeMetric === 'temperature' ? 'temp' : activeMetric === 'precipitation' ? 'precip' : activeMetric] }))}
                />
                <Line
                  type="monotone"
                  dataKey="aiA.temp"
                  name="AI Model A (FuXi)"
                  stroke="#34d399"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                  data={timelineData.map(d => ({ ...d, 'aiA.temp': d.aiA[activeMetric === 'temperature' ? 'temp' : activeMetric === 'precipitation' ? 'precip' : activeMetric] }))}
                />
                <Line
                  type="monotone"
                  dataKey="aiB.temp"
                  name="AI Model B (WeatherNext)"
                  stroke="#fbbf24"
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
              stroke="#38bdf8"
              strokeWidth={3}
              fill="url(#hybridGradient)"
              name="ALGORIOT Hybrid"
              dot={{ r: 3, fill: "#38bdf8", stroke: "#0b0e14", strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: "#38bdf8", stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Note */}
      <div className="mt-3 pt-3 border-t border-white/[0.05] flex flex-wrap items-center justify-between text-[11px] font-mono-tech text-slate-400 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400 rounded-full" />
            <span className="text-white font-semibold">ALGORIOT Hybrid (Blended)</span>
          </div>
          {showComponents && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed" />
                <span className="text-slate-300">NWP Model</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 border-b border-dashed" />
                <span className="text-slate-300">AI Model A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400 border-b border-dashed" />
                <span className="text-slate-300">AI Model B</span>
              </div>
            </>
          )}
        </div>

        <div className="text-slate-500">
          Evaluated via Conformal Quantile Meta-Learner
        </div>
      </div>

    </div>
  );
}
