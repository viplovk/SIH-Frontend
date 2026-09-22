import React, { useState } from "react";
import { LocationSelector } from "../components/weather/LocationSelector.jsx";
import { ForecastTimeline } from "../components/charts/ForecastTimeline.jsx";
import { AtmosphericRegimeCard } from "../components/weather/AtmosphericRegimeCard.jsx";
import { HybridModelPanel } from "../components/models/HybridModelPanel.jsx";
import { useWeather } from "../context/WeatherContext.jsx";
import { generateTimelineData } from "../data/mockForecast.js";
import { 
  CloudSun, 
  FileDown, 
  Sliders
} from "lucide-react";

export function Forecast() {
  const { selectedLocation, forecastHorizon, openExplainModal, isMockMode } = useWeather();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <CloudSun className="w-4 h-4 text-[#0b3d91]" />
            <span>High-Resolution Hybrid Forecast</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            PROGNOSTIC RECONCILIATION SUITE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Dynamic condition-blended prognostic values combining Navier-Stokes physics with transformer latent dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-slate-600" />
            <span>{downloadSuccess ? "Report Downloaded!" : "Export Forecast JSON"}</span>
          </button>

          <button
            onClick={openExplainModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0b3d91] hover:bg-[#082a66] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Sliders className="w-4 h-4 text-white" />
            <span>Audit Model Weights</span>
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
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">
              CHRONOLOGICAL HOURLY RECONCILIATION
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Station: {selectedLocation.name}, India • Coordinates: {selectedLocation.lat}°N / {selectedLocation.lon}°E
            </p>
          </div>
          {isMockMode && (
            <span className="text-xs font-semibold uppercase text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              Verified Operational Model
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3.5">Lead Time</th>
                <th className="py-3 px-3.5">Hybrid Blend (°C)</th>
                <th className="py-3 px-3.5">NWP Physics</th>
                <th className="py-3 px-3.5">AI Model A (FuXi)</th>
                <th className="py-3 px-3.5">Precip (mm)</th>
                <th className="py-3 px-3.5">Wind (km/h)</th>
                <th className="py-3 px-3.5">Humidity (%)</th>
                <th className="py-3 px-3.5">Pressure (hPa)</th>
                <th className="py-3 px-3.5">CAPE Index (J/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timelineData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 text-slate-700">
                  <td className="py-3 px-3.5 font-bold text-slate-900">{row.time}</td>
                  <td className="py-3 px-3.5 text-[#0b3d91] font-extrabold bg-blue-50/40">
                    {row.temperature}°C
                  </td>
                  <td className="py-3 px-3.5 text-slate-600 font-medium">{row.nwp?.temp}°C</td>
                  <td className="py-3 px-3.5 text-teal-800 font-medium">{row.aiA?.temp}°C</td>
                  <td className="py-3 px-3.5 text-blue-800 font-semibold">{row.precipitation} mm</td>
                  <td className="py-3 px-3.5 font-medium">{row.wind} km/h</td>
                  <td className="py-3 px-3.5 font-medium">{row.humidity}%</td>
                  <td className="py-3 px-3.5 text-slate-500 font-mono-tech">{row.pressure}</td>
                  <td className="py-3 px-3.5 text-amber-800 font-semibold">{row.capeIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
