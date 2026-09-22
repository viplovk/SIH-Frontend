import React, { useState } from "react";
import { ExtremeRiskCards } from "../components/extremes/ExtremeRiskCards.jsx";
import { ShieldAlert, AlertTriangle, PhoneCall, Radio, FileText, Download, CheckCircle2 } from "lucide-react";
import { HAZARD_SUMMARY } from "../data/mockExtremes.js";

export function Extremes() {
  const [exported, setExported] = useState(false);

  const handleExportBrief = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
            <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
              EXTREME WEATHER & DISASTER INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Smart India Hackathon 2026 • Problem Statement SIH26081 • Theme: Disaster Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBrief}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono-tech hover:bg-rose-500/30 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{exported ? "NDMA Brief Exported!" : "Export NDMA Incident Brief"}</span>
          </button>
        </div>
      </div>

      {/* Disaster Command Operational Alert Summary */}
      <div className="bg-gradient-to-r from-rose-950/40 via-[#111622] to-amber-950/40 border border-rose-500/30 rounded-lg p-5">
        <div className="flex items-center gap-2 text-rose-400 font-mono-tech text-xs uppercase tracking-wider font-semibold mb-2">
          <Radio className="w-4 h-4 animate-ping" />
          <span>EARLY WARNING SYNTHESIS PROTOCOL</span>
        </div>
        
        <h3 className="text-lg font-heading font-bold text-white mb-2">
          Automated Multi-Model Hazard Detection System
        </h3>
        
        <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-4xl">
          Unlike standard single-model warnings that frequently produce false alarms or miss localized cloudburst thresholds, Algoriot evaluates cross-model consensus between physics Navier-Stokes dynamics and high-resolution AI transformers. Disaster response teams receive quantified probability, lead-time windows, and consensus voting.
        </p>

        {/* National Emergency Support Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-slate-300 bg-black/30 p-2 rounded">
            <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>NDRF Hotline: <strong>011-24363260</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 bg-black/30 p-2 rounded">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>CAP Protocol: <strong>ITU-T X.1303 Active</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 bg-black/30 p-2 rounded">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Emergency Operations Center: <strong>Active</strong></span>
          </div>
        </div>
      </div>

      {/* Main Extreme Hazard Cards List */}
      <ExtremeRiskCards />

    </div>
  );
}
