import React, { useState } from "react";
import { LocationSelector } from "../components/weather/LocationSelector.jsx";
import { ForecastTimeline } from "../components/charts/ForecastTimeline.jsx";
import { AtmosphericRegimeCard } from "../components/weather/AtmosphericRegimeCard.jsx";
import { HybridModelPanel } from "../components/models/HybridModelPanel.jsx";
import { useWeather } from "../context/WeatherContext.jsx";
import { generateTimelineData, FORECAST_HORIZONS } from "../data/mockForecast.js";
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  CloudRain, 
  Gauge, 
  Sun, 
  FileDown, 
  Layers, 
  Compass,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function Forecast() {
  const { selectedLocation, forecastHorizon, setForecastHorizon, openExplainModal, isMockMode } = useWeather();
  const timelineData = generateTimelineData(selectedLocation.id, forecastHorizon);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportJSON = () => {
    const exportData = {
      project: "ALGORIOT Hybrid Weather Intelligence",
      sihProblemStatement: "SIH26081",
      station: selectedLocation,
      horizon: forecastHorizon,
      generatedAt: new Date().toISOString(),
      forecastTimeline: timelineData,
      isSimulatedData: isMockMode
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algoriot_forecast_${selectedLocation.id}_${forecastHorizon}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
              HIGH-RESOLUTION HYBRID METEOROLOGICAL FORECAST
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Dynamic condition-blended prognostic values combining Navier-Stokes physics with transformer latent dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] text-xs font-mono-tech transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>{downloadSuccess ? "Report Downloaded!" : "Export Forecast JSON"}</span>
          </button>

          <button
            onClick={openExplainModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono-tech hover:bg-cyan-500/30 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audit Weights</span>
          </button>
        </div>
      </div>

      {/* Location Selector */}
      <LocationSelector />

      {/* Main Multi-Model Chart */}
      <ForecastTimeline />

      {/* Hybrid Model Panel and Regime Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <HybridModelPanel />
        </div>
        <div className="lg:col-span-5">
          <AtmosphericRegimeCard />
        </div>
      </div>

      {/* Detailed Chronological Forecast Table */}
      <div className="bg-[#111622] border border-white/[0.08] rounded-lg p-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-white/[0.06] gap-2">
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              CHRONOLOGICAL HOURLY RECONCILIATION
            </h3>
            <p className="text-[11px] font-mono-tech text-slate-400">
              Station: {selectedLocation.name}, India • Coordinate: {selectedLocation.lat}°N / {selectedLocation.lon}°E
            </p>
          </div>
          {isMockMode && (
            <span className="text-[10px] font-mono-tech uppercase text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              DEMO / SIMULATED METRICS
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tech">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Lead Time</th>
                <th className="py-2.5 px-3">Hybrid Temp (°C)</th>
                <th className="py-2.5 px-3">NWP Physics</th>
                <th className="py-2.5 px-3">AI Model A (FuXi)</th>
                <th className="py-2.5 px-3">Rain Rate (mm)</th>
                <th className="py-2.5 px-3">Wind (km/h)</th>
                <th className="py-2.5 px-3">Humidity (%)</th>
                <th className="py-2.5 px-3">Pressure (hPa)</th>
                <th className="py-2.5 px-3">CAPE Index (J/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {timelineData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] text-slate-300">
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{row.time}</td>
                  <td className="py-2.5 px-3 text-white font-bold bg-cyan-950/20">
                    {row.temperature}°C
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{row.nwp?.temp}°C</td>
                  <td className="py-2.5 px-3 text-emerald-400/90">{row.aiA?.temp}°C</td>
                  <td className="py-2.5 px-3 font-semibold text-sky-400">{row.precipitation} mm</td>
                  <td className="py-2.5 px-3">{row.wind} km/h</td>
                  <td className="py-2.5 px-3">{row.humidity}%</td>
                  <td className="py-2.5 px-3 text-slate-400">{row.pressure}</td>
                  <td className="py-2.5 px-3 text-amber-400">{row.capeIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
