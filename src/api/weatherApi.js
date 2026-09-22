// Weather Observation & Extreme Hazards Service Layer
import { apiFetch } from "./client.js";
import { LOCATIONS, DEFAULT_LOCATION } from "../data/locations.js";
import { EXTREME_HAZARDS, HAZARD_SUMMARY } from "../data/mockExtremes.js";
import { UNCERTAINTY_METRICS, UNCERTAINTY_BANDS_DATA, CALIBRATION_CURVE_DATA, VARIABLE_UNCERTAINTIES } from "../data/mockUncertainty.js";

export async function getLocations() {
  return apiFetch(
    "/locations",
    {},
    () => LOCATIONS
  );
}

export async function getLocationById(id) {
  return apiFetch(
    `/locations/${id}`,
    {},
    () => LOCATIONS.find((l) => l.id === id) || DEFAULT_LOCATION
  );
}

export async function getExtremeEvents() {
  return apiFetch(
    "/extremes",
    {},
    () => ({
      hazards: EXTREME_HAZARDS,
      summary: HAZARD_SUMMARY,
      isSimulated: true
    })
  );
}

export async function getUncertainty(locationId = "delhi") {
  return apiFetch(
    `/uncertainty?location=${locationId}`,
    {},
    () => ({
      metrics: UNCERTAINTY_METRICS,
      bands: UNCERTAINTY_BANDS_DATA,
      calibrationCurve: CALIBRATION_CURVE_DATA,
      variables: VARIABLE_UNCERTAINTIES,
      isSimulated: true
    })
  );
}
