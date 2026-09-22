// Algoriot Real Continuous Precipitation Field
// Evaluated from Open-Meteo Forecast Precipitation (mm/h)
import React, { useEffect, useRef } from "react";
import { getIndiaBoundary, getPrecipitationRgb } from "../../api/mapApi.js";

export function PrecipitationFieldCanvasLayer({
  map,
  stations = [],
  frameIndex = 0,
  visible = true,
  opacity = 0.8
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);

  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load India boundary for precipitation layer:", err);
    }
  }, []);

  useEffect(() => {
    if (!map || !map._mapPane) return;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-precipitation-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "352";

    const container = map.getContainer();
    if (!container) return;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const render = () => {
      if (!canvasRef.current || !map || !map._mapPane || !visible) return;
      try {
        const cvs = canvasRef.current;
        const size = map.getSize();
        if (size.x === 0 || size.y === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = size.x;
      const height = size.y;

      if (cvs.width !== width * dpr || cvs.height !== height * dpr) {
        cvs.width = width * dpr;
        cvs.height = height * dpr;
        cvs.style.width = `${width}px`;
        cvs.style.height = `${height}px`;
      }

      const ctx = cvs.getContext("2d");
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      ctx.globalAlpha = opacity;

      // 1. Clip strictly to India Boundary Polygon
      const boundary = boundaryRef.current;
      if (boundary && boundary.length > 2) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < boundary.length; i++) {
          const [lon, lat] = boundary[i];
          const pt = map.latLngToContainerPoint([lat, lon]);
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.closePath();
        ctx.clip();
      }

      if (!stations || stations.length === 0) {
        ctx.restore();
        return;
      }

      // Compute dynamic blending radius based on map zoom
      const p0 = map.latLngToContainerPoint([22.0, 78.0]);
      const p1 = map.latLngToContainerPoint([20.0, 80.0]);
      const dx = Math.abs(p1.x - p0.x);
      const dy = Math.abs(p1.y - p0.y);
      const blendRadius = Math.max(35, Math.hypot(dx, dy) * 1.1);

      // Render precipitation field from real station forecast data
      for (let i = 0; i < stations.length; i++) {
        const s = stations[i];
        const frame = s.forecastSeries?.[frameIndex] || s.current;
        const mmh = frame?.precipitation ?? 0.0;

        if (mmh <= 0.05) continue; // Transparent / dry areas

        const pt = map.latLngToContainerPoint([s.lat, s.lon]);

        if (
          pt.x < -blendRadius ||
          pt.x > width + blendRadius ||
          pt.y < -blendRadius ||
          pt.y > height + blendRadius
        ) {
          continue;
        }

        const rgb = getPrecipitationRgb(mmh);
        if (!rgb) continue;

        const [r, g, b] = rgb;
        // Higher intensity precipitation has tighter, denser cores
        const coreIntensity = Math.min(0.95, 0.45 + (mmh / 15) * 0.5);

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, blendRadius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${coreIntensity})`);
        grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${coreIntensity * 0.6})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, blendRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      } catch (err) {
        // Map destroyed or detached during render
      }
    };

    render();

    map.on("move", render);
    map.on("zoom", render);
    map.on("resize", render);

    return () => {
      if (map && map._mapPane) {
        map.off("move", render);
        map.off("zoom", render);
        map.off("resize", render);
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [map, stations, frameIndex, visible, opacity]);

  return null;
}
