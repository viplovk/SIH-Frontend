import React, { useEffect, useRef } from "react";
import { Layers, HelpCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import gsap from "gsap";

export function HybridModelPanel() {
  const { selectedLocation, openExplainModal, isMockMode } = useWeather();
  const weights = selectedLocation.modelWeights;
  const barsRef = useRef(null);

  useEffect(() => {
    if (barsRef.current) {
      const bars = barsRef.current.querySelectorAll(".weight-fill");
      gsap.fromTo(
        bars,
        { width: "0%" },
        { 
          width: (i, target) => target.dataset.targetWidth,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1
        }
      );
    }
  }, [selectedLocation.id, weights]);

  const models = [
    {
      id: "nwp",
      name: "NWP MODEL",
      subtitle: "ECMWF IFS / IMD High-Res GFS",
      description: "Governed by Navier-Stokes, thermodynamic mass conservation, and hydrostatic balance.",
      weight: weights.nwp,
      color: "bg-sky-400",
      textColor: "text-sky-400",
      border: "border-sky-500/30",
      glow: "shadow-[0_0_12px_rgba(56,189,248,0.2)]"
    },
    {
      id: "aiA",
      name: "AI MODEL A",
      subtitle: "FuXi / GraphCast Spherical Transformer",
      description: "Trained on 40-year ERA5 reanalysis; fast gradient-based precipitation localization.",
      weight: weights.aiA,
      color: "bg-emerald-400",
      textColor: "text-emerald-400",
      border: "border-emerald-500/30",
      glow: "shadow-[0_0_12px_rgba(52,211,153,0.2)]"
    },
    {
      id: "aiB",
      name: "AI MODEL B",
      subtitle: "WeatherNext / Pangu-Weather 3D ViT",
      description: "Pressure-level attention network; conservative long-wave teleconnection trends.",
      weight: weights.aiB,
      color: "bg-amber-400",
      textColor: "text-amber-400",
      border: "border-amber-500/30",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.2)]"
    }
  ];

  return (
    <div className="bg-[#111622] border border-white/[0.08] rounded-lg p-4 sm:p-5 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white tracking-wide flex items-center gap-2">
              HYBRID MODEL
              <span className="text-[10px] font-mono-tech uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                DYNAMIC BLENDING
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono-tech">
              Meta-Learner Condition-Aware Multi-Model Fusion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isMockMode && (
            <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
              DEMO / SIMULATED WEIGHTS
            </span>
          )}
          <button
            onClick={openExplainModal}
            className="flex items-center gap-1 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why these weights?</span>
          </button>
        </div>
      </div>

      {/* Model Weights Progress Bars */}
      <div ref={barsRef} className="space-y-4 mb-4">
        {models.map((m) => (
          <div key={m.id} className="bg-[#151c2b] border border-white/[0.04] rounded p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-baseline gap-2">
                <span className={`font-mono-tech text-xs font-bold tracking-wider ${m.textColor}`}>
                  {m.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono-tech hidden sm:inline">
                  • {m.subtitle}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`font-mono-tech text-base font-bold ${m.textColor}`}>
                  {m.weight}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono-tech">contribution</span>
              </div>
            </div>

            {/* Visual Weight Bar */}
            <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
              <div 
                className={`weight-fill h-full rounded-full transition-all ${m.color} ${m.glow}`}
                data-target-width={`${m.weight}%`}
                style={{ width: `${m.weight}%` }}
              />
            </div>

            <p className="mt-1.5 text-[11px] text-slate-400 leading-normal">
              {m.description}
            </p>
          </div>
        ))}
      </div>

      {/* Hybrid Forecast Synthesis Output Box */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-sky-950/30 to-indigo-950/40 border border-cyan-500/40 rounded p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
            <Zap className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-white tracking-wide">
                HYBRID FORECAST SYNTHESIS
              </span>
              <span className="text-[9px] font-mono-tech text-emerald-400 px-1 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/80 font-mono-tech">
              Residual bias: -0.18°C / +0.4mm • Variance Reduction: 34.2%
            </p>
          </div>
        </div>

        <button
          onClick={openExplainModal}
          className="self-start sm:self-auto px-3 py-1.5 rounded bg-cyan-400 text-slate-950 font-mono-tech text-xs font-semibold hover:bg-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Audit Blending Math</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Explanatory Note */}
      <p className="mt-3 text-[11px] text-slate-400 font-mono-tech leading-relaxed">
        “Model weights adapt according to atmospheric regime, forecast lead time, and geographic location.”
      </p>

    </div>
  );
}
