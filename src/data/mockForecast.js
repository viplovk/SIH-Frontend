// Realistic Meteorological Simulation Data for Algoriot Multi-Model Blending
// Clearly labeled as ILLUSTRATIVE DEMO DATA until live backend pipeline is activated.

export const TIMELINE_STEPS = ["NOW", "+3H", "+6H", "+12H", "+24H", "+48H", "+72H"];

export const FORECAST_HORIZONS = [
  { id: "6h", label: "6 Hours", hours: 6, stepCount: 7 },
  { id: "24h", label: "24 Hours", hours: 24, stepCount: 9 },
  { id: "48h", label: "48 Hours", hours: 48, stepCount: 13 },
  { id: "72h", label: "72 Hours", hours: 72, stepCount: 17 }
];

export const FORECAST_VARIABLES = [
  { id: "temperature", label: "Temperature", unit: "°C", icon: "Thermometer" },
  { id: "precipitation", label: "Precipitation", unit: "mm / %", icon: "CloudRain" },
  { id: "wind", label: "Wind Velocity", unit: "km/h", icon: "Wind" },
  { id: "humidity", label: "Relative Humidity", unit: "%", icon: "Droplets" },
  { id: "pressure", label: "Atmospheric Pressure", unit: "hPa", icon: "Gauge" },
  { id: "cloudCover", label: "Cloud Cover", unit: "%", icon: "Cloud" },
  { id: "extremeRisk", label: "Extreme Weather Risk", unit: "Index", icon: "AlertTriangle" }
];

