import React, { useState } from "react";
import { ExtremeRiskCards } from "../components/extremes/ExtremeRiskCards.jsx";
import { ShieldAlert, PhoneCall, Radio, FileText, CheckCircle2 } from "lucide-react";

export function Extremes() {
  const [exported, setExported] = useState(false);

  const handleExportBrief = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            <span>Disaster Management & Hazard Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            EXTREME WEATHER & DISASTER INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Smart India Hackathon 2026 • Problem Statement SIH26081 • Theme: Disaster Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBrief}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>{exported ? "NDMA Brief Exported!" : "Export NDMA Incident Brief"}</span>
          </button>
        </div>
      </div>

      {/* Disaster Command Operational Alert Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-rose-700 text-xs uppercase tracking-wider font-bold mb-2">
          <Radio className="w-4 h-4 text-rose-600" />
          <span>EARLY WARNING SYNTHESIS PROTOCOL</span>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Automated Multi-Model Hazard Detection System
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          Unlike standard single-model warnings that frequently produce false alarms or miss localized cloudburst thresholds, Algoriot evaluates cross-model consensus between physics Navier-Stokes dynamics and high-resolution AI transformers. Disaster response teams receive quantified probability, lead-time windows, and consensus voting.
        </p>

        {/* National Emergency Support Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 pt-4 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200">
            <PhoneCall className="w-4 h-4 text-slate-500 shrink-0" />
            <span>NDRF Hotline: <strong className="text-slate-900 font-bold">011-24363260</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>CAP Protocol: <strong className="text-slate-900 font-bold">ITU-T X.1303 Active</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Operations Center: <strong className="text-slate-900 font-bold">Active 24/7</strong></span>
          </div>
        </div>
      </div>

      {/* Main Extreme Hazard Cards List */}
      <ExtremeRiskCards />

    </div>
  );
}
