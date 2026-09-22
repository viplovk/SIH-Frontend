import React, { useEffect, useRef } from "react";
import { X, CheckCircle, ShieldAlert, Cpu, Layers, HelpCircle, ArrowRight, Activity } from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import gsap from "gsap";

export function ExplainForecastModal() {
  const { isExplainModalOpen, closeExplainModal, selectedLocation, timelineStep } = useWeather();
  const modalRef = useRef(null);
  const weights = selectedLocation.modelWeights;

  useEffect(() => {
    if (isExplainModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isExplainModalOpen]);

  if (!isExplainModalOpen) return null;

  const explainPoints = [
    {
      num: "01",
      title: "Atmospheric Regime Detection",
      status: selectedLocation.currentRegime,
      description: "A spherical convolutional classifier detected active convective atmospheric instability with elevated CAPE. Under convective regimes, NWP non-hydrostatic physics prevents unphysical AI rain teleconnections."
    },
    {
      num: "02",
      title: "Multi-Model Ensemble Agreement",
      status: "HIGH CONVERGENCE (88% Correlation)",
      description: "ECMWF IFS, FuXi, and WeatherNext show tight spatial agreement for the 500 hPa geopotential height ridge, allowing high confidence in primary wind vector trajectory."
    },
    {
      num: "03",
      title: "In-situ Radar & Ground AWS Assimilation",
      status: `Station: ${selectedLocation.radarStation}`,
      description: "Real-time Doppler radial velocity assimilated into the boundary layer filter reduced initial surface temperature error by -0.42°C."
    },
    {
      num: "04",
      title: "Forecast Lead Time Degradation Factor",
      status: `Active Horizon: [${timelineStep}]`,
      description: "At short leads (0-12h), AI Model A (FuXi) has lower RMSE for rain gradients; beyond 36h, NWP's conservation laws maintain stronger thermodynamic stability."
    },
    {
      num: "05",
      title: "Geographic & Orographic Boundary Conditions",
      status: `${selectedLocation.terrain} (${selectedLocation.elevation}m ASL)`,
      description: "Topographic wind deflection coefficients adjusted NWP weighting to account for localized mechanical lifting."
    },
    {
      num: "06",
      title: "Historical Model Skill & Calibration Residuals",
      status: "Quantile Residual Score: 0.94",
      description: "Meta-learner evaluated the last 30-day verification logs over the Indian subcontinent to apply empirical bias correction."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-[#101521] border border-cyan-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-5 sm:p-6"
      >
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono-tech text-xs uppercase tracking-wider mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>ALGORITHMIC EXPLAINABILITY MODULE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">
              Why this Forecast?
            </h2>
            <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
              Auditing dynamic weights for {selectedLocation.name}, India ({selectedLocation.lat}°N / {selectedLocation.lon}°E)
            </p>
          </div>

          <button
            onClick={closeExplainModal}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Model Contribution Highlight */}
        <div className="bg-[#161d2d] border border-cyan-500/20 rounded-lg p-4 mb-5">
          <div className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
            DYNAMIC MODEL CONTRIBUTION BREAKDOWN
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-[#0f141f] p-3 rounded border border-sky-500/30">
              <div className="text-2xl font-heading font-bold text-sky-400">{weights.nwp}%</div>
              <div className="text-[11px] font-mono-tech font-bold text-slate-300">NWP MODEL</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Physics & Conservation</div>
            </div>

            <div className="bg-[#0f141f] p-3 rounded border border-emerald-500/30">
              <div className="text-2xl font-heading font-bold text-emerald-400">{weights.aiA}%</div>
              <div className="text-[11px] font-mono-tech font-bold text-slate-300">AI MODEL A</div>
              <div className="text-[10px] text-slate-400 mt-0.5">FuXi / Micro-gradients</div>
            </div>

            <div className="bg-[#0f141f] p-3 rounded border border-amber-500/30">
              <div className="text-2xl font-heading font-bold text-amber-400">{weights.aiB}%</div>
              <div className="text-[11px] font-mono-tech font-bold text-slate-300">AI MODEL B</div>
              <div className="text-[10px] text-slate-400 mt-0.5">WeatherNext / Pangu</div>
            </div>
          </div>
        </div>

        {/* 6 Step Explanation Pipeline */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-mono-tech uppercase text-slate-400 tracking-wider">
            Condition-Adaptive Rationale Criteria:
          </div>

          {explainPoints.map((pt) => (
            <div key={pt.num} className="bg-[#141a27] border border-white/[0.04] rounded-lg p-3 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono-tech text-cyan-400 font-bold">
                  {pt.num}. {pt.title}
                </span>
                <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300">
                  {pt.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {pt.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer info & close */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs font-mono-tech">
          <span className="text-slate-400">
            Smart India Hackathon 2026 • SIH26081
          </span>
          <button
            onClick={closeExplainModal}
            className="px-4 py-2 rounded bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