// Generates multi-model timeline data for a selected location and time horizon
export function generateTimelineData(locationId = "delhi", horizonId = "24h") {
  const steps = horizonId === "6h" ? 7 : horizonId === "24h" ? 9 : horizonId === "48h" ? 13 : 17;
  const timeLabels = {
    "6h": ["00:00", "+1h", "+2h", "+3h", "+4h", "+5h", "+6h"],
    "24h": ["NOW", "+3h", "+6h", "+9h", "+12h", "+15h", "+18h", "+21h", "+24h"],
    "48h": ["NOW", "+4h", "+8h", "+12h", "+16h", "+20h", "+24h", "+28h", "+32h", "+36h", "+40h", "+44h", "+48h"],
    "72h": ["NOW", "+6h", "+12h", "+18h", "+24h", "+30h", "+36h", "+42h", "+48h", "+54h", "+60h", "+66h", "+72h"]
  };

  const labels = timeLabels[horizonId] || timeLabels["24h"];

  // Base parameters per location
  let baseTemp = 31.4;
  let basePrecip = 4.2;
  let baseWind = 14;
  let baseHumid = 68;

  if (locationId === "mumbai") { baseTemp = 29.8; basePrecip = 12.5; baseWind = 24; baseHumid = 86; }
  else if (locationId === "ahmedabad") { baseTemp = 39.8; basePrecip = 0.0; baseWind = 15; baseHumid = 32; }
  else if (locationId === "guwahati") { baseTemp = 28.5; basePrecip = 18.0; baseWind = 11; baseHumid = 92; }
  else if (locationId === "bengaluru") { baseTemp = 26.8; basePrecip = 2.1; baseWind = 12; baseHumid = 62; }
  else if (locationId === "kolkata") { baseTemp = 33.1; basePrecip = 6.4; baseWind = 18; baseHumid = 78; }

  return labels.map((time, idx) => {
    // Diurnal variation and atmospheric trend
    const cycle = Math.sin((idx / steps) * Math.PI * 2);
    const trend = (idx / steps) * 1.5;

    // NWP Physics Model (tends to have slight boundary layer bias, smooth physics)
    const nwpTemp = Number((baseTemp + cycle * 3.8 + trend + 0.6).toFixed(1));
    const nwpPrecip = Math.max(0, Number((basePrecip * (1 + cycle * 0.8) + (idx > 2 ? 3.5 : 0)).toFixed(1)));
    const nwpWind = Number((baseWind + cycle * 4.2 + 1.2).toFixed(1));
    const nwpHumid = Math.min(99, Math.max(20, Math.round(baseHumid - cycle * 12)));

    // AI Model A (FuXi / GraphCast: sharp microphysics, rapid gradients)
    const aiATemp = Number((baseTemp + cycle * 4.2 + trend - 0.4).toFixed(1));
    const aiAPrecip = Math.max(0, Number((basePrecip * (1.2 + cycle * 1.1) + (idx > 3 ? 5.2 : 0)).toFixed(1)));
    const aiAWind = Number((baseWind + cycle * 3.5 - 0.8).toFixed(1));
    const aiAHumid = Math.min(99, Math.max(20, Math.round(baseHumid - cycle * 14 + 2)));

    // AI Model B (WeatherNext / Pangu: deep autoregressive, conservative extremes)
    const aiBTemp = Number((baseTemp + cycle * 3.5 + trend + 0.1).toFixed(1));
    const aiBPrecip = Math.max(0, Number((basePrecip * (0.9 + cycle * 0.7) + (idx > 2 ? 2.8 : 0)).toFixed(1)));
    const aiBWind = Number((baseWind + cycle * 3.9).toFixed(1));
    const aiBHumid = Math.min(99, Math.max(20, Math.round(baseHumid - cycle * 10 - 1)));

    // Dynamic Blending: NWP (0.54) + AI A (0.31) + AI B (0.15) with lead-time shift
    const leadWeightNwp = Math.max(0.35, 0.54 - (idx / steps) * 0.12);
    const leadWeightAiA = 0.31 + (idx / steps) * 0.08;
    const leadWeightAiB = 1 - leadWeightNwp - leadWeightAiA;

    const hybridTemp = Number((nwpTemp * leadWeightNwp + aiATemp * leadWeightAiA + aiBTemp * leadWeightAiB).toFixed(1));
    const hybridPrecip = Number((nwpPrecip * leadWeightNwp + aiAPrecip * leadWeightAiA + aiBPrecip * leadWeightAiB).toFixed(1));
    const hybridWind = Number((nwpWind * leadWeightNwp + aiAWind * leadWeightAiA + aiBWind * leadWeightAiB).toFixed(1));
    const hybridHumid = Math.round(nwpHumid * leadWeightNwp + aiAHumid * leadWeightAiA + aiBHumid * leadWeightAiB);

    // Uncertainty intervals (calibrated 90% confidence envelope)
    const tempUncertaintyLower = Number((hybridTemp - (1.1 + (idx / steps) * 1.8)).toFixed(1));
    const tempUncertaintyUpper = Number((hybridTemp + (1.2 + (idx / steps) * 2.1)).toFixed(1));

    return {
      time,
      step: idx,
      // Hybrid Primary
      temperature: hybridTemp,
      precipitation: hybridPrecip,
      wind: hybridWind,
      humidity: hybridHumid,
      pressure: Number((1008 - cycle * 3.5 - (idx * 0.4)).toFixed(1)),
      cloudCover: Math.min(100, Math.round(45 + cycle * 25 + idx * 2)),
      // Sub-model components
      nwp: { temp: nwpTemp, precip: nwpPrecip, wind: nwpWind, humid: nwpHumid },
      aiA: { temp: aiATemp, precip: aiAPrecip, wind: aiAWind, humid: aiAHumid },
      aiB: { temp: aiBTemp, precip: aiBPrecip, wind: aiBWind, humid: aiBHumid },
      // Uncertainty bounds
      tempLower: tempUncertaintyLower,
      tempUpper: tempUncertaintyUpper,
      precipProb: Math.min(98, Math.round(35 + hybridPrecip * 5)),
      capeIndex: Math.round(1200 + cycle * 800) // Convective Available Potential Energy J/kg
    };
  });
}
