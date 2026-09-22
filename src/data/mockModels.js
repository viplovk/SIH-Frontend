// Model Benchmark & Verification Metrics (Algoriot Hybrid Engine vs Baselines)
// Source status: ILLUSTRATIVE DEMO DATA — Prepared for real test-set verification via FastAPI backend.

export const MODEL_SYSTEMS = [
  {
    id: "hybrid",
    name: "ALGORIOT Hybrid Blending",
    type: "Physics-Informed Meta-Learner",
    description: "Regime-aware dynamic weighting combining conservation-law NWP with high-resolution transformer models.",
    mae: 1.12,
    rmse: 1.54,
    crps: 0.82,
    calibration: 0.94,
    extremeF1: 0.81,
    latency: "420 ms",
    badge: "Proposed System",
    highlight: true,
    color: "#38bdf8"
  },
  {
    id: "nwp",
    name: "NWP Baseline (ECMWF IFS / IMD GFS)",
    type: "Numerical Weather Prediction",
    description: "Hydrostatic & non-hydrostatic atmospheric primitive equations on 0.1° / 0.25° grid.",
    mae: 1.78,
    rmse: 2.36,
    crps: 1.28,
    calibration: 0.88,
    extremeF1: 0.69,
    latency: "3.2 hours",
    badge: "Operational Physics Baseline",
    highlight: false,
    color: "#94a3b8"
  },
  {
    id: "ai_a",
    name: "AI Model A (FuXi / GraphCast Variant)",
    type: "Autoregressive Graph / Transformer",
    description: "Deep spherical graph neural network trained on ERA5 reanalysis.",
    mae: 1.34,
    rmse: 1.82,
    crps: 0.96,
    calibration: 0.81,
    extremeF1: 0.73,
    latency: "85 ms",
    badge: "AI SOTA 1",
    highlight: false,
    color: "#34d399"
  },
  {
    id: "ai_b",
    name: "AI Model B (WeatherNext / Pangu-Weather)",
    type: "3D Earth-Specific Vision Transformer",
    description: "Multi-scale hierarchical transformer with pressure-level cross-attention.",
    mae: 1.41,
    rmse: 1.95,
    crps: 1.04,
    calibration: 0.79,
    extremeF1: 0.70,
    latency: "110 ms",
    badge: "AI SOTA 2",
    highlight: false,
    color: "#fbbf24"
  },
  {
    id: "static_ensemble",
    name: "Static Multi-Model Ensemble",
    type: "Fixed Weight Average (1/3 Equal Split)",
    description: "Naive unweighted arithmetic mean across NWP and machine learning models.",
    mae: 1.48,
    rmse: 2.08,
    crps: 1.10,
    calibration: 0.83,
    extremeF1: 0.71,
    latency: "12 ms",
    badge: "Conventional Ensemble",
    highlight: false,
    color: "#a78bfa"
  }
];

// Error growth curve over lead time (0 to 72 hours)
export const LEAD_TIME_ERROR_CURVE = [
  { leadTime: "00h", nwp: 0.45, aiA: 0.38, aiB: 0.40, static: 0.39, hybrid: 0.34 },
  { leadTime: "+6h", nwp: 0.82, aiA: 0.65, aiB: 0.72, static: 0.71, hybrid: 0.58 },
  { leadTime: "+12h", nwp: 1.15, aiA: 0.94, aiB: 1.02, static: 1.01, hybrid: 0.81 },
  { leadTime: "+18h", nwp: 1.42, aiA: 1.18, aiB: 1.26, static: 1.25, hybrid: 0.98 },
  { leadTime: "+24h", nwp: 1.68, aiA: 1.35, aiB: 1.44, static: 1.45, hybrid: 1.12 },
  { leadTime: "+36h", nwp: 2.05, aiA: 1.68, aiB: 1.76, static: 1.78, hybrid: 1.38 },
  { leadTime: "+48h", nwp: 2.38, aiA: 1.98, aiB: 2.10, static: 2.12, hybrid: 1.65 },
  { leadTime: "+60h", nwp: 2.74, aiA: 2.35, aiB: 2.48, static: 2.49, hybrid: 1.94 },
  { leadTime: "+72h", nwp: 3.12, aiA: 2.72, aiB: 2.89, static: 2.88, hybrid: 2.24 }
];

// Model contribution weight profiles by detected atmospheric regime
export const REGIME_WEIGHT_PROFILES = [
  {
    regime: "Monsoon / High Humidity Convective",
    nwp: 54,
    aiA: 31,
    aiB: 15,
    rationale: "Physics-based NWP retains strong mass and water-vapor continuity constraints during vigorous convection, while AI Model A pinpoints micro-scale radar reflectivity echoes."
  },
  {
    regime: "Tropical Cyclone / Maritime Low Depression",
    nwp: 64,
    aiA: 22,
    aiB: 14,
    rationale: "Deep baroclinic pressure falls and Coriolis cyclogenesis require rigid non-hydrostatic fluid equations; NWP weight is elevated to prevent AI unphysical track drifts."
  },
  {
    regime: "Continental Dry Heatwave / High Pressure Dome",
    nwp: 36,
    aiA: 42,
    aiB: 22,
    rationale: "In quasi-stationary thermal subsidence, AI models excel at mapping surface solar radiation, land-atmosphere sensible heat fluxes, and urban boundary layer heat retention."
  },
  {
    regime: "Pre-Monsoon Dryline Squall (Kalbaisakhi)",
    nwp: 40,
    aiA: 42,
    aiB: 18,
    rationale: "Rapid thunderstorm trigger lines are captured earlier by AI Model A's spatial pattern recognition, outperforming grid-averaged parameterized convection in NWP."
  },
  {
    regime: "Western Disturbance / Mountain Orography",
    nwp: 58,
    aiA: 25,
    aiB: 17,
    rationale: "Complex Himalayan elevation boundaries demand topographic wind deflection physics; NWP resolves mechanical upslope lifting."
  }
];
