// Model Performance & Weighting Service Layer
import { apiFetch } from "./client.js";
import { MODEL_SYSTEMS, LEAD_TIME_ERROR_CURVE, REGIME_WEIGHT_PROFILES } from "../data/mockModels.js";
import { LOCATIONS } from "../data/locations.js";

export async function getModelMetrics() {
  return apiFetch(
    "/models/metrics",
    {},
    () => ({
      systems: MODEL_SYSTEMS,
      leadTimeCurves: LEAD_TIME_ERROR_CURVE,
      regimeProfiles: REGIME_WEIGHT_PROFILES,
      evaluationDataset: "IMD In-Situ Automated Weather Stations & INSAT-3DR Radiometer (2024-2025)",
      isSimulated: true
    })
  );
}

export async function getModelWeights(locationId = "delhi") {
  return apiFetch(
    `/models/weights?location=${locationId}`,
    {},
    () => {
      const loc = LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
      return {
        locationId,
        locationName: loc.name,
        weights: loc.modelWeights,
        rationale: loc.weightRationale,
        regime: loc.currentRegime,
        isSimulated: true
      };
    }
  );
}

export async function getAtmosphericRegime(locationId = "delhi") {
  return apiFetch(
    `/models/regime?location=${locationId}`,
    {},
    () => {
      const loc = LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
      return {
        regime: loc.currentRegime,
        confidence: loc.regimeConfidence,
        rationale: loc.weightRationale,
        isSimulated: true
      };
    }
  );
}
