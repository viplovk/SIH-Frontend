import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  HelpCircle, 
  Wind, 
  Compass, 
  Layers, 
  MapPin, 
  Radio, 
  Activity,
  ArrowRight
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";

export function CommandHero() {
  const { openExplainModal, selectedLocation } = useWeather();

  return (
    <section className="relative bg-white border-b border-slate-200 overflow-hidden py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Small uppercase institutional kicker */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#0b3d91]" />
              <span>Hybrid Weather Intelligence</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Understanding weather through physics and artificial intelligence.
            </h1>

            {/* Short narrative description */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Algoriot combines numerical weather prediction and AI-based atmospheric models to produce adaptive, explainable forecasts for disaster resilience and public safety.
            </p>

            {/* Clear CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/forecast"
                className="inline-flex items-center justify-center px-6 py-3 rounded text-sm font-semibold bg-[#0b3d91] hover:bg-[#072a66] text-white transition-colors shadow-sm"
              >
                <span>EXPLORE FORECAST</span>
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Link>

              <button
                onClick={openExplainModal}
                className="inline-flex items-center justify-center px-5 py-3 rounded text-sm font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
              >
                <span>HOW IT WORKS</span>
                <HelpCircle className="w-4 h-4 ml-2 text-slate-500" />
              </button>
            </div>

            {/* Live Station Telemetry Snapshot */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0b3d91]" />
                <span>Station: <strong className="text-slate-800 font-medium">{selectedLocation.name}</strong> ({selectedLocation.lat}°N, {selectedLocation.lon}°E)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>Active Regime: <strong className="text-slate-700 font-medium">{selectedLocation.currentRegime}</strong></span>
              </div>
            </div>

          </div>

          {/* Right Column: Large Atmospheric / Scientific Visualization */}
          <div className="lg:col-span-6">
            <div className="relative rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
              
              {/* Scientific Header Metadata Bar */}
              <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-status-pulse" />
                  <span className="font-semibold tracking-wider text-[11px] uppercase">
                    SYNOPTIC SATELLITE & RADAR BLEND
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono-tech">
                  INSAT-3DR + ECMWF 850hPa
                </div>
              </div>

              {/* Atmospheric Visual Stage (Subcontinent Streamlines & Isobars) */}
              <div className="relative h-72 sm:h-80 w-full bg-[#0a192f] overflow-hidden">
                
                {/* SVG Synoptic Chart Overlay */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 320" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    {/* Atmospheric stream gradients */}
                    <linearGradient id="streamGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="convectivePrecip" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
                      <stop offset="60%" stopColor="#059669" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Subcontinental Grid Lat/Lon Lines */}
                  <line x1="50" y1="40" x2="450" y2="40" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />
                  <line x1="50" y1="110" x2="450" y2="110" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />
                  <line x1="50" y1="180" x2="450" y2="180" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />
                  <line x1="50" y1="250" x2="450" y2="250" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />
                  <line x1="120" y1="20" x2="120" y2="300" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />
                  <line x1="220" y1="20" x2="220" y2="300" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />
                  <line x1="320" y1="20" x2="320" y2="300" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />
                  <line x1="420" y1="20" x2="420" y2="300" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="3 3" />

                  {/* Simplified Geographic Coastline Contour of Peninsular India & Bay of Bengal */}
                  <path
                    d="M 170 60 Q 230 50, 310 70 Q 330 110, 340 160 Q 320 220, 250 270 Q 190 220, 180 160 Q 160 110, 170 60 Z"
                    fill="#1e293b"
                    fillOpacity="0.5"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Convective Monsoon Cloud Moisture Envelope */}
                  <ellipse cx="280" cy="150" rx="90" ry="60" fill="url(#convectivePrecip)" />
                  <ellipse cx="220" cy="180" rx="70" ry="45" fill="url(#convectivePrecip)" />

                  {/* Isobar Pressure Contour Lines (Hectopascals) */}
                  <path
                    d="M 60 260 Q 180 230, 270 210 Q 380 180, 460 220"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <text x="70" y="255" fill="#93c5fd" fontSize="9" opacity="0.8" fontFamily="monospace">1008 hPa</text>

                  <path
                    d="M 60 200 Q 170 170, 260 145 Q 370 120, 460 150"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1.2"
                    strokeOpacity="0.7"
                  />
                  <text x="70" y="195" fill="#93c5fd" fontSize="9" opacity="0.8" fontFamily="monospace">1012 hPa</text>

                  <path
                    d="M 60 140 Q 160 110, 250 85 Q 360 60, 460 90"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                  <text x="70" y="135" fill="#93c5fd" fontSize="9" opacity="0.8" fontFamily="monospace">1016 hPa</text>

                  {/* Atmospheric Jet / Monsoon Wind Streamlines */}
                  <path
                    d="M 80 280 C 140 270, 210 240, 270 170 C 310 120, 360 100, 430 80"
                    fill="none"
                    stroke="url(#streamGrad1)"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                  />
                  <path
                    d="M 90 295 C 160 280, 220 230, 280 150 C 330 90, 390 85, 450 65"
                    fill="none"
                    stroke="url(#streamGrad1)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  <path
                    d="M 120 310 C 180 290, 240 250, 300 180 C 350 120, 400 110, 460 95"
                    fill="none"
                    stroke="url(#streamGrad1)"
                    strokeWidth="1.5"
                  />

                  {/* Selected Station Marker */}
                  <g transform="translate(240, 130)">
                    <circle r="14" fill="#0b3d91" fillOpacity="0.25" className="animate-ping" />
                    <circle r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                    <rect x="12" y="-14" width="105" height="24" rx="3" fill="#0f172a" fillOpacity="0.9" stroke="#334155" strokeWidth="1" />
                    <text x="18" y="2" fill="#f8fafc" fontSize="10" fontWeight="600">{selectedLocation.name.toUpperCase()} HUB</text>
                  </g>

                  {/* Synoptic Coordinate Legend Overlay */}
                  <text x="20" y="300" fill="#64748b" fontSize="9" fontFamily="monospace">
                    22.5°N, 82.5°E • REGIME: {selectedLocation.currentRegime.toUpperCase()}
                  </text>
                </svg>

                {/* Live telemetry floating badge */}
                <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 rounded px-3 py-1.5 text-white text-[11px] font-mono-tech flex items-center gap-3">
                  <div>
                    <span className="text-slate-400">SURFACE TEMP: </span>
                    <strong className="text-sky-300">{selectedLocation.baseWeather.temperature}°C</strong>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div>
                    <span className="text-slate-400">PRECIP: </span>
                    <strong className="text-emerald-300">{selectedLocation.baseWeather.precipitation}%</strong>
                  </div>
                </div>

              </div>

              {/* Caption Under the Visualization (NASA editorial style) */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>
                  <strong>Figure 1.1:</strong> Regional synoptic streamline convergence and cloud radiance.
                </span>
                <Link to="/map" className="text-[#0b3d91] font-semibold hover:underline inline-flex items-center gap-1">
                  <span>Interactive Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
