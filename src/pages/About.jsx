import React from "react";
import { 
  Target, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Terminal
} from "lucide-react";

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs uppercase px-2.5 py-1 rounded bg-[#0b3d91]/10 text-[#0b3d91] border border-[#0b3d91]/20 font-bold">
              SMART INDIA HACKATHON 2026
            </span>
            <span className="text-xs uppercase px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
              SIH26081
            </span>
            <span className="text-xs uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              THEME: DISASTER MANAGEMENT
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Hybrid AI-NWP Multi-Model Forecast Blending System
          </h1>

          <p className="text-slate-600 text-sm mb-4 font-medium">
            Team: <strong className="text-slate-900">Algoriot</strong> • Repository: <code className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono-tech text-xs">viplovk/SIH-Frontend</code>
          </p>

          <p className="text-slate-600 text-sm leading-relaxed">
            Algoriot is an advanced meteorological intelligence platform engineered to bridge the gap between deterministic numerical weather prediction (NWP) models governed by atmospheric physics, and modern spherical graph neural network weather surrogates. By dynamically adjusting blending weights based on localized atmospheric regimes, Algoriot drastically reduces forecast error and equips disaster mitigation authorities with calibrated probabilistic risk assessments.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs">
          <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1 tracking-tight">
            Problem Statement
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Severe weather events in India—including convective cloudbursts, tropical cyclones, and heatwaves—cause widespread damage when standard forecasts either fail or sound false alarms.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs">
          <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1 tracking-tight">
            Algoriot Solution
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            An adaptive multi-model blending engine combining ECMWF IFS/IMD GFS with FuXi and WeatherNext using condition-aware meta-learning and physical conservation constraints.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs">
          <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1 tracking-tight">
            Disaster Mitigation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Conformal quantile regression yields reliable 90% uncertainty envelopes and actionable emergency protocol warnings mapped to NDMA and SDMA guidelines.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs">
          <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1 tracking-tight">
            Explainable AI (XAI)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Transparent auditing of why model weights shift under different atmospheric regimes, enabling non-ML meteorologists and jury members to trust the system.
          </p>
        </div>

      </div>

      {/* Target Beneficiaries */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
          KEY OPERATIONAL BENEFICIARIES
        </h3>
        <p className="text-xs text-slate-500 mb-5 font-medium">
          Stakeholders empowered by high-resolution multi-model blending
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="text-slate-900 font-bold mb-1">NDMA & State Disaster Authorities</div>
            <div className="text-slate-600 text-xs leading-relaxed">Evacuation window planning with lead-time probability metrics.</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="text-slate-900 font-bold mb-1">India Meteorological Department (IMD)</div>
            <div className="text-slate-600 text-xs leading-relaxed">Assimilating deep neural surrogates with operational GFS grids.</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="text-slate-900 font-bold mb-1">Agricultural & Farmer Cooperatives</div>
            <div className="text-slate-600 text-xs leading-relaxed">Targeted irrigation advisories and localized monsoon onset tracking.</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="text-slate-900 font-bold mb-1">Coastal & Fisherfolk Communities</div>
            <div className="text-slate-600 text-xs leading-relaxed">High-accuracy squall warnings and wave surge predictions.</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="text-slate-900 font-bold mb-1">Municipal Urban Planners</div>
            <div className="text-slate-600 text-xs leading-relaxed">Urban waterlogging simulation and micro-climate heat stress index.</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="text-slate-900 font-bold mb-1">Aviation & Transport Networks</div>
            <div className="text-slate-600 text-xs leading-relaxed">Clear-air turbulence, low-level wind shear, and fog dispersion.</div>
          </div>
        </div>
      </div>

      {/* Backend Integration Architecture Guide */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-[#0b3d91]" />
          <h3 className="font-bold text-lg text-slate-900 tracking-tight">
            FASTAPI / PYTHON BACKEND INTEGRATION SPECIFICATION
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          The frontend includes a fully abstract API service layer (<code className="text-slate-800 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono-tech text-xs">src/api/client.js</code>). When connecting the team's FastAPI / PyTorch inference server, configure the environment variables:
        </p>

        <div className="bg-slate-900 p-4 rounded-md font-mono-tech text-xs text-slate-200 space-y-1 mb-4 border border-slate-800">
          <div className="text-slate-500"># .env configuration</div>
          <div><span className="text-sky-300 font-medium">VITE_API_URL</span>=http://localhost:8000/api/v1</div>
          <div><span className="text-sky-300 font-medium">VITE_USE_MOCK_DATA</span>=false</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <span className="text-slate-900 font-bold block mb-1 font-mono-tech">GET /api/v1/forecast/point</span>
            <span className="text-slate-600 text-xs">Returns hybrid blend, NWP & AI sub-model values, regime classification, and conformal uncertainty percentiles.</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <span className="text-slate-900 font-bold block mb-1 font-mono-tech">GET /api/v1/models/metrics</span>
            <span className="text-slate-600 text-xs">Returns real-time verification benchmarks (MAE, RMSE, CRPS, Brier score, Extreme F1) evaluated on IMD ground AWS telemetry.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
