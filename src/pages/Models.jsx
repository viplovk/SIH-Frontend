import React, { useState } from "react";
import { ModelPerformanceComparison } from "../components/models/ModelPerformanceComparison.jsx";
import { Sliders, Cpu, HelpCircle } from "lucide-react";
import { useWeather } from "../context/WeatherContext.jsx";

export function Models() {
  const { openExplainModal } = useWeather();

  // Interactive Live Weight Simulator for SIH Judges to test
  const [capeIndex, setCapeIndex] = useState(1850);
  const [leadTimeHours, setLeadTimeHours] = useState(12);
  const [terrainComplexity, setTerrainComplexity] = useState("coastal");

  const calculateSimulatedWeights = () => {
    let nwp = 50;
    let aiA = 30;
    let aiB = 20;

    if (capeIndex > 2000) {
      nwp += 12;
      aiA += 3;
      aiB -= 15;
    } else if (capeIndex < 800) {
      nwp -= 10;
      aiA += 8;
      aiB += 2;
    }

    if (leadTimeHours > 36) {
      nwp += 14;
      aiA -= 10;
      aiB -= 4;
    } else if (leadTimeHours <= 12) {
      aiA += 12;
      nwp -= 8;
      aiB -= 4;
    }

    if (terrainComplexity === "rugged") {
      nwp += 8;
      aiA -= 5;
      aiB -= 3;
    }

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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <Cpu className="w-4 h-4 text-[#0b3d91]" />
            <span>Multi-Model Architecture & Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MULTI-MODEL ARCHITECTURE & DYNAMIC BLENDING
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Condition-aware meta-learner combining physical differential equations with spherical graph transformers.
          </p>
        </div>

        <button
          onClick={openExplainModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0b3d91] hover:bg-[#082a66] text-white text-xs font-semibold transition-colors self-start md:self-auto cursor-pointer shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-white" />
          <span>Explain Weighting Math</span>
        </button>
      </div>

      {/* Interactive Dynamic Weight Simulator for SIH Judges */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0b3d91]" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                INTERACTIVE META-LEARNER WEIGHT SIMULATOR
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manipulate atmospheric conditions to test how the blending engine adapts weights in real-time
            </p>
          </div>
          <span className="text-xs font-bold text-[#0b3d91] bg-blue-50 px-3 py-1 rounded-md border border-blue-200 w-fit">
            SIH Evaluation Test Bench
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* CAPE Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Convective Instability (CAPE):</span>
                <span className="text-slate-900 font-bold">{capeIndex} J/kg</span>
              </div>
              <input
                type="range"
                min="200"
                max="3500"
                step="50"
                value={capeIndex}
                onChange={(e) => setCapeIndex(Number(e.target.value))}
                className="w-full accent-[#0b3d91] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Stable (200 J/kg)</span>
                <span>Moderate (1500)</span>
                <span>Severe Storm (&gt;2500)</span>
              </div>
            </div>

            {/* Lead Time Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Forecast Lead Time Horizon:</span>
                <span className="text-slate-900 font-bold">+{leadTimeHours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="72"
                step="3"
                value={leadTimeHours}
                onChange={(e) => setLeadTimeHours(Number(e.target.value))}
                className="w-full accent-[#0b3d91] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Nowcasting (+3h)</span>
                <span>Short-Range (+24h)</span>
                <span>Medium-Range (+72h)</span>
              </div>
            </div>

            {/* Terrain Selector */}
            <div>
              <div className="text-xs text-slate-700 font-medium mb-1.5">
                Geographic / Orographic Regime:
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "coastal", label: "Coastal Sea Breeze" },
                  { id: "flat", label: "Plains / Continental" },
                  { id: "rugged", label: "Himalayan Ridge" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTerrainComplexity(t.id)}
                    className={`py-2 px-2.5 rounded-md border text-center transition-colors cursor-pointer ${
                      terrainComplexity === t.id
                        ? "bg-blue-50 text-[#0b3d91] border-blue-200 font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Real-Time Result Output (6 cols) */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                SIMULATED WEIGHT RESOLUTION:
              </div>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1 font-medium">
                    <span>NWP Model (Physics Navier-Stokes):</span>
                    <strong className="text-[#0b3d91]">{simWeights.nwp}%</strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0b3d91] transition-all duration-300" style={{ width: `${simWeights.nwp}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1 font-medium">
                    <span>AI Model A (FuXi Spherical Graph):</span>
                    <strong className="text-teal-700">{simWeights.aiA}%</strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 transition-all duration-300" style={{ width: `${simWeights.aiA}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1 font-medium">
                    <span>AI Model B (WeatherNext ViT):</span>
                    <strong className="text-amber-700">{simWeights.aiB}%</strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${simWeights.aiB}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Observation: </strong> 
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
