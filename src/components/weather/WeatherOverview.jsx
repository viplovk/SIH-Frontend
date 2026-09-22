import React from "react";
import { 
  Droplets, 
  Wind, 
  Gauge, 
  CloudRain, 
  Cloud, 
  Eye, 
  MapPin,
  Activity,
  Sun
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";

export function WeatherOverview() {
  const { selectedLocation, isMockMode } = useWeather();
  const current = selectedLocation.baseWeather;

  const metrics = [
    {
      id: "humidity",
      label: "Relative Humidity",
      value: `${current.humidity}%`,
      subtext: `Dew Point: ${current.dewPoint}°C`,
      icon: Droplets
    },
    {
      id: "wind",
      label: "Wind Velocity",
      value: `${current.windSpeed} km/h`,
      subtext: `Bearing: ${current.windDirection}`,
      icon: Wind
    },
    {
      id: "pressure",
      label: "Surface Pressure",
      value: `${current.pressure} hPa`,
      subtext: "Reduced to MSL",
      icon: Gauge
    },
    {
      id: "precipitation",
      label: "Rainfall Probability",
      value: `${current.precipitation}%`,
      subtext: "Convective cell risk",
      icon: CloudRain
    },
    {
      id: "cloudCover",
      label: "Cloud Cover",
      value: `${current.cloudCover}%`,
      subtext: "Stratocumulus layer",
      icon: Cloud
    },
    {
      id: "visibility",
      label: "Horizontal Visibility",
      value: `${current.visibility} km`,
      subtext: "Aerosol optical depth",
      icon: Eye
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
      
      {/* Top Editorial Label Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0b3d91]" />
            <span>Current Meteorological State</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {selectedLocation.name}, <span className="text-slate-500 font-medium">{selectedLocation.state}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isMockMode && (
            <span className="text-[11px] font-medium uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              SIMULATED BASELINE
            </span>
          )}
          <div className="text-xs text-slate-500 font-mono-tech">
            Station: {selectedLocation.lat}°N, {selectedLocation.lon}°E
          </div>
        </div>
      </div>

      {/* Primary Conditions Display with Thin Dividers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Main Temperature Section (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-8">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Surface Temperature (2m Air)
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                {current.temperature}
              </span>
              <span className="text-2xl font-light text-slate-400">°C</span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span>Feels like <strong>{current.feelsLike}°C</strong></span>
              <span className="text-slate-300">•</span>
              <span>UV Index: <strong>{current.uvIndex}</strong></span>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Current Regime: <strong className="text-slate-800">{selectedLocation.currentRegime}</strong>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Air Quality Index (AQI): <strong className="text-slate-800 font-semibold">{current.airQualityIndex}</strong></span>
            <span className="text-slate-400">IMD AWS Telemetry</span>
          </div>
        </div>

        {/* 6 Essential Meteorological Metrics with Thin Dividers (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.id}
                className="flex flex-col justify-between pb-3 border-b sm:border-b-0 border-slate-100"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs font-medium text-slate-500">
                    <span className="uppercase tracking-wider">{m.label}</span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {m.value}
                  </div>
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {m.subtext}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
