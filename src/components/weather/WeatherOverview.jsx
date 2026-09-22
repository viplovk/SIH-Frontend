import React, { useEffect, useRef } from "react";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  CloudRain, 
  Cloud, 
  Eye, 
  Sun,
  Activity,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import gsap from "gsap";

export function WeatherOverview() {
  const { selectedLocation, isMockMode } = useWeather();
  const current = selectedLocation.baseWeather;
  const tempRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (tempRef.current) {
      gsap.fromTo(
        tempRef.current,
        { scale: 0.96, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [selectedLocation.id]);

  const metrics = [
    {
      id: "humidity",
      label: "Relative Humidity",
      value: `${current.humidity}%`,
      subtext: `Dew Pt: ${current.dewPoint}°C`,
      icon: Droplets,
      color: "text-sky-400"
    },
    {
      id: "wind",
      label: "Wind Velocity",
      value: `${current.windSpeed} km/h`,
      subtext: current.windDirection,
      icon: Wind,
      color: "text-teal-400"
    },
    {
      id: "pressure",
      label: "Surface Pressure",
      value: `${current.pressure} hPa`,
      subtext: "Reduced to MSL",
      icon: Gauge,
      color: "text-indigo-400"
    },
    {
      id: "precipitation",
      label: "Rainfall Probability",
      value: `${current.precipitation}%`,
      subtext: "Convective cells",
      icon: CloudRain,
      color: "text-cyan-400"
    },
    {
      id: "cloudCover",
      label: "Total Cloud Cover",
      value: `${current.cloudCover}%`,
      subtext: "Stratocumulus",
      icon: Cloud,
      color: "text-slate-300"
    },
    {
      id: "visibility",
      label: "Horizontal Visibility",
      value: `${current.visibility} km`,
      subtext: "Aerosol optical depth",
      icon: Eye,
      color: "text-emerald-400"
    }
  ];

  return (
    <div ref={containerRef} className="bg-[#111622] border border-white/[0.08] rounded-lg p-4 sm:p-5 relative overflow-hidden">
      {/* Subtle background coordinate grid */}
      <div className="absolute inset-0 bg-grid-tech opacity-40 pointer-events-none" />

      {/* Top Header Label */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="font-mono-tech text-xs uppercase tracking-wider text-slate-300 font-semibold">
            METEOROLOGICAL STATE ESTIMATE
          </span>
          <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-400">
            HYBRID BLENDED
          </span>
        </div>

        {isMockMode && (
          <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
            DEMO / SIMULATED DATA
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Main Temperature Hero Block (5 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06] pb-4 lg:pb-0 lg:pr-6">
          <div>
            <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 mb-1">
              <span>SURFACE AMBIENT</span>
              <span>2m AIR LEVEL</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span ref={tempRef} className="text-5xl sm:text-6xl font-heading font-bold text-white tracking-tighter">
                {current.temperature}°
              </span>
              <span className="text-xl sm:text-2xl font-mono-tech text-slate-400 font-light">C</span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs font-mono-tech text-slate-400">
              <span>Feels like: <strong className="text-slate-200">{current.feelsLike}°C</strong></span>
              <span>•</span>
              <span className="text-cyan-400">UV Index: {current.uvIndex}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] font-mono-tech text-slate-400 flex items-center justify-between">
            <span>AQI: <strong className="text-amber-400">{current.airQualityIndex}</strong> (Moderate)</span>
            <span className="text-slate-500">In-situ AWS IMD-Ref</span>
          </div>
        </div>

        {/* 6 Supporting Parameters Grid (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.id}
                className="bg-[#161d2d]/60 border border-white/[0.04] rounded p-2.5 sm:p-3 hover:border-cyan-500/20 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-tight">
                    {m.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
                
                <div className="text-lg sm:text-xl font-heading font-bold text-white tracking-tight">
                  {m.value}
                </div>

                <div className="text-[10px] font-mono-tech text-slate-400 mt-0.5 truncate">
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
