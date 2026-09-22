// Uncertainty Quantification & Calibration Profiles
// Algoriot uses Conformal Quantile Regression and Ensemble Residual Dispersion

export const UNCERTAINTY_METRICS = {
  deterministicForecast: 31.4,
  expectedRange: { min: 29.8, max: 32.7 },
  overallConfidence: 87,
  calibrationScore: 0.94,
  uncertaintyBandWidth: 2.9,
  ensembleSpread: "Low to Moderate",
  regimeStability: "STABLE CYCLONIC MONSOON REGIME"
};

// Lead time uncertainty bands (0 to 72 hours) with 10th, 25th, Median, 75th, 90th percentiles
export const UNCERTAINTY_BANDS_DATA = [
  { leadTime: "+0h", p10: 30.8, p25: 31.1, median: 31.4, p75: 31.7, p90: 32.0, spread: 1.2, confidence: 96 },
  { leadTime: "+6h", p10: 30.1, p25: 30.8, median: 31.8, p75: 32.5, p90: 33.1, spread: 3.0, confidence: 93 },
  { leadTime: "+12h", p10: 29.2, p25: 30.2, median: 31.2, p75: 32.2, p90: 33.4, spread: 4.2, confidence: 89 },
  { leadTime: "+18h", p10: 27.5, p25: 28.8, median: 29.9, p75: 31.1, p90: 32.5, spread: 5.0, confidence: 85 },
  { leadTime: "+24h", p10: 28.3, p25: 29.8, median: 31.5, p75: 32.9, p90: 34.2, spread: 5.9, confidence: 83 },
  { leadTime: "+36h", p10: 27.8, p25: 29.5, median: 31.8, p75: 33.8, p90: 35.4, spread: 7.6, confidence: 78 },
  { leadTime: "+48h", p10: 26.5, p25: 28.9, median: 31.4, p75: 34.2, p90: 36.6, spread: 10.1, confidence: 72 },
  { leadTime: "+60h", p10: 25.8, p25: 28.2, median: 31.6, p75: 34.8, p90: 37.8, spread: 12.0, confidence: 66 },
  { leadTime: "+72h", p10: 24.9, p25: 27.6, median: 31.3, p75: 35.2, p90: 38.9, spread: 14.0, confidence: 59 }
];

// Reliability diagram data (Calibration Curve: Predicted Probability vs Observed Frequency)
export const CALIBRATION_CURVE_DATA = [
  { nominalProb: 0.10, perfect: 0.10, algoriotHybrid: 0.11, uncalibratedNwp: 0.18, rawAi: 0.07 },
  { nominalProb: 0.20, perfect: 0.20, algoriotHybrid: 0.21, uncalibratedNwp: 0.31, rawAi: 0.15 },
  { nominalProb: 0.30, perfect: 0.30, algoriotHybrid: 0.32, uncalibratedNwp: 0.42, rawAi: 0.24 },
  { nominalProb: 0.40, perfect: 0.40, algoriotHybrid: 0.41, uncalibratedNwp: 0.53, rawAi: 0.33 },
  { nominalProb: 0.50, perfect: 0.50, algoriotHybrid: 0.51, uncalibratedNwp: 0.62, rawAi: 0.43 },
  { nominalProb: 0.60, perfect: 0.60, algoriotHybrid: 0.60, uncalibratedNwp: 0.73, rawAi: 0.52 },
  { nominalProb: 0.70, perfect: 0.70, algoriotHybrid: 0.69, uncalibratedNwp: 0.81, rawAi: 0.63 },
  { nominalProb: 0.80, perfect: 0.80, algoriotHybrid: 0.79, uncalibratedNwp: 0.89, rawAi: 0.72 },
  { nominalProb: 0.90, perfect: 0.90, algoriotHybrid: 0.89, uncalibratedNwp: 0.94, rawAi: 0.82 },
  { nominalProb: 1.00, perfect: 1.00, algoriotHybrid: 0.98, uncalibratedNwp: 0.99, rawAi: 0.92 }
];

// Multi-variable uncertainty snapshot for current selected location
export const VARIABLE_UNCERTAINTIES = [
  {
    variable: "Temperature",
    unit: "°C",
    deterministic: "31.4°C",
    interval90: "29.8°C — 32.7°C",
    confidence: 87,
    dispersionDriver: "Solar radiation attenuation & cumulus cloud shading"
  },
  {
    variable: "Precipitation Accumulation",
    unit: "mm (24h)",
    deterministic: "24.8 mm",
    interval90: "12.0 mm — 41.5 mm",
    confidence: 76,
    dispersionDriver: "Mesoscale convective cloudburst clustering & updraft shear"
  },
  {
    variable: "Peak Wind Gust",
    unit: "km/h",
    deterministic: "38.5 km/h",
    interval90: "30.0 km/h — 52.0 km/h",
    confidence: 84,
    dispersionDriver: "Downburst micro-downdraft momentum transport"
  },
  {
    variable: "Relative Humidity",
    unit: "%",
    deterministic: "68%",
    interval90: "61% — 76%",
    confidence: 91,
    dispersionDriver: "Boundary layer evaporative cooling rate"
  }
];
