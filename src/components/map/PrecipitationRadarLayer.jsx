import { useEffect, useRef } from "react";
import L from "leaflet";
import { getIndiaBoundary } from "../../api/mapApi.js";

/**
 * Doppler Radar & Precipitation Reflectivity (dBZ) Overlay
 * Simulates high-resolution convective precipitation cores and radar sweeps
 * 
 * Radar Reflectivity Scale:
 * 15–25 dBZ → Light rain / drizzle (cyan / green)
 * 25–35 dBZ → Moderate steady rain (green / yellow)
 * 35–45 dBZ → Heavy downpour (orange / red)
 * 45–55+ dBZ → Severe thunderstorm / squall cell (crimson / violet)
 */

// Radar Reflectivity Color Scale
function getRadarColor(dbz, alpha = 0.7) {
  if (dbz < 20) return `rgba(56, 189, 248, ${alpha * 0.7})`; // cyan
  if (dbz < 30) return `rgba(34, 197, 94, ${alpha * 0.8})`;  // green
  if (dbz < 40) return `rgba(234, 179, 8, ${alpha * 0.85})`; // yellow
  if (dbz < 50) return `rgba(249, 115, 22, ${alpha * 0.9})`; // orange
  if (dbz < 58) return `rgba(239, 68, 68, ${alpha * 0.95})`; // red
  return `rgba(168, 85, 247, ${alpha})`;                     // purple/magenta (severe)
}

// Active convective clusters across India parameterized by step
function getConvectiveCells(timelineStep = "NOW") {
  // Step offset coordinates to simulate cloud movement (NE propagation in monsoon)
  const stepOffsets = {
    "NOW": { dLat: 0.0, dLon: 0.0, intensity: 1.0 },
    "+3H": { dLat: 0.3, dLon: 0.4, intensity: 1.1 },
    "+6H": { dLat: 0.7, dLon: 0.9, intensity: 1.25 },
    "+12H": { dLat: 1.2, dLon: 1.6, intensity: 0.9 },
    "+24H": { dLat: 0.2, dLon: 0.3, intensity: 0.95 },
    "+48H": { dLat: 0.5, dLon: 0.8, intensity: 1.05 },
    "+72H": { dLat: 0.9, dLon: 1.4, intensity: 1.15 }
  };
  const off = stepOffsets[timelineStep] || stepOffsets["NOW"];

  return [
    // 1. Mumbai / Western Ghats intense coastal orographic belt
    { lat: 19.1 + off.dLat, lon: 73.2 + off.dLon, radiusKm: 180, peakDbz: Math.round(52 * off.intensity) },
    { lat: 16.5 + off.dLat, lon: 74.0 + off.dLon, radiusKm: 140, peakDbz: Math.round(48 * off.intensity) },
    { lat: 10.2 + off.dLat, lon: 76.4 + off.dLon, radiusKm: 160, peakDbz: Math.round(50 * off.intensity) },

    // 2. Northeast & Assam / Brahmaputra basin (Guwahati / Meghalaya)
    { lat: 26.0 + off.dLat * 0.5, lon: 91.8 + off.dLon * 0.5, radiusKm: 220, peakDbz: Math.round(55 * off.intensity) },
    { lat: 25.2 + off.dLat * 0.5, lon: 91.7 + off.dLon * 0.5, radiusKm: 150, peakDbz: Math.round(58 * off.intensity) }, // Cherrapunji core

    // 3. Kolkata & Bay of Bengal coastal squall / Kalbaisakhi
    { lat: 22.4 + off.dLat, lon: 88.5 + off.dLon, radiusKm: 170, peakDbz: Math.round(46 * off.intensity) },
    { lat: 20.8 + off.dLat, lon: 86.8 + off.dLon, radiusKm: 190, peakDbz: Math.round(44 * off.intensity) },

    // 4. Central Gangetic Monsoon Trough (Lucknow / Patna / Delhi)
    { lat: 26.6 + off.dLat * 0.8, lon: 81.2 + off.dLon * 0.8, radiusKm: 160, peakDbz: Math.round(45 * off.intensity) },
    { lat: 25.4 + off.dLat * 0.8, lon: 85.0 + off.dLon * 0.8, radiusKm: 150, peakDbz: Math.round(47 * off.intensity) },
    { lat: 28.5 + off.dLat * 0.6, lon: 77.4 + off.dLon * 0.6, radiusKm: 130, peakDbz: Math.round(42 * off.intensity) },

    // 5. Intermontane Kashmir (Western Disturbance)
    { lat: 34.2 + off.dLat * 0.4, lon: 74.6 + off.dLon * 0.4, radiusKm: 110, peakDbz: Math.round(38 * off.intensity) }
  ];
}

export function PrecipitationRadarLayer({
  map,
  timelineStep = "NOW",
  visible = false,
  opacity = 0.75
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load boundary for radar layer:", err);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-radar-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "355";

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

      const cells = getConvectiveCells(timelineStep);

      // Render each convective storm cell with nested reflectivity contours
      cells.forEach((cell) => {
        const pt = map.latLngToContainerPoint([cell.lat, cell.lon]);
        
        // Approximate pixel radius from km at current zoom
        const ptEdge = map.latLngToContainerPoint([cell.lat, cell.lon + (cell.radiusKm / 111)]);
        const radiusPx = Math.max(25, Math.abs(ptEdge.x - pt.x));

        // Skip if outside viewport
        if (
          pt.x < -radiusPx ||
          pt.x > width + radiusPx ||
          pt.y < -radiusPx ||
          pt.y > height + radiusPx
        ) {
          return;
        }

        // Concentric radial gradient matching Doppler radar reflectivity profile
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radiusPx);
        grad.addColorStop(0, getRadarColor(cell.peakDbz, 0.95));
        grad.addColorStop(0.35, getRadarColor(cell.peakDbz - 10, 0.85));
        grad.addColorStop(0.65, getRadarColor(cell.peakDbz - 20, 0.6));
        grad.addColorStop(0.9, getRadarColor(20, 0.3));
        grad.addColorStop(1, "rgba(56, 189, 248, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radiusPx, 0, Math.PI * 2);
        ctx.fill();

        // Draw textured reflectivity cells (speckles for precipitation noise)
        if (cell.peakDbz >= 45) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          for (let s = 0; s < 12; s++) {
            const angle = (s / 12) * Math.PI * 2;
            const dist = radiusPx * 0.25 * (0.5 + Math.sin(s * 1.5) * 0.4);
            const sx = pt.x + Math.cos(angle) * dist;
            const sy = pt.y + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      ctx.restore();
    };

    const requestRender = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(render);
    };

    map.on("move", requestRender);
    map.on("zoom", requestRender);
    map.on("resize", requestRender);

    requestRender();

    return () => {
      map.off("move", requestRender);
      map.off("zoom", requestRender);
      map.off("resize", requestRender);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvasRef.current = null;
    };
  }, [map, timelineStep, visible, opacity]);

  return null;
}
