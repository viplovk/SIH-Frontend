import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Activity, 
  Map as MapIcon, 
  Layers, 
  AlertTriangle, 
  Compass, 
  BookOpen, 
  Info, 
  Menu, 
  X, 
  Sliders, 
  Radio, 
  Database,
  CloudSun
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import gsap from "gsap";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isMockMode, toggleMockMode } = useWeather();
  const navRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  const navLinks = [
    { name: "Dashboard", path: "/", icon: Activity },
    { name: "Forecast", path: "/forecast", icon: CloudSun },
    { name: "Weather Map", path: "/map", icon: MapIcon },
    { name: "Models", path: "/models", icon: Layers },
    { name: "Extreme Events", path: "/extremes", icon: AlertTriangle },
    { name: "Uncertainty", path: "/uncertainty", icon: Compass },
    { name: "Research", path: "/research", icon: BookOpen },
    { name: "About", path: "/about", icon: Info }
  ];

  // GSAP initial load entrance animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  // GSAP drawer slide animation
  useEffect(() => {
    if (mobileDrawerRef.current) {
      if (mobileMenuOpen) {
        gsap.fromTo(
          mobileDrawerRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }
        );
      }
    }
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-[#0c1017]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded bg-[#131924] border border-white/10 flex items-center justify-center overflow-hidden">
              <Radio className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-semibold text-base tracking-wider text-slate-100 group-hover:text-white transition-colors">
                  ALGORIOT
                </span>
                <span className="text-[9px] font-mono-tech uppercase px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/10">
                  SIH26
                </span>
              </div>
              <span className="text-[10px] tracking-tight text-slate-400 font-mono-tech -mt-0.5 hidden sm:block">
                HYBRID WEATHER INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "text-slate-100 bg-white/[0.08] border border-white/15"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-200" : "text-slate-500"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Medium Screen Nav Links (compact) */}
          <div className="hidden lg:flex xl:hidden items-center space-x-1">
            {navLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs ${
                    isActive
                      ? "text-slate-100 bg-white/[0.08] border border-white/15"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <Link
              to="/research"
              className={`px-2 py-1 text-xs ${
                location.pathname === "/research" ? "text-slate-100 font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Research
            </Link>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live / Mock Mode Switcher Pill */}
            <button
              onClick={toggleMockMode}
              title={isMockMode ? "Currently using simulated meteorological baseline data. Click to switch to live FastAPI mode." : "Using Live FastAPI connection."}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono-tech border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] transition-all"
            >
              <Database className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">{isMockMode ? "DEMO DATA" : "LIVE API"}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isMockMode ? "bg-amber-400/80" : "bg-emerald-400/80"}`} />
            </button>

            {/* Operational Engine status */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/25 border border-white/[0.06] text-[11px] font-mono-tech text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
              <span>ENGINE: ONLINE</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.08]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-200" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileDrawerRef}
          className="lg:hidden border-t border-white/[0.08] bg-[#0c1017] px-4 pt-2 pb-5 space-y-1 shadow-xl"
        >
          <div className="py-1 mb-2 border-b border-white/[0.05] flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>COMMAND NAVIGATION</span>
            <span className="text-slate-400 text-[10px]">TEAM ALGORIOT</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "text-slate-100 bg-white/[0.08] border border-white/15"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-slate-200" : "text-slate-500"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono-tech text-[11px]">DATA PIPELINE:</span>
            <button
              onClick={toggleMockMode}
              className="text-[11px] font-mono-tech text-slate-300 hover:text-white underline"
            >
              {isMockMode ? "Switch to Live API Mode" : "Switch to Demo Mock Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
