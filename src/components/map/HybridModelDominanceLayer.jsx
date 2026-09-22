import { useEffect, useRef } from "react";
import L from "leaflet";
import { getIndiaBoundary } from "../../api/mapApi.js";
import { LOCATIONS } from "../../data/locations.js";

/**
 * Algoriot Hybrid AI-NWP Model Dominance & Confidence Layer
 * 
 * Visualizes dynamic meta-learner model allocation across Indian climatic regimes:
 * - NWP Dominant (ECMWF IFS / GFS): Navy Blue (#0b3d91) — Orographic / Coastlines / Alpine
 * - AI Model A Dominant (FuXi / GraphCast): Sky Cyan (#0284c7) — Convective / Thermal Heatwaves
 * - AI Model B (WeatherNext / Pangu): Emerald (#059669) — Continental Plateau Transition
 * - Confidence Envelopes & Ensemble Spread (Standard Deviation)
 */

export function HybridModelDominanceLayer({
  map,
  visible = false,
  opacity = 0.7
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);

  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load boundary for hybrid model layer:", err);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-hybrid-dominance-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "358";

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

      // Draw model dominance zones centered at stations
      LOCATIONS.forEach((loc) => {
        const pt = map.latLngToContainerPoint([loc.lat, loc.lon]);
        const weights = loc.modelWeights || { nwp: 50, aiA: 35, aiB: 15 };
        const radius = Math.max(50, 150 * (map.getZoom() / 5));

        // Determine dominant model
        let dominantColor = "rgba(11, 61, 145, 0.65)"; // NWP IFS
        let dominantLabel = "NWP (ECMWF)";
        if (weights.aiA >= weights.nwp && weights.aiA >= weights.aiB) {
          dominantColor = "rgba(2, 132, 199, 0.65)"; // AI FuXi
          dominantLabel = "AI (FuXi)";
        } else if (weights.aiB >= weights.nwp) {
          dominantColor = "rgba(5, 150, 105, 0.65)"; // AI WeatherNext
          dominantLabel = "AI (WeatherNext)";
        }

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
        grad.addColorStop(0, dominantColor);
        grad.addColorStop(0.7, dominantColor.replace("0.65", "0.25"));
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Model Confidence concentric ring
        ctx.strokeStyle = dominantColor.replace("0.65", "0.85");
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label on map
        if (map.getZoom() >= 5.2) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
          ctx.strokeStyle = "rgba(15, 23, 42, 0.8)";
          ctx.lineWidth = 2.5;
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          
          const labelText = `${dominantLabel} • ${loc.regimeConfidence || 90}% CONF`;
          ctx.strokeText(labelText, pt.x, pt.y - 16);
          ctx.fillText(labelText, pt.x, pt.y - 16);
        }
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
