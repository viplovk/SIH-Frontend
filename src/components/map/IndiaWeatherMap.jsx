import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  MapPin, 
  Radio, 
  Maximize2, 
  Info, 
  Compass,
  AlertTriangle,
  Eye,
  Sliders
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import { TIMELINE_STEPS, FORECAST_VARIABLES } from "../../data/mockForecast.js";

export function IndiaWeatherMap({ standalone = false }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const weatherOverlayGroupRef = useRef(null);

  const { 
    selectedLocation, 
    setSelectedLocation, 
    locationsList, 
    timelineStep, 
    setTimelineStep, 
    activeVariable, 
    setActiveVariable,
    isMockMode
  } = useWeather();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showRadarSweep, setShowRadarSweep] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [mapZoom, setMapZoom] = useState(5);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on India (22.5° N, 82.5° E)
    const map = L.map(mapContainerRef.current, {
      center: [selectedLocation.lat || 22.9734, selectedLocation.lon || 78.6569],
      zoom: standalone ? 5 : 4.8,
      minZoom: 4,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: false
    });

    // Dark Matter tile layer for scientific meteorological command look
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Layer groups for markers and meteorological heat anomalies
    const markersGroup = L.layerGroup().addTo(map);
    const weatherOverlayGroup = L.layerGroup().addTo(map);

    markersGroupRef.current = markersGroup;
    weatherOverlayGroupRef.current = weatherOverlayGroup;
    mapInstanceRef.current = map;

    map.on("zoomend", () => {
      setMapZoom(map.getZoom());
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Center map when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      mapInstanceRef.current.flyTo(
        [selectedLocation.lat, selectedLocation.lon],
        standalone ? 6 : Math.max(mapZoom, 5.5),
        { duration: 1.2 }
      );
    }
  }, [selectedLocation.id]);

  // Update weather layers and station markers when variable, timeline, or location changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !weatherOverlayGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    const overlayGroup = weatherOverlayGroupRef.current;

    markersGroup.clearLayers();
    overlayGroup.clearLayers();

    // 1. Draw Simulated Meteorological Field Circles around locations
    // Multiplied by timeline step index to simulate weather front movement
    const stepIdx = TIMELINE_STEPS.indexOf(timelineStep);

    locationsList.forEach((loc) => {
      const isSelected = loc.id === selectedLocation.id;
      const base = loc.baseWeather;

      // Calculate dynamic value based on activeVariable and timeline step
      let val = 0;
      let fillColor = "#38bdf8";
      let radiusKm = 180000; // 180km

      if (activeVariable === "temperature") {
        val = base.temperature + (stepIdx * 0.4) - (loc.lat > 25 ? 1 : 0);
        fillColor = val > 36 ? "#f43f5e" : val > 31 ? "#fbbf24" : val > 27 ? "#38bdf8" : "#818cf8";
      } else if (activeVariable === "precipitation") {
        val = Math.max(5, base.precipitation + (stepIdx % 2 === 0 ? 10 : -5));
        fillColor = val > 75 ? "#06b6d4" : val > 50 ? "#3b82f6" : "#64748b";
        radiusKm = (val / 100) * 240000;
      } else if (activeVariable === "wind") {
        val = base.windSpeed + stepIdx * 1.5;
        fillColor = val > 22 ? "#a855f7" : val > 15 ? "#06b6d4" : "#64748b";
      } else if (activeVariable === "extremeRisk") {
        const hasCritical = loc.extremeAlert?.severity === "CRITICAL";
        const hasHigh = loc.extremeAlert?.severity === "HIGH";
        fillColor = hasCritical ? "#ef4444" : hasHigh ? "#f97316" : "#eab308";
        radiusKm = hasCritical ? 260000 : 190000;
      } else if (activeVariable === "humidity") {
        val = Math.min(98, base.humidity + stepIdx * 2);
        fillColor = val > 80 ? "#0284c7" : val > 65 ? "#38bdf8" : "#94a3b8";
      } else {
        fillColor = "#38bdf8";
      }

      // Draw atmospheric field bubble
      const circle = L.circle([loc.lat, loc.lon], {
        color: isSelected ? "#38bdf8" : fillColor,
        weight: isSelected ? 2 : 1,
        dashArray: isSelected ? "3, 3" : undefined,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.32 : 0.18,
        radius: radiusKm
      });
      overlayGroup.addLayer(circle);

      // 2. Add Station Pin Marker
      if (showStations) {
        const markerHtml = `
          <div class="relative cursor-pointer group">
            <div class="w-3.5 h-3.5 rounded-full ${isSelected ? "bg-cyan-400 ring-4 ring-cyan-500/40" : "bg-slate-300 ring-2 ring-black"} flex items-center justify-center transition-all transform hover:scale-125">
              <div class="w-1 h-1 bg-black rounded-full"></div>
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#090d14] border ${isSelected ? "border-cyan-400 text-cyan-300 font-bold" : "border-white/20 text-slate-300"} px-1.5 py-0.5 rounded text-[10px] font-mono-tech whitespace-nowrap shadow-md pointer-events-none">
              ${loc.name} ${activeVariable === "temperature" ? `${val.toFixed(0)}°` : ""}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: "custom-station-pin",
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([loc.lat, loc.lon], { icon: customIcon });

        marker.on("click", () => {
          setSelectedLocation(loc);
        });

        // Popup details
        marker.bindPopup(`
          <div class="p-1 font-mono-tech text-xs">
            <div class="font-bold text-white text-sm border-b border-white/10 pb-1 mb-1">
              ${loc.name.toUpperCase()} RADAR HUB
            </div>
            <div class="text-slate-300 text-[11px] mb-1">
              ${loc.state} • ${loc.terrain}
            </div>
            <div class="text-cyan-400 text-xs font-semibold mb-1">
              Regime: ${loc.currentRegime}
            </div>
            <div class="grid grid-cols-2 gap-1 text-[10px] bg-black/40 p-1.5 rounded mb-2">
              <div>Temp: <strong class="text-white">${loc.baseWeather.temperature}°C</strong></div>
              <div>Rain: <strong class="text-white">${loc.baseWeather.precipitation}%</strong></div>
              <div>Wind: <strong class="text-white">${loc.baseWeather.windSpeed} km/h</strong></div>
              <div>Humid: <strong class="text-white">${loc.baseWeather.humidity}%</strong></div>
            </div>
            <div class="text-slate-400 text-[10px]">
              Weights: NWP ${loc.modelWeights.nwp}% | AI-A ${loc.modelWeights.aiA}% | AI-B ${loc.modelWeights.aiB}%
            </div>
          </div>
        `);

        markersGroup.addLayer(marker);
      }
    });

  }, [selectedLocation.id, timelineStep, activeVariable, showStations, locationsList]);

  // Timeline auto-player loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineStep((prev) => {
          const currentIndex = TIMELINE_STEPS.indexOf(prev);
          const nextIndex = (currentIndex + 1) % TIMELINE_STEPS.length;
          return TIMELINE_STEPS[nextIndex];
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setTimelineStep]);

  return (
    <div className={`bg-[#111622] border border-white/[0.08] rounded-lg overflow-hidden flex flex-col ${standalone ? "h-[calc(100vh-140px)]" : "h-[540px] sm:h-[600px]"} relative`}>
      
      {/* Map Control Bar Top */}
      <div className="bg-[#0e131d] px-3 sm:px-4 py-2.5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2 z-20">
        
        {/* Variable Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
          <span className="text-[11px] font-mono-tech text-slate-400 uppercase hidden sm:inline mr-1">
            LAYER:
          </span>
          {FORECAST_VARIABLES.map((v) => {
            const isActive = activeVariable === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVariable(v.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono-tech whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-[0_0_8px_rgba(56,189,248,0.2)]"
                    : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.05]"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        {/* View Options */}
        <div className="flex items-center gap-2 text-xs font-mono-tech">
          <button
            onClick={() => setShowRadarSweep(!showRadarSweep)}
            className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 cursor-pointer ${
              showRadarSweep 
                ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/30" 
                : "text-slate-500 border-white/[0.05]"
            }`}
          >
            <Radio className="w-3 h-3" />
            <span className="hidden sm:inline">Radar Sweep</span>
          </button>

          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 cursor-pointer ${
              showStations 
                ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/30" 
                : "text-slate-500 border-white/[0.05]"
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span className="hidden sm:inline">Stations</span>
          </button>
        </div>

      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full bg-[#0a0d14]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Subtle Atmospheric Radar Sweep Overlay */}
        {showRadarSweep && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/10">
              <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] border-r-2 border-cyan-400/40 origin-top-left animate-radar-sweep" />
            </div>
          </div>
        )}

        {/* Current Map Legend Overlay (Top Left) */}
        <div className="absolute top-3 left-3 z-20 bg-[#0f141f]/90 backdrop-blur-md border border-white/[0.1] rounded p-2.5 text-xs font-mono-tech max-w-xs shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-white/[0.06] pb-1 mb-1.5">
            <span className="uppercase">{activeVariable} SYNTHESIS</span>
            <span className="text-[10px] text-slate-400">LEAD: {timelineStep}</span>
          </div>

          <div className="text-[11px] text-slate-300 mb-1">
            Station Focus: <strong className="text-white">{selectedLocation.name}</strong> ({selectedLocation.lat.toFixed(2)}°N)
          </div>

          <div className="text-[10px] text-slate-400 leading-tight">
            Click any radar marker on the map to switch active station & blended weighting.
          </div>

          {isMockMode && (
            <div className="mt-1.5 pt-1 border-t border-white/[0.05] text-[9px] text-amber-400">
              ● SIMULATED ENSEMBLE FIELD (MOCK MODE)
            </div>
          )}
        </div>

        {/* Coordinates Reticle indicator Bottom Left */}
        <div className="absolute bottom-16 left-3 z-20 bg-black/60 px-2 py-1 rounded text-[10px] font-mono-tech text-slate-400 border border-white/[0.05]">
          LAT/LON: {selectedLocation.lat.toFixed(3)}°N / {selectedLocation.lon.toFixed(3)}°E • ELEV: {selectedLocation.elevation}m
        </div>

      </div>

      {/* Bottom Timeline Controls Bar */}
      <div className="bg-[#0e131d] px-3 sm:px-6 py-2.5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        
        {/* Play/Pause Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono-tech transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "PAUSE" : "ANIMATE TIMELINE"}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setTimelineStep("NOW");
            }}
            title="Reset to NOW"
            className="p-1.5 rounded bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.08] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Forecast Timeline Steps (NOW, +3H, +6H, +12H, +24H, +48H, +72H) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto justify-center">
          {TIMELINE_STEPS.map((step) => {
            const isCurrent = timelineStep === step;
            return (
              <button
                key={step}
                onClick={() => {
                  setIsPlaying(false);
                  setTimelineStep(step);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded text-xs font-mono-tech transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_#38bdf8]"
                    : "bg-[#161d2d] text-slate-400 hover:text-slate-200 border border-white/[0.05]"
                }`}
              >
                {step}
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}
