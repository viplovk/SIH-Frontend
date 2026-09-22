import React, { useState } from "react";
import { ModelPerformanceComparison } from "../components/models/ModelPerformanceComparison.jsx";
import { HybridModelPanel } from "../components/models/HybridModelPanel.jsx";
import { LocationSelector } from "../components/weather/LocationSelector.jsx";
import { Sliders, Cpu, Layers, Sparkles, RefreshCw, HelpCircle } from "lucide-react";
import { useWeather } from "../context/WeatherContext.jsx";

export function Models() {
  const { openExplainModal } = useWeather();

  // Interactive Live Weight Simulator for SIH Judges to test!
  const [capeIndex, setCapeIndex] = useState(1850); // Convective available potential energy
  const [leadTimeHours, setLeadTimeHours] = useState(12);
  const [terrainComplexity, setTerrainComplexity] = useState("coastal"); // flat | rugged | coastal

  // Dynamic simulation logic
  const calculateSimulatedWeights = () => {
    let nwp = 50;
    let aiA = 30;
    let aiB = 20;

    // Convective CAPE increases NWP's physics role to prevent AI hallucination
    if (capeIndex > 2000) {
      nwp += 12;
      aiA += 3;
      aiB -= 15;
    } else if (capeIndex < 800) {
      nwp -= 10;
      aiA += 8;
      aiB += 2;
    }

    // Lead time beyond 36h increases NWP stability
    if (leadTimeHours > 36) {
      nwp += 14;
      aiA -= 10;
      aiB -= 4;
    } else if (leadTimeHours <= 12) {
      aiA += 12; // FuXi performs exceptionally well on short-range rain
      nwp -= 8;
      aiB -= 4;
    }

    // Terrain
    if (terrainComplexity === "rugged") {
      nwp += 8;
      aiA -= 5;
      aiB -= 3;
    }

    // Normalize to 100%
    const total = nwp + aiA + aiB;
    return {
      nwp: Math.round((nwp / total) * 100),
      aiA: Math.round((aiA / total) * 100),
      aiB: 100 - Math.round((nwp / total) * 100) - Math.round((aiA / total) * 100)
    };
  };

  const simWeights = calculateSimulatedWeights();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-slate-300" />
            <h1 className="text-2xl font-heading font-semibold text-white tracking-wide">
              MULTI-MODEL ARCHITECTURE & DYNAMIC BLENDING
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Condition-aware meta-learner combining physical differential equations with spherical graph transformers.
          </p>
        </div>

        <button
          onClick={openExplainModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.08] text-slate-100 border border-white/15 text-xs font-mono-tech hover:bg-white/[0.12] transition-colors self-start md:self-auto cursor-pointer font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
          <span>Explain Weighting Math</span>
        </button>
      </div>

      {/* Interactive Dynamic Weight Simulator for SIH Judges */}
      <div className="bg-[#101520] border border-white/10 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-white/[0.06] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-300" />
              <h3 className="font-heading font-semibold text-base text-white">
                INTERACTIVE META-LEARNER WEIGHT SIMULATOR
              </h3>
            </div>
            <p className="text-[11px] font-mono-tech text-slate-400">
              Manipulate atmospheric conditions to test how the blending engine adapts weights in real-time
            </p>
          </div>
          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-slate-300">
            SIH JURY INTERACTIVE BENCH
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* CAPE Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono-tech text-slate-300 mb-1">
                <span>Convective Instability (CAPE):</span>
                <span className="text-slate-200 font-semibold">{capeIndex} J/kg</span>
              </div>
              <input
                type="range"
                min="200"
                max="3500"
                step="50"
                value={capeIndex}
                onChange={(e) => setCapeIndex(Number(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 mt-0.5">
                <span>Stable (200 J/kg)</span>
                <span>Moderate (1500)</span>
                <span>Severe Storm (&gt;2500)</span>
              </div>
            </div>

            {/* Lead Time Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono-tech text-slate-300 mb-1">
                <span>Forecast Lead Time Horizon:</span>
                <span className="text-slate-200 font-semibold">+{leadTimeHours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="72"
                step="3"
                value={leadTimeHours}
                onChange={(e) => setLeadTimeHours(Number(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 mt-0.5">
                <span>Nowcasting (+3h)</span>
                <span>Short-Range (+24h)</span>
                <span>Medium-Range (+72h)</span>
              </div>
            </div>

            {/* Terrain Selector */}
            <div>
              <div className="text-xs font-mono-tech text-slate-300 mb-1.5">
                Geographic / Orographic Regime:
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono-tech">
                {[
                  { id: "coastal", label: "Coastal Sea Breeze" },
                  { id: "flat", label: "Plains / Continental" },
                  { id: "rugged", label: "Himalayan Ridge" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTerrainComplexity(t.id)}
                    className={`py-1.5 px-2 rounded border text-center transition-colors cursor-pointer ${
                      terrainComplexity === t.id
                        ? "bg-white/[0.08] text-slate-100 border-white/20 font-medium"
                        : "bg-[#141a27] text-slate-400 border-white/[0.04]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Real-Time Result Output (6 cols) */}
          <div className="lg:col-span-6 bg-[#141a27] border border-white/[0.06] rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono-tech text-slate-300 uppercase tracking-wider mb-2 font-medium">
                SIMULATED WEIGHT RESOLUTION:
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono-tech text-slate-300 mb-1">
                    <span>NWP Model (Physics Navier-Stokes):</span>
                    <strong className="text-slate-300">{simWeights.nwp}%</strong>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 transition-all duration-300" style={{ width: `${simWeights.nwp}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono-tech text-slate-300 mb-1">
                    <span>AI Model A (FuXi Spherical Graph):</span>
                    <strong className="text-emerald-300/90">{simWeights.aiA}%</strong>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400/80 transition-all duration-300" style={{ width: `${simWeights.aiA}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono-tech text-slate-300 mb-1">
                    <span>AI Model B (WeatherNext ViT):</span>
                    <strong className="text-amber-300/90">{simWeights.aiB}%</strong>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400/80 transition-all duration-300" style={{ width: `${simWeights.aiB}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono-tech text-slate-400">
              <strong>Observation: </strong> 
              {leadTimeHours > 36 
                ? "At extended lead times (+36h to +72h), the meta-learner penalizes AI autoregressive error compounding and increases the NWP physics weight."
                : "At short lead times (+3h to +12h), AI Model A is rewarded with higher weighting due to its proven lower RMSE for micro-precipitation gradients."}
            </div>

          </div>

        </div>
      </div>

      {/* Primary Comparison Suite Component */}
      <ModelPerformanceComparison />

    </div>
  );
}
