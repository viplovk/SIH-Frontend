import React, { useState } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  CloudRain, 
  Wind, 
  Sun, 
  Waves, 
  Compass, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users,
  ChevronRight,
  Filter
} from "lucide-react";
import { EXTREME_HAZARDS, HAZARD_SUMMARY } from "../../data/mockExtremes.js";

export function ExtremeRiskCards() {
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [selectedHazard, setSelectedHazard] = useState(null);

  const filtered = EXTREME_HAZARDS.filter((h) => {
    if (filterSeverity === "ALL") return true;
    return h.riskLevel === filterSeverity;
  });

  const getSeverityBadge = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-950/60 text-rose-400 border-rose-500/40 animate-pulse";
      case "HIGH":
        return "bg-amber-950/60 text-amber-400 border-amber-500/40";
      case "ELEVATED":
        return "bg-yellow-950/60 text-yellow-300 border-yellow-500/30";
      case "MODERATE":
        return "bg-blue-950/60 text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-900 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Threat Intelligence Summary Bar */}
      <div className="bg-[#111622] border border-white/[0.08] rounded-lg p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white tracking-wide">
                DISASTER THREAT SYNTHESIS
              </h2>
              <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                EARLY WARNING ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-tech mt-1">
              Objective extreme-weather classification calibrated across IMD AWS ground observation and blended NWP-AI forecasts.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono-tech text-xs">
            <div className="bg-[#161d2d] px-3 py-2 rounded border border-rose-500/30">
              <div className="text-lg font-bold text-rose-400">{HAZARD_SUMMARY.activeCriticalHazards}</div>
              <div className="text-[10px] text-slate-400">CRITICAL ALERTS</div>
            </div>
            <div className="bg-[#161d2d] px-3 py-2 rounded border border-amber-500/30">
              <div className="text-lg font-bold text-amber-400">{HAZARD_SUMMARY.activeHighHazards}</div>
              <div className="text-[10px] text-slate-400">HIGH SEVERITY</div>
            </div>
            <div className="bg-[#161d2d] px-3 py-2 rounded border border-cyan-500/30">
              <div className="text-lg font-bold text-cyan-400">{HAZARD_SUMMARY.populationAtRisk}</div>
              <div className="text-[10px] text-slate-400">POPULATION RISK</div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-mono-tech">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter by Severity:</span>
            {["ALL", "CRITICAL", "HIGH", "ELEVATED", "MODERATE"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterSeverity(lvl)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  filterSeverity === lvl
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "bg-white/[0.04] text-slate-400 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono-tech text-amber-400">
            ● SIMULATED EMERGENCY SCENARIOS FOR SIH EVALUATION
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="bg-[#111622] border border-white/[0.08] hover:border-cyan-500/40 rounded-lg p-4 flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase border ${getSeverityBadge(item.riskLevel)}`}>
                  {item.riskLevel} RISK
                </span>
                <span className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {item.timeframe}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] text-cyan-400/90 font-mono-tech mt-0.5">
                {item.category}
              </p>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono-tech mt-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>

              {/* Probability & Confidence Grid */}
              <div className="grid grid-cols-3 gap-1.5 bg-[#161d2d] p-2.5 rounded my-3 text-center font-mono-tech text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">PROBABILITY</div>
                  <div className="font-bold text-rose-400 text-sm">{item.probability}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">CONFIDENCE</div>
                  <div className="font-bold text-emerald-400 text-sm">{item.confidence}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">AGREEMENT</div>
                  <div className="font-bold text-cyan-400 text-sm">{item.modelAgreement}</div>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                {item.impactSummary}
              </p>

              {/* Multi-model votes */}
              <div className="bg-black/30 p-2 rounded text-[10px] font-mono-tech space-y-1 mb-3 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">NWP Physics Vote:</span>
                  <span className="text-sky-300 font-medium">{item.nwpVote}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Model A Vote:</span>
                  <span className="text-emerald-300 font-medium">{item.aiAVote}</span>
                </div>
              </div>
            </div>

            {/* Protocol Action Line */}
            <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono-tech text-slate-300">
              <span className="text-rose-400 font-bold block mb-0.5">Disaster Protocol:</span>
              <span className="text-slate-400 text-[10px] leading-tight block">
                {item.disasterProtocol}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
