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
import { ArrowRight, Map as MapIcon, AlertTriangle } from "lucide-react";

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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-[#0b3d91]" />
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                SYNOPTIC WEATHER & RADAR OBSERVATION MAP
              </h3>
            </div>
            <Link 
              to="/map" 
              className="text-xs font-semibold text-[#0b3d91] hover:text-[#082a66] flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200"
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
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  ACTIVE EXTREME WEATHER WARNINGS
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Automated multi-model threat assessment for disaster mitigation
              </p>
            </div>

            <Link
              to="/extremes"
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-md border border-rose-200 w-fit"
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
