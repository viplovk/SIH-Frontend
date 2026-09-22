// Forecast Service Layer
import { apiFetch } from "./client.js";
import { generateTimelineData, FORECAST_HORIZONS, FORECAST_VARIABLES } from "../data/mockForecast.js";
import { LOCATIONS } from "../data/locations.js";

export async function getForecast(locationId = "delhi", horizonId = "24h") {
  return apiFetch(
    `/forecast?location=${locationId}&horizon=${horizonId}`,
    {},
    () => {
      const location = LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
      const timeline = generateTimelineData(locationId, horizonId);
      return {
        location,
        horizonId,
        timeline,
        current: location.baseWeather,
        modelWeights: location.modelWeights,
        regime: location.currentRegime,
        regimeConfidence: location.regimeConfidence,
        isSimulated: true
      };
    }
  );
}

export async function getForecastTimeline(locationId = "delhi", horizonId = "24h") {
  return apiFetch(
    `/forecast/timeline?location=${locationId}&horizon=${horizonId}`,
    {},
    () => generateTimelineData(locationId, horizonId)
  );
}

export { FORECAST_HORIZONS, FORECAST_VARIABLES };
