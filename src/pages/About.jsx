import React from "react";
import { 
  Users, 
  Award, 
  Target, 
  ShieldCheck, 
  Cpu, 
  Code, 
  Database, 
  Layers, 
  ExternalLink,
  CheckCircle2,
  Terminal
} from "lucide-react";
import { Link } from "react-router-dom";

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#111622] border border-cyan-500/30 rounded-lg p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-cyan-400" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono-tech text-xs uppercase px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              SMART INDIA HACKATHON 2026
            </span>
            <span className="font-mono-tech text-xs uppercase px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-semibold">
              SIH26081
            </span>
            <span className="font-mono-tech text-xs uppercase px-2.5 py-1 rounded bg-white/[0.05] text-slate-300 font-semibold">
              THEME: DISASTER MANAGEMENT
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white tracking-tight mb-2">
            Hybrid AI-NWP Multi-Model Forecast Blending System
          </h1>

          <p className="text-cyan-400 font-mono-tech text-sm mb-4">
            Team: <strong className="text-white">Algoriot</strong> • Repository: <code className="text-cyan-200">viplovk/SIH-Frontend</code>
          </p>

          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            Algoriot is an advanced meteorological intelligence platform engineered to bridge the gap between deterministic numerical weather prediction (NWP) models governed by atmospheric physics, and modern spherical graph neural network weather surrogates. By dynamically adjusting blending weights based on localized atmospheric regimes, Algoriot drastically reduces forecast error and equips disaster mitigation authorities with calibrated probabilistic risk assessments.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#111622] border border-white/[0.08] p-5 rounded-lg">
          <div className="w-9 h-9 rounded bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-white mb-1">
            Problem Statement
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Severe weather events in India—including convective cloudbursts, tropical cyclones, and heatwaves—cause widespread damage when standard forecasts either fail or sound false alarms.
          </p>
        </div>

        <div className="bg-[#111622] border border-white/[0.08] p-5 rounded-lg">
          <div className="w-9 h-9 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-white mb-1">
            Algoriot Solution
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            An adaptive multi-model blending engine combining ECMWF IFS/IMD GFS with FuXi and WeatherNext using condition-aware meta-learning and physical conservation constraints.
          </p>
        </div>

        <div className="bg-[#111622] border border-white/[0.08] p-5 rounded-lg">
          <div className="w-9 h-9 rounded bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-white mb-1">
            Disaster Mitigation
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Conformal quantile regression yields reliable 90% uncertainty envelopes and actionable emergency protocol warnings mapped to NDMA and SDMA guidelines.
          </p>
        </div>

        <div className="bg-[#111622] border border-white/[0.08] p-5 rounded-lg">
          <div className="w-9 h-9 rounded bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-white mb-1">
            Explainable AI (XAI)
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Transparent auditing of why model weights shift under different atmospheric regimes, enabling non-ML meteorologists and jury members to trust the system.
          </p>
        </div>

      </div>

      {/* Target Beneficiaries */}
      <div className="bg-[#111622] border border-white/[0.08] rounded-lg p-5">
        <h3 className="text-base font-heading font-bold text-white mb-1">
          KEY OPERATIONAL BENEFICIARIES
        </h3>
        <p className="text-xs text-slate-400 font-mono-tech mb-4">
          Stakeholders empowered by high-resolution multi-model blending
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono-tech">
          <div className="bg-[#161d2d] p-3 rounded border border-white/[0.04]">
            <div className="text-cyan-400 font-bold mb-1">NDMA & State Disaster Authorities</div>
            <div className="text-slate-300 font-sans text-xs">Evacuation window planning with lead-time probability metrics.</div>
          </div>
          <div className="bg-[#161d2d] p-3 rounded border border-white/[0.04]">
            <div className="text-emerald-400 font-bold mb-1">India Meteorological Department (IMD)</div>
            <div className="text-slate-300 font-sans text-xs">Assimilating deep neural surrogates with operational GFS grids.</div>
          </div>
          <div className="bg-[#161d2d] p-3 rounded border border-white/[0.04]">
            <div className="text-amber-400 font-bold mb-1">Agricultural & Farmer Cooperatives</div>
            <div className="text-slate-300 font-sans text-xs">Targeted irrigation advisories and localized monsoon onset tracking.</div>
          </div>
          <div className="bg-[#161d2d] p-3 rounded border border-white/[0.04]">
            <div className="text-indigo-400 font-bold mb-1">Coastal & Fisherfolk Communities</div>
            <div className="text-slate-300 font-sans text-xs">High-accuracy squall warnings and wave surge predictions.</div>
          </div>
          <div className="bg-[#161d2d] p-3 rounded border border-white/[0.04]">
            <div className="text-rose-400 font-bold mb-1">Municipal Urban Planners</div>
            <div className="text-slate-300 font-sans text-xs">Urban waterlogging simulation and micro-climate heat stress index.</div>
          </div>
          <div className="bg-[#161d2d] p-3 rounded border border-white/[0.04]">
            <div className="text-teal-400 font-bold mb-1">Aviation & Transport Networks</div>
            <div className="text-slate-300 font-sans text-xs">Clear-air turbulence, low-level wind shear, and fog dispersion.</div>
          </div>
        </div>
      </div>

      {/* Backend Integration Architecture Guide */}
      <div className="bg-[#111622] border border-cyan-500/30 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="font-heading font-bold text-base text-white">
            FASTAPI / PYTHON BACKEND INTEGRATION SPECIFICATION
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
          The frontend includes a fully abstract API service layer (<code className="text-cyan-300">src/api/client.js</code>). When connecting the team's FastAPI / PyTorch inference server, configure the environment variables:
        </p>

        <div className="bg-[#0b0e14] p-3 rounded font-mono-tech text-xs text-slate-300 space-y-1 mb-4 border border-white/[0.06]">
          <div className="text-slate-500"># .env configuration</div>
          <div><span className="text-cyan-400">VITE_API_URL</span>=http://localhost:8000/api/v1</div>
          <div><span className="text-cyan-400">VITE_USE_MOCK_DATA</span>=false</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech">
          <div className="bg-[#161d2d] p-3 rounded">
            <span className="text-cyan-400 font-bold block mb-1">GET /api/v1/forecast/point</span>
            <span className="text-slate-400 text-[11px]">Returns hybrid blend, NWP & AI sub-model values, regime classification, and conformal uncertainty percentiles.</span>
          </div>
          <div className="bg-[#161d2d] p-3 rounded">
            <span className="text-cyan-400 font-bold block mb-1">GET /api/v1/models/metrics</span>
            <span className="text-slate-400 text-[11px]">Returns real-time verification benchmarks (MAE, RMSE, CRPS, Brier score, Extreme F1) evaluated on IMD ground AWS telemetry.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
