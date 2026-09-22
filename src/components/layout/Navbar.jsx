import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Database,
  MapPin,
  ChevronRight
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isMockMode, toggleMockMode, selectedLocation, setSelectedLocation, locationsList } = useWeather();
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const navLinks = [
    { name: "Forecast", path: "/forecast" },
    { name: "Weather Map", path: "/map" },
    { name: "Models", path: "/models" },
    { name: "Extreme Weather", path: "/extremes" },
    { name: "Uncertainty", path: "/uncertainty" },
    { name: "About", path: "/about" }
  ];

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowLocationPicker(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900">
      {/* Institutional Top Bar (Subtle scientific notice & location telemetry) */}
      <div className="border-b border-slate-100 bg-slate-50 text-[11px] text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-7 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 tracking-wider">SMART INDIA HACKATHON 2026</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 hidden sm:inline">SIH26081 • DISASTER MANAGEMENT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-status-pulse" />
              <span className="text-slate-700 font-medium">STATION: {selectedLocation.name.toUpperCase()}</span>
            </div>
            <span className="text-slate-300">•</span>
            <button
              onClick={toggleMockMode}
              className="text-[11px] text-slate-600 hover:text-[#0b3d91] font-medium transition-colors cursor-pointer"
            >
              {isMockMode ? "MODE: SIMULATION" : "MODE: LIVE API"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-[#0b3d91] flex items-center justify-center text-white font-bold text-base shadow-sm">
              A
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-[#0b3d91] transition-colors">
                  ALGORIOT
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  HYBRID INTEL
                </span>
              </div>
              <span className="text-[11px] tracking-wide text-slate-500 font-normal uppercase -mt-0.5">
                Hybrid Weather Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 h-full">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`h-full flex items-center px-3.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                    isActive
                      ? "text-[#0b3d91] border-[#0b3d91] bg-blue-50/40"
                      : "text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Location Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-xs"
                title="Change monitoring station"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0b3d91]" />
                <span className="font-semibold">{selectedLocation.name}</span>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>

              {showLocationPicker && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-md shadow-lg p-2 z-50">
                  <div className="text-[11px] uppercase font-semibold text-slate-500 px-2 py-1 border-b border-slate-100 mb-1">
                    Select Meteorological Station
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {locationsList.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationPicker(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          loc.id === selectedLocation.id
                            ? "bg-blue-50 text-[#0b3d91] font-semibold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{loc.name}, {loc.state}</span>
                        <span className="text-[10px] text-slate-400">{loc.baseWeather.temperature}°C</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live / Demo Mode Badge */}
            <button
              onClick={toggleMockMode}
              title={isMockMode ? "Simulated historical and NWP blend data." : "Active live FastAPI ingestion."}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] border font-medium transition-colors ${
                isMockMode
                  ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Database className="w-3 h-3 text-current" />
              <span>{isMockMode ? "SIMULATION DATA" : "LIVE SATELLITE"}</span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl">
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 pb-2 mb-2 border-b border-slate-100">
            Navigation Index
          </div>
          <div className="space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded text-sm font-medium ${
                location.pathname === "/" ? "bg-blue-50 text-[#0b3d91] font-semibold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Dashboard Overview
            </Link>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded text-sm font-medium ${
                    isActive ? "bg-blue-50 text-[#0b3d91] font-semibold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Data Engine:</span>
            <button
              onClick={toggleMockMode}
              className="font-medium text-[#0b3d91] hover:underline"
            >
              {isMockMode ? "Switch to Live IMD Mode" : "Switch to Simulation Mode"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
