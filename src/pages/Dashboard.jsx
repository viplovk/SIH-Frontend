import React from "react";
import { CommandHero } from "../components/weather/CommandHero.jsx";
import { LocationSelector } from "../components/weather/LocationSelector.jsx";
import { WeatherOverview } from "../components/weather/WeatherOverview.jsx";
import { HybridModelPanel } from "../components/models/HybridModelPanel.jsx";
import { AtmosphericRegimeCard } from "../components/weather/AtmosphericRegimeCard.jsx";
import { ForecastTimeline } from "../components/charts/ForecastTimeline.jsx";
import { IndiaWeatherMap } from "../components/map/IndiaWeatherMap.jsx";
import { ExtremeRiskCards } from "../components/extremes/ExtremeRiskCards.jsx";
import { TechnicalHeaderLine } from "../components/common/StatusBadge.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Map as MapIcon, AlertTriangle, Compass } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Technical Status Ribbon */}
      <TechnicalHeaderLine />

      {/* Hero / Command Center Introduction */}
      <CommandHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Location Selector */}
        <LocationSelector />

        {/* Top Grid: Weather Overview (Primary 2m state) & Atmospheric Regime Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <WeatherOverview />
          </div>
          <div className="lg:col-span-5">
            <AtmosphericRegimeCard />
          </div>
        </div>

        {/* Centerpiece: Hybrid Model Panel (Most important project-specific UI) */}
        <HybridModelPanel />

        {/* Interactive India Weather Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-base text-white">
                INTERACTIVE INDIA METEOROLOGICAL RADAR MAP
              </h3>
            </div>
            <Link 
              to="/map" 
              className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Screen Command Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <IndiaWeatherMap standalone={false} />
        </div>

        {/* Forecast Timeline Chart */}
        <ForecastTimeline />

        {/* Quick Extreme Weather Section Preview */}
        <div className="pt-4 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  ACTIVE EXTREME WEATHER WARNINGS
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                Automated multi-model threat assessment for disaster mitigation
              </p>
            </div>

            <Link
              to="/extremes"
              className="text-xs font-mono-tech text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>View All Disaster Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ExtremeRiskCards />
        </div>

      </div>
    </div>
  );
}
