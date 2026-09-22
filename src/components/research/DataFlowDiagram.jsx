import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowDown, 
  Cpu, 
  Database, 
  Layers, 
  Compass, 
  GitMerge, 
  ShieldAlert, 
  CheckCircle, 
  Sliders, 
  ExternalLink,
  BookOpen,
  ChevronRight
} from "lucide-react";
import gsap from "gsap";

export function DataFlowDiagram() {
  const [selectedStage, setSelectedStage] = useState(3); // default: Regime Detector
  const diagramRef = useRef(null);

  const stages = [
    {
      id: 0,
      title: "OBSERVATIONS & RADAR INGESTION",
      type: "Input Data Layer",
      icon: Database,
      badge: "In-situ & Remote",
      math: "x_obs = [AWS, Doppler_Vel, INSAT_Radiance, ERA5_Reanalysis]",
      description: "Aggregates real-time automated weather station telemetry, radar radial velocity sweeps, and geostationary satellite infrared radiances across India.",
      inputs: "IMD In-Situ AWS, Doppler Radar, INSAT-3DR",
      outputs: "Standardized 0.05° spatial observation tensors"
    },
    {
      id: 1,
      title: "NUMERICAL WEATHER PREDICTION (NWP)",
      type: "Physical Dynamical Core",
      icon: Layers,
      badge: "Physics Baseline",
      math: "∂u/∂t + (u·∇)u = -1/ρ ∇p + g + F_friction",
      description: "Solves primitive equations of atmospheric motion, hydrostatic mass continuity, and convective parameterizations (ECMWF IFS / IMD High-Resolution GFS).",
      inputs: "Global boundary conditions, surface topography",
      outputs: "Deterministic 3D grid fields (U, V, T, Q, Geopotential)"
    },
    {
      id: 2,
      title: "DEEP AI WEATHER MODELS (AI-A & AI-B)",
      type: "Autoregressive Neural Surrogates",
      icon: Cpu,
      badge: "High-Res AI",
      math: "y_{t+Δt} = f_θ(y_t, z_latent) via Spherical Graph Transformers",
      description: "Spherical vision transformers and graph neural networks (FuXi / WeatherNext) trained on decadal reanalysis for ultra-fast, high-resolution spatial feature mapping.",
      inputs: "Multivariate historical state sequences",
      outputs: "Fast autoregressive 6-hourly global state rollouts"
    },
    {
      id: 3,
      title: "REGIME DETECTOR (CLASSIFIER)",
      type: "Atmospheric State Clustering",
      icon: Compass,
      badge: "Context Awareness",
      math: "R_t = argmax_k P(Cluster_k | CAPE, Vorticity_850, RH_700, LeadTime)",
      description: "Classifies the atmospheric state into distinct regimes (Monsoon Convection, Tropical Cyclone, Continental Heatwave, Mountain Orography, Calm High Pressure).",
      inputs: "Convective potential, moisture advection, shear",
      outputs: "Discrete atmospheric regime probability vector [p_1, ..., p_K]"
    },
    {
      id: 4,
      title: "META-LEARNER & DYNAMIC WEIGHTING",
      type: "Condition-Adaptive Meta-Model",
      icon: Sliders,
      badge: "Core Algoriot Engine",
      math: "w_i^*(R, t, loc) = Softmax(W_regime · h_features + b)",
      description: "A lightweight meta-learner dynamically calculates optimal contribution coefficients w_nwp, w_aiA, w_aiB tailored specifically to the detected regime and lead time.",
      inputs: "Regime probabilities, spatial coordinates, historical residuals",
      outputs: "Normalized dynamic model weights: ∑ w_i = 1"
    },
    {
      id: 5,
      title: "MODEL BLENDING & CONSTRAINTS",
      type: "Convex Fusion Layer",
      icon: GitMerge,
      badge: "Physics Conservation",
      math: "y_blend = ∑ w_i · y_i subject to Thermodynamic Conservation",
      description: "Combines model prognostic variables with physical conservation constraints (ensuring non-negative precipitation and mass conservation).",
      inputs: "NWP field, AI forecasts, dynamic weights",
      outputs: "Raw unified hybrid forecast field"
    },
    {
      id: 6,
      title: "NON-LINEAR BIAS CORRECTION",
      type: "Residual Calibration",
      icon: Layers,
      badge: "Error Reduction",
      math: "y_corrected = y_blend - μ_residual(loc, doy, diurnal_hour)",
      description: "Corrects localized topographical biases and systematic seasonal diurnal shifts using gradient boosted residual trees calibrated against AWS ground truth.",
      inputs: "Raw blended forecast, localized station altitude offsets",
      outputs: "Bias-free meteorological predictions"
    },
    {
      id: 7,
      title: "EXTREME EVENT HANDLING",
      type: "Tail Risk Optimization",
      icon: ShieldAlert,
      badge: "Disaster Preparedness",
      math: "Risk_tail = EVD_fit(Gumbel / GEV | y_corrected, ensemble_skew)",
      description: "Optimized loss function using extreme value theory (EVT) to avoid smoothing over localized cloudbursts, severe gale gusts, and heatwave extremes.",
      inputs: "Extreme thresholds, tail distribution parameters",
      outputs: "Categorized disaster alert warnings and probability indices"
    },
    {
      id: 8,
      title: "UNCERTAINTY CALIBRATION",
      type: "Conformal Quantile Regression",
      icon: CheckCircle,
      badge: "Reliability Guarantee",
      math: "Interval_α(x) = [q_{α/2}(x) - c, q_{1-α/2}(x) + c]",
      description: "Constructs distribution-free calibrated confidence intervals with guaranteed empirical coverage (90% credible intervals).",
      inputs: "Ensemble spread, conformal calibration residuals",
      outputs: "Calibrated percentiles (P10, P25, Median, P75, P90)"
    },
    {
      id: 9,
      title: "FINAL HYBRID FORECAST PRODUCT",
      type: "Disaster Management Intelligence",
      icon: Cpu,
      badge: "Operational Output",
      math: "Output = { Point_Forecast, Interval_90, Extreme_Alerts, Explanations }",
      description: "High-fidelity actionable intelligence delivered to the dashboard, disaster authorities (NDMA/SDMA), and emergency responders.",
      inputs: "Fully synthesized hybrid engine states",
      outputs: "Interactive command map, alerts, charts, and public APIs"
    }
  ];

  const current = stages[selectedStage];

  // GSAP subtle glow animation on load
  useEffect(() => {
    if (diagramRef.current) {
      gsap.fromTo(
        diagramRef.current.querySelectorAll(".pipeline-step"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={diagramRef} className="space-y-6">
      
      {/* Introduction Card */}
      <div className="bg-[#101520] border border-white/[0.06] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-white/[0.06] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-300" />
              <h2 className="text-xl font-heading font-semibold text-white tracking-wide">
                HYBRID SCIENTIFIC ARCHITECTURE
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono-tech mt-1">
              End-to-end meteorological pipeline for SIH26081: Hybrid AI-NWP Multi-Model Forecast Blending System.
            </p>
          </div>

          <span className="text-xs font-mono-tech text-slate-300 bg-white/[0.04] px-2.5 py-1 rounded border border-white/10">
            CLICK ANY STAGE TO INSPECT ALGORITHMS
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans">
          Conventional ensemble forecasting averages NWP models uniformly or relies solely on pure AI neural surrogates that drift without physical constraints. Algoriot overcomes these limitations by inserting a <strong>Regime-Aware Meta-Learner</strong> that dynamically blends physics equations with AI transformers based on localized atmospheric regimes.
        </p>
      </div>

      {/* Interactive Pipeline Visual Flow & Deep Dive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Pipeline Step Cards (6 cols) */}
        <div className="lg:col-span-6 space-y-2">
          {stages.map((stg) => {
            const Icon = stg.icon;
            const isSelected = selectedStage === stg.id;
            return (
              <div
                key={stg.id}
                onClick={() => setSelectedStage(stg.id)}
                className={`pipeline-step cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-white/[0.08] border-white/20 ring-1 ring-white/10"
                    : "bg-[#101520] border-white/[0.06] hover:bg-[#141b2a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded flex items-center justify-center font-mono-tech text-xs font-semibold ${
                    isSelected ? "bg-slate-200 text-slate-900" : "bg-black/40 text-slate-400 border border-white/10"
                  }`}>
                    {stg.id + 1}
                  </div>
                  <div>
                    <div className="text-xs font-heading font-semibold text-white tracking-wide">
                      {stg.title}
                    </div>
                    <div className="text-[10px] font-mono-tech text-slate-400">
                      {stg.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 hidden sm:inline">
                    {stg.badge}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? "text-slate-300" : "text-slate-600"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Deep Inspection Panel (6 cols) */}
        <div className="lg:col-span-6">
          <div className="sticky top-20 bg-[#101520] border border-white/10 rounded-lg p-5 space-y-4">
            
            {/* Header */}
            <div className="border-b border-white/[0.08] pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono-tech text-slate-300 font-semibold uppercase tracking-wider">
                  STAGE 0{current.id + 1} DEEP INSPECTION
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-slate-300 text-[10px] font-mono-tech">
                  {current.badge}
                </span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-white">
                {current.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                {current.type}
              </p>
            </div>

            {/* Mathematical Formulation */}
            <div className="bg-[#0b0e14] border border-white/[0.08] rounded p-3 font-mono-tech text-xs">
              <span className="text-[10px] uppercase text-slate-500 block mb-1">Mathematical Formulation:</span>
              <code className="text-slate-200 font-semibold leading-relaxed block overflow-x-auto py-1">
                {current.math}
              </code>
            </div>

            {/* Scientific Explanation */}
            <div>
              <h4 className="text-xs font-mono-tech uppercase text-slate-400 tracking-wider mb-1">
                Operational Functionality:
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {current.description}
              </p>
            </div>

            {/* Inputs & Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-xs font-mono-tech">
              <div className="bg-[#141a27] p-2.5 rounded border border-white/[0.04]">
                <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Stage Inputs:</span>
                <span className="text-slate-200">{current.inputs}</span>
              </div>
              <div className="bg-[#141a27] p-2.5 rounded border border-white/[0.04]">
                <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Stage Outputs:</span>
                <span className="text-emerald-300/90 font-medium">{current.outputs}</span>
              </div>
            </div>

            {/* Research Justification */}
            <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-slate-300 font-sans">
              <strong className="text-slate-200 font-mono-tech">SIH 2026 Problem Solver: </strong>
              Directly resolves the static weighting flaw where traditional models fail under rapid monsoon convection or extreme heatwave subsidence.
            </div>

          </div>
        </div>

      </div>

      {/* Scientific Research References Section */}
      <div className="bg-[#101520] border border-white/[0.06] rounded-lg p-5">
        <h3 className="text-base font-heading font-semibold text-white mb-2">
          FOUNDATIONAL METEOROLOGICAL & AI REFERENCES
        </h3>
        <p className="text-xs text-slate-400 font-mono-tech mb-4">
          Peer-reviewed architectures and operational frameworks integrated into the Algoriot specification
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
          
          <div className="bg-[#141a27] border border-white/[0.04] p-3 rounded">
            <div className="flex items-baseline justify-between mb-1">
              <h5 className="font-semibold text-white">FuXi: Medium-Range Global Weather Forecasting</h5>
              <span className="text-[10px] font-mono-tech text-slate-400">NPJ Climate 2023</span>
            </div>
            <p className="text-slate-400 text-xs">
              Cascade machine learning architecture utilizing 15-day multi-stage autoregressive models, adapted in Algoriot for rapid short-range convective rain echo detection.
            </p>
          </div>

          <div className="bg-[#141a27] border border-white/[0.04] p-3 rounded">
            <div className="flex items-baseline justify-between mb-1">
              <h5 className="font-semibold text-white">AICON: Artificial Intelligence for Convective Onset</h5>
              <span className="text-[10px] font-mono-tech text-slate-400">BAMS 2024</span>
            </div>
            <p className="text-slate-400 text-xs">
              Physics-guided neural network architecture providing regime classification for lightning and severe convective storm squall lines.
            </p>
          </div>

          <div className="bg-[#141a27] border border-white/[0.04] p-3 rounded">
            <div className="flex items-baseline justify-between mb-1">
              <h5 className="font-semibold text-white">WeatherNext: Multi-Scale Earth Attention</h5>
              <span className="text-[10px] font-mono-tech text-slate-400">IEEE TGRS 2024</span>
            </div>
            <p className="text-slate-400 text-xs">
              Hierarchical 3D spherical vision transformer capturing global baroclinic wave teleconnections across upper tropospheric pressure levels (500hPa & 200hPa).
            </p>
          </div>

          <div className="bg-[#141a27] border border-white/[0.04] p-3 rounded">
            <div className="flex items-baseline justify-between mb-1">
              <h5 className="font-semibold text-white">Multi-Source ML for Drought & Heatwave Prediction</h5>
              <span className="text-[10px] font-mono-tech text-slate-400">Journal of Hydrology 2024</span>
            </div>
            <p className="text-slate-400 text-xs">
              Synergistic coupling of land-surface moisture proxies with numerical physics to forecast agro-climatic stress and hydrological deficit.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
