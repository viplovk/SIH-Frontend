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
            <ShieldAlert className="w-5 h-5 text-rose-300/90" />
            <h1 className="text-2xl font-heading font-semibold text-white tracking-wide">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.08] text-slate-100 border border-white/15 text-xs font-mono-tech hover:bg-white/[0.12] transition-colors cursor-pointer font-medium"
          >
            <FileText className="w-3.5 h-3.5 text-slate-300" />
            <span>{exported ? "NDMA Brief Exported!" : "Export NDMA Incident Brief"}</span>
          </button>
        </div>
      </div>

      {/* Disaster Command Operational Alert Summary */}
      <div className="bg-[#101520] border border-white/[0.08] rounded-lg p-5">
        <div className="flex items-center gap-2 text-rose-300/90 font-mono-tech text-xs uppercase tracking-wider font-medium mb-2">
          <Radio className="w-4 h-4 text-rose-300/80" />
          <span>EARLY WARNING SYNTHESIS PROTOCOL</span>
        </div>
        
        <h3 className="text-lg font-heading font-semibold text-white mb-2">
          Automated Multi-Model Hazard Detection System
        </h3>
        
        <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-4xl">
          Unlike standard single-model warnings that frequently produce false alarms or miss localized cloudburst thresholds, Algoriot evaluates cross-model consensus between physics Navier-Stokes dynamics and high-resolution AI transformers. Disaster response teams receive quantified probability, lead-time windows, and consensus voting.
        </p>

        {/* National Emergency Support Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-slate-300 bg-black/30 p-2 rounded border border-white/[0.04]">
            <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
            <span>NDRF Hotline: <strong className="text-slate-200">011-24363260</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 bg-black/30 p-2 rounded border border-white/[0.04]">
            <CheckCircle2 className="w-4 h-4 text-emerald-300/80 shrink-0" />
            <span>CAP Protocol: <strong className="text-slate-200">ITU-T X.1303 Active</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 bg-black/30 p-2 rounded border border-white/[0.04]">
            <ShieldAlert className="w-4 h-4 text-amber-300/80 shrink-0" />
            <span>Emergency Operations Center: <strong className="text-slate-200">Active</strong></span>
          </div>
        </div>
      </div>

      {/* Main Extreme Hazard Cards List */}
      <ExtremeRiskCards />

    </div>
  );
}
