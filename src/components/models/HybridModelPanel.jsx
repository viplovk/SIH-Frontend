import React from "react";
import { Layers, ArrowRight, HelpCircle, CheckCircle } from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";

export function HybridModelPanel() {
  const { selectedLocation, openExplainModal, isMockMode } = useWeather();
  const weights = selectedLocation.modelWeights;

  const models = [
    {
      id: "nwp",
      name: "NWP MODEL",
      subtitle: "ECMWF IFS / IMD High-Resolution GFS",
      description: "Governed by Navier-Stokes dynamical equations, thermodynamic mass conservation, and atmospheric physics parameterizations.",
      weight: weights.nwp,
      barColor: "bg-[#0b3d91]",
      textColor: "text-[#0b3d91]",
      badge: "Physics Baseline"
    },
    {
      id: "aiA",
      name: "AI MODEL A",
      subtitle: "FuXi / Spherical Graph Neural Network",
      description: "Trained on 40-year ERA5 reanalysis; fast gradient-based precipitation localization and regional mesoscale feature capture.",
      weight: weights.aiA,
      barColor: "bg-emerald-600",
      textColor: "text-emerald-700",
      badge: "Fast Convective Surrogates"
    },
    {
      id: "aiB",
      name: "AI MODEL B",
      subtitle: "WeatherNext / Pangu-Weather 3D ViT",
      description: "Pressure-level attention network; conservative synoptic long-wave teleconnection trends and geopotential balance.",
      weight: weights.aiB,
      barColor: "bg-amber-600",
      textColor: "text-amber-700",
      badge: "Synoptic Attention"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-200 gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0b3d91]" />
            <span>Multi-Model Blending Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            HOW THE FORECAST IS BUILT
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Different atmospheric conditions require different models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isMockMode && (
            <span className="text-[11px] font-medium uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              SIMULATED WEIGHTS
            </span>
          )}
          <button
            onClick={openExplainModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b3d91] hover:text-[#072a66] px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>EXPLAIN WEIGHTING MATH →</span>
          </button>
        </div>
      </div>

      {/* Horizontal Model Contribution Bar (Unified) */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Active Forecast Weight Distribution</span>
          <span className="font-mono-tech text-slate-700">Total: 100%</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
          <div 
            style={{ width: `${weights.nwp}%` }} 
            className="h-full bg-[#0b3d91] transition-all" 
            title={`NWP: ${weights.nwp}%`}
          />
          <div 
            style={{ width: `${weights.aiA}%` }} 
            className="h-full bg-emerald-600 transition-all" 
            title={`AI-A: ${weights.aiA}%`}
          />
          <div 
            style={{ width: `${weights.aiB}%` }} 
            className="h-full bg-amber-600 transition-all" 
            title={`AI-B: ${weights.aiB}%`}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0b3d91]" />
            <span>NWP Model ({weights.nwp}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <span>AI Model A ({weights.aiA}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" />
            <span>AI Model B ({weights.aiB}%)</span>
          </span>
        </div>
      </div>

      {/* 3 Model Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {models.map((m) => (
          <div key={m.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {m.badge}
                </span>
                <span className={`text-xl font-extrabold ${m.textColor}`}>
                  {m.weight}%
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
              <p className="text-xs text-slate-500 font-medium mb-2">{m.subtitle}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${m.barColor}`} style={{ width: `${m.weight}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plain Language Summary Callout (Understood in 10 seconds by SIH Juror) */}
      <div className="p-4 rounded-md bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase text-[#0b3d91] tracking-wider">
            Regime-Aware Dynamic Adaptation
          </div>
          <p className="text-sm text-slate-800">
            The system dynamically adjusts model contribution according to atmospheric regime, location and forecast lead time.
          </p>
        </div>

        <button
          onClick={openExplainModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-bold bg-[#0b3d91] hover:bg-[#072a66] text-white transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <span>EXPLAIN WEIGHTING MATH</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
