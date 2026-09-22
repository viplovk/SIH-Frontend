import { useEffect, useRef } from "react";
import L from "leaflet";
import { getIndiaBoundary } from "../../api/mapApi.js";
import { LOCATIONS } from "../../data/locations.js";

/**
 * National Air Quality Index (NAQI) Layer
 * Visualizes regional aerosol concentration and PM2.5 / AQI dispersion
 * 
 * CPCB Scale:
 * 0–50    → Good (Green)
 * 51–100  → Satisfactory (Light Green)
 * 101–200 → Moderate (Yellow)
 * 201–300 → Poor (Orange)
 * 301–400 → Very Poor (Red)
 * 401–500 → Severe (Maroon / Purple)
 */

function getAqiRgb(aqi) {
  if (aqi <= 50) return [16, 185, 129];    // emerald
  if (aqi <= 100) return [132, 204, 22];   // lime
  if (aqi <= 200) return [234, 179, 8];    // amber
  if (aqi <= 300) return [249, 115, 22];   // orange
  if (aqi <= 400) return [239, 68, 68];    // red
  return [147, 51, 234];                   // purple
}

export function AirQualityLayer({
  map,
  visible = false,
  opacity = 0.75
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);

  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load boundary for AQI layer:", err);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-aqi-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "352";

    const container = map.getContainer();
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const render = () => {
      if (!canvasRef.current || !map) return;
      const cvs = canvasRef.current;
      const size = map.getSize();
      if (size.x === 0 || size.y === 0) return;

      const dpr = window.devicePixelRatio || 1;
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

      if (!visible) {
        ctx.restore();
        return;
      }

      ctx.globalAlpha = opacity;

      // Clip to India polygon
      const boundary = boundaryRef.current;
      if (boundary && boundary.length > 2) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < boundary.length; i++) {
          const [bLon, bLat] = boundary[i];
          const pt = map.latLngToContainerPoint([bLat, bLon]);
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

      // Render spatial AQI dispersion around observation hubs
      LOCATIONS.forEach((loc) => {
        const aqi = loc.baseWeather?.airQualityIndex || 85;
        const pt = map.latLngToContainerPoint([loc.lat, loc.lon]);
        const radius = Math.max(35, 120 * (map.getZoom() / 5));

        const [r, g, b] = getAqiRgb(aqi);

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.85)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.45)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    map.on("move", render);
    map.on("zoom", render);
    map.on("resize", render);

    render();

    return () => {
      map.off("move", render);
      map.off("zoom", render);
      map.off("resize", render);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvasRef.current = null;
    };
  }, [map, visible, opacity]);

  return null;
}
