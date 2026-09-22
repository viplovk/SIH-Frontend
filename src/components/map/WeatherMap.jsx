import React from "react";
import { IndiaWeatherMap } from "./IndiaWeatherMap.jsx";

/**
 * WeatherMap Component (Modular Alias)
 */
export function WeatherMap(props) {
  return <IndiaWeatherMap {...props} />;
}

export default WeatherMap;
