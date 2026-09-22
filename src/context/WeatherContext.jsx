import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LOCATIONS, DEFAULT_LOCATION } from "../data/locations.js";
import { isMockModeActive, setMockMode } from "../api/client.js";
import { fetchLiveOpenMeteoStations } from "../api/mapApi.js";

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [locationsList, setLocationsList] = useState(LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [timelineStep, setTimelineStep] = useState("NOW");
  const [activeVariable, setActiveVariable] = useState("temperature");
  const [forecastHorizon, setForecastHorizon] = useState("24h");
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isMockMode, setIsMockModeState] = useState(isMockModeActive());
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    const handleMockChange = (e) => {
      setIsMockModeState(e.detail.isMockMode);
    };
    window.addEventListener("algoriot-mock-mode-change", handleMockChange);
    return () => window.removeEventListener("algoriot-mock-mode-change", handleMockChange);
  }, []);

  const handleToggleMock = () => {
    const nextVal = !isMockMode;
    setMockMode(nextVal);
    setIsMockModeState(nextVal);
  };

  const selectLocationById = (id) => {
    const found = locationsList.find((l) => l.id === id);
    if (found) {
      setSelectedLocation(found);
    }
  };

  // Real-time data refresh (Live Open-Meteo or calibrated simulation)
  const refreshWeatherData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchLiveOpenMeteoStations(locationsList);
      if (res && res.data && Array.isArray(res.data)) {
        setLocationsList(res.data);
        if (selectedLocation) {
          const updatedSelected = res.data.find((l) => l.id === selectedLocation.id);
          if (updatedSelected) {
            setSelectedLocation(updatedSelected);
          }
        }
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.warn("Refresh weather data error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [locationsList, selectedLocation]);

  // Periodic polling every 5 minutes in background without interrupting UI
  useEffect(() => {
    const interval = setInterval(() => {
      refreshWeatherData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshWeatherData]);

  const value = {
    selectedLocation,
    setSelectedLocation,
    selectLocationById,
    locationsList,
    timelineStep,
    setTimelineStep,
    activeVariable,
    setActiveVariable,
    forecastHorizon,
    setForecastHorizon,
    isExplainModalOpen,
    openExplainModal: () => setIsExplainModalOpen(true),
    closeExplainModal: () => setIsExplainModalOpen(false),
    isMockMode,
    toggleMockMode: handleToggleMock,
    isSearchingLocation,
    setIsSearchingLocation,
    isRefreshing,
    lastRefreshed,
    refreshWeatherData
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
