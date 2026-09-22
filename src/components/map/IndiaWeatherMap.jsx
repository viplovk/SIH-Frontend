import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Compass, 
  Layers, 
  Thermometer, 
  AlertTriangle, 
  Maximize2,
  Minimize2
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import { TIMELINE_STEPS } from "../../data/mockForecast.js";
import { TemperatureHeatmap } from "./TemperatureHeatmap.jsx";
import { MapLegend } from "./MapLegend.jsx";
import { MapLayerControl } from "./MapLayerControl.jsx";
import { createCityDivIcon, buildCityPopupHtml } from "./CityMarker.jsx";
import { getLocationForecastAtStep } from "../../api/mapApi.js";

// India geographic bounds
const INDIA_BOUNDS = [
  [6.8, 68.0],   // Southwest corner (Kanyakumari / Lakshadweep)
  [37.2, 97.5]   // Northeast corner (Kashmir / Arunachal Pradesh)
];

const INDIA_CENTER = [22.8, 79.5];

export function IndiaWeatherMap({ standalone = false }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const secondaryOverlayGroupRef = useRef(null);

  const { 
    selectedLocation, 
    setSelectedLocation, 
    locationsList, 
    timelineStep, 
    setTimelineStep, 
    isMockMode
  } = useWeather();

  const [isPlaying, setIsPlaying] = useState(false);
  const [mapZoom, setMapZoom] = useState(standalone ? 5.2 : 4.8);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.75);

  // Active layers state
  const [layers, setLayers] = useState({
    heatmap: true,
    cityMarkers: true,
    weatherOverlay: false,
    extremeZones: false,
    uncertainty: false
  });

  const toggleLayer = useCallback((layerId) => {
    setLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  }, []);

  // Read CARTO Basemaps API key from environment
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const isMapConfigured = Boolean(cartoApiKey && typeof cartoApiKey === "string" && cartoApiKey.trim().length > 0);

  // Initialize Leaflet Map with CARTO Voyager Raster Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : INDIA_CENTER;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: standalone ? 5.2 : 4.8,
      minZoom: 4,
      maxZoom: 10,
      maxBounds: [
        [4.0, 60.0],
        [40.0, 105.0]
      ],
      maxBoundsViscosity: 0.8,
      zoomControl: false,
      attributionControl: true
    });

    // CARTO Voyager Tiles with API key
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

    // Layer groups for markers and auxiliary overlays
    const secondaryOverlayGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    secondaryOverlayGroupRef.current = secondaryOverlayGroup;
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    map.on("zoomend", () => {
      setMapZoom(map.getZoom());
    });

    // Invalidate size on container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial timeout to prevent blank map issue after page transition
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isMapConfigured]);

  // Handle map center when selectedLocation changes externally
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      const currentCenter = mapInstanceRef.current.getCenter();
      const dist = Math.hypot(currentCenter.lat - selectedLocation.lat, currentCenter.lng - selectedLocation.lon);
      // Only fly if not already centered on it
      if (dist > 0.05) {
        mapInstanceRef.current.flyTo(
          [selectedLocation.lat, selectedLocation.lon],
          Math.max(mapInstanceRef.current.getZoom(), 5.8),
          { duration: 0.8 }
        );
      }
    }
  }, [selectedLocation?.id]);

  // Reset to full India View
  const handleResetIndiaView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(INDIA_BOUNDS, {
        padding: [24, 24],
        animate: true,
        duration: 0.8
      });
    }
  }, []);

  // Timeline Auto-play Loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineStep((curr) => {
          const idx = TIMELINE_STEPS.indexOf(curr);
          return TIMELINE_STEPS[(idx + 1) % TIMELINE_STEPS.length];
        });
      }, 2200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, setTimelineStep]);

  // Render City Markers and Secondary Overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !secondaryOverlayGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    const secondaryGroup = secondaryOverlayGroupRef.current;

    markersGroup.clearLayers();
    secondaryGroup.clearLayers();

    // 1. Render City Markers (Above heatmap at zIndex 600)
    if (layers.cityMarkers) {
      locationsList.forEach((loc) => {
        const isSelected = loc.id === selectedLocation?.id;
        const currentForecast = getLocationForecastAtStep(loc, timelineStep);

        const icon = createCityDivIcon(loc, currentForecast, isSelected);
        const marker = L.marker([loc.lat, loc.lon], {
          icon,
          zIndexOffset: isSelected ? 1000 : 100
        });

        const popupHtml = buildCityPopupHtml(loc, currentForecast, timelineStep);
        marker.bindPopup(popupHtml, {
          className: "algoriot-scientific-popup",
          maxWidth: 320,
          minWidth: 260
        });

        marker.on("click", () => {
          setSelectedLocation(loc);
        });

        markersGroup.addLayer(marker);
      });
    }

    // 2. Render Secondary Layers if enabled:
    // Weather Overlay (Precipitation & convective plumes)
    if (layers.weatherOverlay) {
      locationsList.forEach((loc) => {
        const forecast = getLocationForecastAtStep(loc, timelineStep);
        const precip = forecast.weather.precipitation || 0;
        if (precip > 35) {
          const rainRadius = (precip / 100) * 140000;
          const circle = L.circle([loc.lat, loc.lon], {
            color: "#0284c7",
            weight: 1.5,
            fillColor: "#38bdf8",
            fillOpacity: 0.22,
            dashArray: "4, 4",
            radius: rainRadius,
            interactive: false
          });
          secondaryGroup.addLayer(circle);
        }
      });
    }

    // Extreme Weather Zones
    if (layers.extremeZones) {
      locationsList.forEach((loc) => {
        if (loc.extremeAlert) {
          const isCritical = loc.extremeAlert.severity === "CRITICAL";
          const isHigh = loc.extremeAlert.severity === "HIGH";
          const alertColor = isCritical ? "#dc2626" : isHigh ? "#ea580c" : "#eab308";
          
          const alertCircle = L.circle([loc.lat, loc.lon], {
            color: alertColor,
            weight: 2,
            fillColor: alertColor,
            fillOpacity: 0.25,
            radius: isCritical ? 160000 : 110000,
            interactive: false
          });
          secondaryGroup.addLayer(alertCircle);
        }
      });
    }

    // Uncertainty & Model Spread (confidence envelopes)
    if (layers.uncertainty) {
      locationsList.forEach((loc) => {
        const spreadRadius = 90000 + (loc.elevation > 500 ? 50000 : 20000);
        const uncertaintyCircle = L.circle([loc.lat, loc.lon], {
          color: "#7c3aed",
          weight: 1,
          fillColor: "#8b5cf6",
          fillOpacity: 0.12,
          dashArray: "2, 6",
          radius: spreadRadius,
          interactive: false
        });
        secondaryGroup.addLayer(uncertaintyCircle);
      });
    }
  }, [layers, locationsList, selectedLocation?.id, timelineStep, setSelectedLocation]);

  return (
    <div className={`flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm ${
      standalone ? "h-[740px] lg:h-[820px]" : "h-[540px] sm:h-[600px]"
    }`}>
      
      {/* Top Map Action Toolbar */}
      <div className="bg-slate-50 px-3.5 sm:px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 z-20">
        
        {/* Left: Active Status & Reset India View */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Compass className="w-3.5 h-3.5 text-[#0b3d91]" />
            <span>India Weather Map</span>
          </div>

          <span className="text-slate-300">|</span>

          <button
            onClick={handleResetIndiaView}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-[#0b3d91] flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
            title="Fit India Boundaries"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Fit India</span>
          </button>
        </div>

        {/* Right: Quick Station Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 hidden sm:inline">Active Focus:</span>
          <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs">
            {selectedLocation?.name || "All India"} ({selectedLocation?.lat.toFixed(1)}°N)
          </span>
          <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-blue-50 text-[#0b3d91] font-semibold border border-blue-200">
            T{timelineStep}
          </span>
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="relative flex-1 w-full bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Temperature Heatmap Layer Canvas */}
        {mapInstanceRef.current && (
          <TemperatureHeatmap
            map={mapInstanceRef.current}
            timelineStep={timelineStep}
            opacity={heatmapOpacity}
            visible={layers.heatmap}
          />
        )}

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
              Temperature heatmap calculations and weather telemetry remain operational.
            </div>
          </div>
        )}

        {/* Floating Top-Right: Map Layer Controls */}
        <div className="absolute top-3 right-3 z-20">
          <MapLayerControl
            layers={layers}
            onToggleLayer={toggleLayer}
          />
        </div>

        {/* Floating Bottom-Left: Professional Temperature Scale Legend */}
        {layers.heatmap && (
          <div className="absolute bottom-4 left-3 z-20">
            <MapLegend
              isMockMode={isMockMode}
              opacity={heatmapOpacity}
              onOpacityChange={setHeatmapOpacity}
            />
          </div>
        )}

        {/* Map Coordinates Reticle indicator Bottom Right */}
        <div className="absolute bottom-3 right-14 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono-tech text-slate-600 border border-slate-200 shadow-2xs hidden sm:block">
          SURVEY BOUNDS: 8.0°N–37.0°N / 68.0°E–97.0°E • EPSG:3857
        </div>
      </div>

      {/* Bottom Timeline Controls Bar */}
      <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        
        {/* Play/Pause Control */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-[#0b3d91] hover:bg-[#082a66] text-white"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? "PAUSE FORECAST" : "ANIMATE TIMELINE"}</span>
          </button>

          <span className="text-xs text-slate-500 font-mono-tech sm:ml-2">
            STEP: <strong>{timelineStep}</strong>
          </span>
        </div>

        {/* Timeline Horizon Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 justify-center">
          {TIMELINE_STEPS.map((step) => {
            const isSelected = step === timelineStep;
            return (
              <button
                key={step}
                onClick={() => {
                  setTimelineStep(step);
                  setIsPlaying(false);
                }}
                className={`px-2.5 sm:px-3 py-1 text-xs font-mono-tech rounded transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0b3d91] text-white font-bold shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {step}
              </button>
            );
          })}
        </div>

        {/* Technical Reference Note */}
        <div className="hidden lg:flex items-center text-[11px] text-slate-500 gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0b3d91]" />
          <span>India-wide 0.5° Temperature Heat-Grid</span>
        </div>

      </div>

    </div>
  );
}
