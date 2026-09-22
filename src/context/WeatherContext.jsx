import React, { createContext, useContext, useState, useEffect } from "react";
import { LOCATIONS, DEFAULT_LOCATION } from "../data/locations.js";
import { isMockModeActive, setMockMode } from "../api/client.js";

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [timelineStep, setTimelineStep] = useState("NOW");
  const [activeVariable, setActiveVariable] = useState("temperature");
  const [forecastHorizon, setForecastHorizon] = useState("24h");
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isMockMode, setIsMockModeState] = useState(isMockModeActive());
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

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
    const found = LOCATIONS.find((l) => l.id === id);
    if (found) {
      setSelectedLocation(found);
    }
  };

  const value = {
    selectedLocation,
    setSelectedLocation,
    selectLocationById,
    locationsList: LOCATIONS,
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
    setIsSearchingLocation
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
