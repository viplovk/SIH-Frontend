// Algoriot Advanced Meteorological Command Map
// SIH26081 — Disaster Management & Hybrid Weather Intelligence
// Strictly Real Data Ingestion (Open-Meteo & FastAPI Backend)

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  RefreshCw,
  Info,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";

import { 
  fetchLiveMeteorologicalDataset, 
  interpolateSpatialPoint, 
  FORECAST_OFFSETS, 
  INDIA_BBOX 
} from "../../api/mapApi.js";
import { WeatherAnimationController } from "../../controllers/WeatherAnimationController.js";

// Continuous Canvas Layers
import { WindVectorCanvasLayer } from "./WindVectorCanvasLayer.jsx";
import { PrecipitationFieldCanvasLayer } from "./PrecipitationFieldCanvasLayer.jsx";
import { TemperatureFieldCanvasLayer } from "./TemperatureFieldCanvasLayer.jsx";
import { AirQualityFieldCanvasLayer } from "./AirQualityFieldCanvasLayer.jsx";
import { HumidityFieldCanvasLayer } from "./HumidityFieldCanvasLayer.jsx";
import { AtmosphericPressureCanvasLayer } from "./AtmosphericPressureCanvasLayer.jsx";
import { CloudCoverCanvasLayer } from "./CloudCoverCanvasLayer.jsx";
import { HybridModelCanvasLayer } from "./HybridModelCanvasLayer.jsx";

// Overlays & Controls
import { MapLayerControl } from "./MapLayerControl.jsx";
import { MapLegend } from "./MapLegend.jsx";
import { LocationInspectorPanel } from "./LocationInspectorPanel.jsx";
import { createCityDivIcon, buildCityPopupHtml } from "./CityMarker.jsx";

// Survey bounds for India Subcontinent
const INDIA_BOUNDS = [
  [6.8, 68.0],   // Southwest (Kanyakumari / Lakshadweep)
  [37.2, 97.5]   // Northeast (Kashmir / Arunachal Pradesh)
];
const INDIA_CENTER = [22.5, 80.0];

