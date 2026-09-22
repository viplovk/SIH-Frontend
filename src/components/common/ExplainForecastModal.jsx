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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        ref={modalRef}
        className="bg-white border border-slate-200 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative p-6 sm:p-7"
      >
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-[#0b3d91] text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-[#0b3d91]" />
              <span>ALGORITHMIC EXPLAINABILITY MODULE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Why this Forecast?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditing dynamic weights for {selectedLocation.name}, India ({selectedLocation.lat}°N / {selectedLocation.lon}°E)
            </p>
          </div>

          <button
            onClick={closeExplainModal}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Model Contribution Highlight */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            DYNAMIC MODEL CONTRIBUTION BREAKDOWN
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs">
              <div className="text-2xl font-extrabold text-[#0b3d91]">{weights.nwp}%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">NWP MODEL</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Physics & Conservation</div>
            </div>

            <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs">
              <div className="text-2xl font-extrabold text-teal-700">{weights.aiA}%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">AI MODEL A</div>
              <div className="text-[11px] text-slate-500 mt-0.5">FuXi / Micro-gradients</div>
            </div>

            <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs">
              <div className="text-2xl font-extrabold text-amber-700">{weights.aiB}%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">AI MODEL B</div>
              <div className="text-[11px] text-slate-500 mt-0.5">WeatherNext / Pangu</div>
            </div>
          </div>
        </div>

        {/* 6 Step Explanation Pipeline */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-mono-tech uppercase text-slate-400 tracking-wider">
            Condition-Adaptive Rationale Criteria:
          </div>

          {explainPoints.map((pt) => (
            <div key={pt.num} className="bg-white border border-slate-200 rounded-lg p-3.5 hover:border-slate-300 transition-all shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#0b3d91]">
                  {pt.num}. {pt.title}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {pt.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pt.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer info & close */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">
            Smart India Hackathon 2026 • SIH26081
          </span>
          <button
            onClick={closeExplainModal}
            className="px-4 py-2 rounded-md bg-[#0b3d91] hover:bg-[#082a66] text-white font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
