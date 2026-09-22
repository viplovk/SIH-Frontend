import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Radio, 
  Info, 
  Compass,
  Layers
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
  const [showRadarSweep, setShowRadarSweep] = useState(false);
  const [showStations, setShowStations] = useState(true);
  const [mapZoom, setMapZoom] = useState(5);

  // Read CARTO Basemaps API key from environment
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const isMapConfigured = Boolean(cartoApiKey && typeof cartoApiKey === "string" && cartoApiKey.trim().length > 0);

  // Initialize Leaflet Map with CartoDB Voyager Raster Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on India (22.5° N, 82.5° E)
    const map = L.map(mapContainerRef.current, {
      center: [selectedLocation.lat || 22.9734, selectedLocation.lon || 78.6569],
      zoom: standalone ? 5 : 4.8,
      minZoom: 4,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: true
    });

    // Only load CARTO basemap when a valid API key is configured to avoid watermarks
    if (isMapConfigured) {
      L.tileLayer(
        `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoApiKey}`,
        {
          subdomains: "abcd",
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
        }
      ).addTo(map);
    }

    // Clean Zoom Control at bottom right
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
  }, [isMapConfigured]);

  // Center map when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      mapInstanceRef.current.flyTo(
        [selectedLocation.lat, selectedLocation.lon],
        standalone ? 6 : Math.max(mapZoom, 5.5),
        { duration: 1.0 }
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

    const stepIdx = TIMELINE_STEPS.indexOf(timelineStep);

    locationsList.forEach((loc) => {
      const isSelected = loc.id === selectedLocation.id;
      const base = loc.baseWeather;

      // Calculate dynamic value based on activeVariable and timeline step
      let val = 0;
      let fillColor = "#0284c7";
      let radiusKm = 170000;

      if (activeVariable === "temperature") {
        val = base.temperature + (stepIdx * 0.4) - (loc.lat > 25 ? 1 : 0);
        fillColor = val > 36 ? "#dc2626" : val > 31 ? "#ea580c" : val > 27 ? "#0284c7" : "#4f46e5";
      } else if (activeVariable === "precipitation") {
        val = Math.max(5, base.precipitation + (stepIdx % 2 === 0 ? 10 : -5));
        fillColor = val > 75 ? "#0891b2" : val > 50 ? "#2563eb" : "#94a3b8";
        radiusKm = (val / 100) * 230000;
      } else if (activeVariable === "wind") {
        val = base.windSpeed + stepIdx * 1.5;
        fillColor = val > 22 ? "#7c3aed" : val > 15 ? "#0284c7" : "#64748b";
      } else if (activeVariable === "extremeRisk") {
        const hasCritical = loc.extremeAlert?.severity === "CRITICAL";
        const hasHigh = loc.extremeAlert?.severity === "HIGH";
        fillColor = hasCritical ? "#dc2626" : hasHigh ? "#ea580c" : "#ca8a04";
        radiusKm = hasCritical ? 250000 : 180000;
      } else if (activeVariable === "humidity") {
        val = Math.min(98, base.humidity + stepIdx * 2);
        fillColor = val > 80 ? "#0369a1" : val > 65 ? "#0284c7" : "#94a3b8";
      }

      // Draw atmospheric field contour
      const circle = L.circle([loc.lat, loc.lon], {
        color: isSelected ? "#0b3d91" : fillColor,
        weight: isSelected ? 2 : 1,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.28 : 0.16,
        radius: radiusKm
      });
      overlayGroup.addLayer(circle);

      // 2. Add Station Marker
      if (showStations) {
        const markerHtml = `
          <div class="relative cursor-pointer">
            <div class="w-4 h-4 rounded-full ${isSelected ? "bg-[#0b3d91] ring-3 ring-blue-300" : "bg-white ring-2 ring-slate-400"} flex items-center justify-center shadow-xs">
              <div class="w-1.5 h-1.5 ${isSelected ? "bg-white" : "bg-slate-700"} rounded-full"></div>
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border ${isSelected ? "border-[#0b3d91] text-[#0b3d91] font-bold" : "border-slate-300 text-slate-700"} px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap shadow-xs pointer-events-none">
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

        // Clean white popup card
        marker.bindPopup(`
          <div class="p-1 font-sans text-xs text-slate-800">
            <div class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-1">
              ${loc.name} Station
            </div>
            <div class="text-slate-500 text-[11px] mb-1">
              ${loc.state} • ${loc.terrain}
            </div>
            <div class="text-[#0b3d91] text-xs font-semibold mb-1">
              Regime: ${loc.currentRegime}
            </div>
            <div class="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200 mb-2 text-[11px]">
              <div>Temp: <strong>${loc.baseWeather.temperature}°C</strong></div>
              <div>Rain: <strong>${loc.baseWeather.precipitation}%</strong></div>
              <div>Wind: <strong>${loc.baseWeather.windSpeed} km/h</strong></div>
              <div>Humidity: <strong>${loc.baseWeather.humidity}%</strong></div>
            </div>
            <div class="text-slate-600 text-[10px] font-mono-tech">
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
    <div className={`bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col ${standalone ? "h-[calc(100vh-140px)]" : "h-[540px] sm:h-[600px]"} relative shadow-xs`}>
      
      {/* Map Control Bar Top (Scientific institutional controls) */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-20">
        
        {/* Variable Selector: TEMPERATURE, PRECIPITATION, WIND, HUMIDITY, EXTREME RISK */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
            Layer:
          </span>
          {FORECAST_VARIABLES.map((v) => {
            const isActive = activeVariable === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVariable(v.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#0b3d91] text-white shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        {/* View Options */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-3 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
              showStations 
                ? "bg-slate-200 text-slate-900 border-slate-300" 
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#0b3d91]" />
            <span>Stations</span>
          </button>
        </div>

      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Graceful Fallback if CARTO Basemaps API key is missing */}
        {!isMapConfigured && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-50/95 backdrop-blur-xs p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[#0b3d91] mb-3 shadow-2xs">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight mb-1">
              Map configuration unavailable
            </h4>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed mb-3">
              A valid CARTO Basemaps API key (<code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono-tech text-[11px]">VITE_CARTO_API_KEY</code>) is required to render geographical basemap tiles.
            </p>
            <div className="text-[11px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-md font-medium shadow-2xs">
              Weather station telemetry and multi-model forecast calculations remain operational.
            </div>
          </div>
        )}

        {/* Clean Scientific Legend Overlay (Top Left) */}
        <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md p-3 text-xs max-w-xs shadow-sm pointer-events-auto">
          <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-100 pb-1.5 mb-1.5">
            <span className="uppercase tracking-wider text-[11px] text-[#0b3d91]">{activeVariable} SYNTHESIS</span>
            <span className="text-[10px] font-mono-tech text-slate-500 font-normal">T+{timelineStep}</span>
          </div>

          <div className="text-xs text-slate-700 mb-1">
            Station Focus: <strong className="text-slate-900">{selectedLocation.name}</strong> ({selectedLocation.lat.toFixed(2)}°N)
          </div>

          <div className="text-[11px] text-slate-500 leading-normal">
            Click any station on the map to switch active focus and view multi-model allocation.
          </div>

          {isMockMode && (
            <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-amber-700 font-medium">
              ● Simulated operational demonstration data
            </div>
          )}
        </div>

        {/* Coordinates Reticle indicator Bottom Left */}
        <div className="absolute bottom-4 left-3 z-20 bg-white/90 px-2.5 py-1 rounded text-[11px] font-mono-tech text-slate-600 border border-slate-200 shadow-2xs">
          COORD: {selectedLocation.lat.toFixed(3)}°N, {selectedLocation.lon.toFixed(3)}°E • ELEV: {selectedLocation.elevation}m
        </div>

      </div>

      {/* Bottom Timeline Controls Bar */}
      <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        
        {/* Play/Pause Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#0b3d91] hover:bg-[#072a66] text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer shadow-2xs"
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
            className="p-1.5 rounded bg-white text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
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
                className={`px-3 py-1 rounded text-xs font-semibold font-mono-tech transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-[#0b3d91] text-white shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
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
