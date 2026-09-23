// Algoriot Real Continuous Relative Humidity Field
// Evaluated from Open-Meteo Operational Forecast (%)
import React, { useEffect, useRef } from "react";
import { getIndiaBoundary } from "../../api/mapApi.js";
import { getOrBuildSpatialGrid, renderWeatherRasterField } from "./weatherRasterEngine.js";

export function HumidityFieldCanvasLayer({
  map,
  stations = [],
  frameIndex = 0,
  visible = true,
  opacity = 0.75
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);
  const roRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load India boundary for humidity layer:", err);
    }
  }, []);

  useEffect(() => {
    if (!map || !map._mapPane) return;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-humidity-field-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "350";

    const container = map.getContainer();
    if (!container) return;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const render = () => {
      if (!canvasRef.current || !map || !map._mapPane || !visible) return;
      try {
        const grid = getOrBuildSpatialGrid(stations, "humidity", frameIndex);
        if (!grid) return;

        renderWeatherRasterField({
          canvas: canvasRef.current,
          map,
          boundaryCoords: boundaryRef.current,
          grid,
          variable: "humidity",
          opacity
        });
      } catch (err) {
        // Map destroyed or detached during render
      }
    };

    const scheduleRender = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(render);
    };

    scheduleRender();

    map.on("move", scheduleRender);
    map.on("zoom", scheduleRender);
    map.on("resize", scheduleRender);
    map.on("viewreset", scheduleRender);

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        scheduleRender();
      });
      ro.observe(container);
      roRef.current = ro;
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
      if (map && map._mapPane) {
        map.off("move", scheduleRender);
        map.off("zoom", scheduleRender);
        map.off("resize", scheduleRender);
        map.off("viewreset", scheduleRender);
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
    };
  }, [map, stations, frameIndex, visible, opacity]);

  return null;
}
