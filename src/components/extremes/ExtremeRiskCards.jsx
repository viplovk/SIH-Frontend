import React, { useState } from "react";
import { 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Filter
} from "lucide-react";
import { EXTREME_HAZARDS, HAZARD_SUMMARY } from "../../data/mockExtremes.js";

export function ExtremeRiskCards() {
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  const filtered = EXTREME_HAZARDS.filter((h) => {
    if (filterSeverity === "ALL") return true;
    return h.riskLevel === filterSeverity;
  });

  const getSeverityBadge = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-50 text-red-800 border-red-200 font-semibold";
      case "HIGH":
        return "bg-amber-50 text-amber-800 border-amber-200 font-semibold";
      case "ELEVATED":
        return "bg-yellow-50 text-yellow-800 border-yellow-200 font-semibold";
      case "MODERATE":
        return "bg-slate-100 text-slate-700 border-slate-200 font-semibold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-semibold";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Threat Intelligence Summary Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Early Warning & Civil Protection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              DISASTER THREAT SYNTHESIS
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Objective extreme-weather hazard classification cross-referenced with IMD AWS ground observations and blended NWP-AI forecasts.
            </p>
          </div>

          {/* Quick Institutional Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-red-50/70 px-4 py-2.5 rounded-md border border-red-200">
              <div className="text-2xl font-extrabold text-red-700">{HAZARD_SUMMARY.activeCriticalHazards}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-800 mt-0.5">Critical Alerts</div>
            </div>
            <div className="bg-amber-50/70 px-4 py-2.5 rounded-md border border-amber-200">
              <div className="text-2xl font-extrabold text-amber-700">{HAZARD_SUMMARY.activeHighHazards}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mt-0.5">High Severity</div>
            </div>
            <div className="bg-slate-50 px-4 py-2.5 rounded-md border border-slate-200">
              <div className="text-2xl font-extrabold text-slate-900">{HAZARD_SUMMARY.populationAtRisk}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">Exposed Pop.</div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 font-medium">Filter by Severity:</span>
            {["ALL", "CRITICAL", "HIGH", "ELEVATED", "MODERATE"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterSeverity(lvl)}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  filterSeverity === lvl
                    ? "bg-[#0b3d91] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono-tech">
            Disaster management decision-support protocols active
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 flex flex-col justify-between shadow-xs transition-shadow"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider border ${getSeverityBadge(item.riskLevel)}`}>
                  {item.riskLevel} RISK
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono-tech">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {item.timeframe}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                {item.category}
              </p>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-2.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>

              {/* Probability & Confidence Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-md my-3.5 text-center text-xs border border-slate-200">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Probability</div>
                  <div className="font-extrabold text-red-700 text-sm mt-0.5">{item.probability}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confidence</div>
                  <div className="font-extrabold text-emerald-700 text-sm mt-0.5">{item.confidence}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agreement</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{item.modelAgreement}</div>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                {item.impactSummary}
              </p>

              {/* Multi-model votes */}
              <div className="bg-slate-50 p-2.5 rounded-md text-xs space-y-1 mb-3.5 text-slate-700 border border-slate-200 font-mono-tech">
                <div className="flex justify-between">
                  <span className="text-slate-500">NWP Physics Vote:</span>
                  <span className="font-semibold text-slate-900">{item.nwpVote}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Model A Vote:</span>
                  <span className="font-semibold text-emerald-800">{item.aiAVote}</span>
                </div>
              </div>
            </div>

            {/* Protocol Action Line */}
            <div className="pt-3.5 border-t border-slate-200 text-xs">
              <span className="text-red-700 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                Disaster Protocol Action:
              </span>
              <span className="text-slate-700 text-xs leading-relaxed block">
                {item.disasterProtocol}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