export function IndiaWeatherMap({ standalone = false }) {
  const mapContainerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const controllerRef = useRef(null);

  // Map state
  const [map, setMap] = useState(null);

  // Real Meteorological Data State
  const [dataset, setDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Layer State
  const [activeLayer, setActiveLayer] = useState("temperature");
  const [layerOpacity, setLayerOpacity] = useState(0.8);
  const [showWindParticles, setShowWindParticles] = useState(true);
  const [showCityMarkers, setShowCityMarkers] = useState(true);

  // Timeline / Animation State
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1.0);

  // Point Inspection State
  const [inspectedPoint, setInspectedPoint] = useState(null);

  // Decoupled refs to prevent re-initializing listeners or maps
  const datasetRef = useRef(dataset);
  datasetRef.current = dataset;
  const currentTimeIndexRef = useRef(currentTimeIndex);
  currentTimeIndexRef.current = currentTimeIndex;

  // 1. Fetch Real Meteorological Dataset
  const loadWeatherData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await fetchLiveMeteorologicalDataset(forceRefresh);
      setDataset(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("[IndiaWeatherMap] Ingest error:", err);
      setFetchError("Live meteorological ingest failed. Verify network connectivity.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // 2. Initialize WeatherAnimationController
  useEffect(() => {
    const ctrl = new WeatherAnimationController({
      initialLayer: activeLayer,
      initialTimeIndex: currentTimeIndex,
      frames: FORECAST_OFFSETS,
      animationSpeed: animSpeed,
      onFrameUpdate: (state) => {
        setCurrentTimeIndex(state.currentTimeIndex);
        setIsPlaying(state.isPlaying);
      }
    });

    controllerRef.current = ctrl;

    return () => {
      ctrl.destroy();
    };
  }, []);

  // Sync speed changes to controller
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setSpeed(animSpeed);
    }
  }, [animSpeed]);

  // 3. Initialize Leaflet Map (Mounts ONCE)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any stale container references
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const mapInstance = L.map(mapContainerRef.current, {
      center: INDIA_CENTER,
      zoom: standalone ? 5.2 : 4.8,
      minZoom: 4,
      maxZoom: 11,
      maxBounds: [
        [3.0, 58.0],
        [41.0, 107.0]
      ],
      maxBoundsViscosity: 0.85,
      zoomControl: false,
      attributionControl: true
    });

    // High performance, clean basemap tiles:
    const cartoKey = import.meta.env.VITE_CARTO_API_KEY;
    const tileUrl = cartoKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      subdomains: "abcd",
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(mapInstance);

    // Zoom controls on bottom right
    L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

    // Marker Layer Group
    const markersGroup = L.layerGroup().addTo(mapInstance);
    markersGroupRef.current = markersGroup;

    // Handle Map Clicks for Spatial Inspection using stable refs
    mapInstance.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (lat >= INDIA_BBOX.south - 1 && lat <= INDIA_BBOX.north + 1 &&
          lng >= INDIA_BBOX.west - 1 && lng <= INDIA_BBOX.east + 1) {
        if (datasetRef.current && datasetRef.current.stations) {
          const pointTelemetry = interpolateSpatialPoint(
            datasetRef.current.stations,
            lat,
            lng,
            currentTimeIndexRef.current
          );
          setInspectedPoint(pointTelemetry);
        }
      }
    });

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (mapInstance && mapInstance._mapPane) {
        mapInstance.invalidateSize();
      }
    });
    ro.observe(mapContainerRef.current);

    const initTimer = setTimeout(() => {
      if (mapInstance && mapInstance._mapPane) {
        mapInstance.invalidateSize();
      }
    }, 200);

    setMap(mapInstance);

    return () => {
      clearTimeout(initTimer);
      ro.disconnect();
      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();
        markersGroupRef.current = null;
      }
      mapInstance.remove();
      setMap(null);
    };
  }, [standalone]);

  // 4. Update Inspected Point if active frame or dataset changes
  useEffect(() => {
    if (inspectedPoint && dataset && dataset.stations) {
      const updated = interpolateSpatialPoint(
        dataset.stations,
        inspectedPoint.lat,
        inspectedPoint.lon,
        currentTimeIndex
      );
      setInspectedPoint(updated);
    }
  }, [currentTimeIndex, dataset]);

  // 5. Render Subtle City Station Markers
  useEffect(() => {
    if (!map || !map._mapPane || !markersGroupRef.current) return;
    const group = markersGroupRef.current;
    group.clearLayers();

    if (!showCityMarkers || !dataset || !dataset.stations) return;

    // Filter to major recognizable hubs for orientation without clutter
    const KEY_CITIES = [
      "Srinagar", "Delhi NCR", "Jaipur", "Lucknow", "Patna", "Guwahati",
      "Ahmedabad", "Mumbai", "Pune", "Kolkata", "Bhubaneswar", "Nagpur",
      "Bhopal", "Hyderabad", "Bengaluru", "Chennai", "Kochi"
    ];

    dataset.stations.forEach((st) => {
      if (!KEY_CITIES.includes(st.name)) return;

      const frame = st.forecastSeries?.[currentTimeIndex] || st.current;
      const isSelected = inspectedPoint?.name === st.name;

      // Active value display based on layer
      let activeVal = null;
      let unit = "";
      if (activeLayer === "temperature") {
        activeVal = Math.round(frame.temperature);
        unit = "°";
      } else if (activeLayer === "wind") {
        activeVal = Math.round(frame.windSpeed);
        unit = "k";
      } else if (activeLayer === "precipitation" && frame.precipitation > 0) {
        activeVal = frame.precipitation;
        unit = "mm";
      } else if (activeLayer === "aqi") {
        activeVal = frame.aqi;
        unit = "";
      }

      const icon = createCityDivIcon(st, isSelected, activeVal, unit);
      const marker = L.marker([st.lat, st.lon], { icon, zIndexOffset: isSelected ? 800 : 100 });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        const pointData = {
          name: st.name,
          lat: st.lat,
          lon: st.lon,
          nearestStation: st.name,
          distanceKm: 0,
          validTime: frame.validTime,
          temperature: frame.temperature,
          precipitation: frame.precipitation,
          windSpeed: frame.windSpeed,
          windDirection: frame.windDirection,
          u: frame.u,
          v: frame.v,
          aqi: frame.aqi,
          humidity: frame.humidity,
          pressure: frame.pressure,
          cloudCover: frame.cloudCover
        };
        setInspectedPoint(pointData);
      });

      group.addLayer(marker);
    });
  }, [map, showCityMarkers, dataset, currentTimeIndex, activeLayer, inspectedPoint?.name]);

  // Reset to full India view
  const handleResetIndiaView = useCallback(() => {
    if (map && map._mapPane) {
      map.fitBounds(INDIA_BOUNDS, {
        padding: [24, 24],
        animate: true,
        duration: 0.8
      });
    }
  }, [map]);

  // Timeline handlers
  const handlePlayToggle = () => {
    if (controllerRef.current) {
      controllerRef.current.togglePlay();
    }
  };

  const handleStepSelect = (idx) => {
    if (controllerRef.current) {
      controllerRef.current.setTime(idx);
    }
  };

  const activeFrame = FORECAST_OFFSETS[currentTimeIndex] || FORECAST_OFFSETS[0];

  return (
    <div className={`flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm relative ${
      standalone ? "h-[760px] lg:h-[860px]" : "h-[580px] sm:h-[640px]"
    }`}>
      
      {/* Top Telemetry & Controls Toolbar */}
      <div className="bg-slate-50 px-3.5 sm:px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-20">
        
        {/* Left: Heading & Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Compass className="w-3.5 h-3.5 text-[#0b3d91]" />
            <span>Interactive Weather Map</span>
          </div>

          <span className="text-slate-300">|</span>

          <button
            onClick={handleResetIndiaView}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-[#0b3d91] flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
            title="Fit Subcontinent Boundaries"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Fit India</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real Open-Meteo Ingest</span>
          </span>
        </div>

        {/* Right: Refresh button and Live Timestamp */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => loadWeatherData(true)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors disabled:opacity-50"
            title="Fetch latest meteorological telemetry"
          >
            <RefreshCw className={`w-3 h-3 text-[#0b3d91] ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">
              {isLoading ? "Ingesting data..." : lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Refresh"}
            </span>
          </button>

          <div className="text-[10px] font-mono bg-blue-50 text-[#0b3d91] px-2 py-0.5 rounded border border-blue-200 font-bold">
            {activeFrame.label} ({activeFrame.offsetHours === 0 ? "NOW" : `+${activeFrame.offsetHours}h`})
          </div>
        </div>

      </div>

      {/* Main Interactive Map Stage */}
      <div className="relative flex-1 w-full bg-slate-100 overflow-hidden">
        
        {/* Leaflet DOM Anchor */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Continuous Field Layers (Rendered onto Canvas overlays) */}
        {map && map._mapPane && dataset && (
          <>
            {/* 1. Temperature Continuous Field */}
            <TemperatureFieldCanvasLayer
              map={map}
              stations={dataset.stations}
              frameIndex={currentTimeIndex}
              visible={activeLayer === "temperature"}
              opacity={layerOpacity}
            />

            {/* 2. Precipitation Continuous Field */}
            <PrecipitationFieldCanvasLayer
              map={map}
              stations={dataset.stations}
              frameIndex={currentTimeIndex}
              visible={activeLayer === "precipitation"}
              opacity={layerOpacity}
            />

            {/* 3. Wind Vector Particles (Active Layer or Secondary Overlay) */}
            <WindVectorCanvasLayer
              map={map}
              stations={dataset.stations}
              frameIndex={currentTimeIndex}
              visible={activeLayer === "wind" || showWindParticles}
              opacity={activeLayer === "wind" ? layerOpacity : 0.65}
            />

            {/* 4. Air Quality Continuous Field */}
            <AirQualityFieldCanvasLayer
              map={map}
              stations={dataset.stations}
              frameIndex={currentTimeIndex}
              visible={activeLayer === "aqi"}
              opacity={layerOpacity}
            />

            {/* 5. Relative Humidity Field */}
            <HumidityFieldCanvasLayer
              map={map}
              stations={dataset.stations}
              frameIndex={currentTimeIndex}
              visible={activeLayer === "humidity"}
              opacity={layerOpacity}
            />

            {/* 6. Surface Pressure Field */}
            <AtmosphericPressureCanvasLayer
              map={map}
              stations={dataset.stations}
              frameIndex={currentTimeIndex}
              visible={activeLayer === "pressure"}
              opacity={layerOpacity}
            />

            {/* 7. Cloud Cover Density Field */}
            <CloudCoverCanvasLayer
              map={map}
              stations={dataset.stations}
              frameIndex={currentTimeIndex}
              visible={activeLayer === "clouds"}
              opacity={layerOpacity}
            />

            {/* 8. Hybrid AI-NWP Multi-Model Blending Layer */}
            <HybridModelCanvasLayer
              visible={activeLayer === "hybrid"}
            />
          </>
        )}

        {/* Floating Top-Right: Map Layer Selector */}
        <div className="absolute top-3 right-3 z-400">
          <MapLayerControl
            activeLayer={activeLayer}
            onSelectLayer={(layerId) => setActiveLayer(layerId)}
            showCityMarkers={showCityMarkers}
            onToggleCityMarkers={setShowCityMarkers}
            showWindParticles={showWindParticles}
            onToggleWindParticles={setShowWindParticles}
            layerOpacity={layerOpacity}
            onChangeOpacity={setLayerOpacity}
          />
        </div>

        {/* Floating Top-Left: Click-to-Inspect Point Panel */}
        {inspectedPoint && (
          <div className="absolute top-3 left-3 z-400">
            <LocationInspectorPanel
              inspectionData={inspectedPoint}
              onClose={() => setInspectedPoint(null)}
            />
          </div>
        )}

        {/* Floating Bottom-Left: Dynamic Map Legend */}
        <div className={`absolute bottom-4 left-3 z-300 ${inspectedPoint ? "hidden sm:block" : "block"}`}>
          <MapLegend
            activeLayer={activeLayer}
            dataset={dataset}
            frameIndex={currentTimeIndex}
          />
        </div>

        {/* Ingest Error Notice */}
        {fetchError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-400 bg-red-50 border border-red-200 text-red-800 px-3 py-1.5 rounded-lg shadow-md text-xs flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* Coordinates status label at Bottom Right */}
        <div className="absolute bottom-3 right-14 z-200 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-slate-600 border border-slate-200 shadow-2xs hidden sm:block pointer-events-none">
          SURVEY: 6.8°N–37.2°N / 68.0°E–97.5°E • WGS84
        </div>

      </div>

      {/* Bottom Timeline Controls Bar */}
      <div className="bg-slate-50 px-3.5 sm:px-6 py-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        
        {/* Play / Pause & Speed Control */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handlePlayToggle}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-[#0b3d91] hover:bg-[#082a66] text-white"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? "PAUSE" : "PLAY TIMELINE"}</span>
          </button>

          {/* Speed Toggle (0.5x, 1x, 2x) */}
          <div className="flex items-center rounded border border-slate-200 bg-white overflow-hidden text-[10px] font-mono font-bold">
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setAnimSpeed(s)}
                className={`px-1.5 py-1 cursor-pointer transition-colors ${
                  animSpeed === s ? "bg-[#0b3d91] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
            STEP: <strong>{activeFrame.label}</strong>
          </span>
        </div>

        {/* Real Forecast Horizon Step Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 justify-center">
          {FORECAST_OFFSETS.map((fo) => {
            const isSelected = fo.index === currentTimeIndex;
            return (
              <button
                key={fo.index}
                onClick={() => handleStepSelect(fo.index)}
                className={`px-2.5 sm:px-3 py-1 text-xs font-mono rounded transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0b3d91] text-white font-bold shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {fo.label}
              </button>
            );
          })}
        </div>

        {/* Ingest verification tag */}
        <div className="hidden lg:flex items-center text-[10px] text-slate-500 gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Continuous Meteorological Raster Engine</span>
        </div>

      </div>

    </div>
  );
}
