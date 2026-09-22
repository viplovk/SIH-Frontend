// Algoriot Real Continuous Cloud Cover Field
// Evaluated from Open-Meteo Cloud Cover (%)
import React, { useEffect, useRef } from "react";
import { getIndiaBoundary, getCloudCoverRgb } from "../../api/mapApi.js";

export function CloudCoverCanvasLayer({
  map,
  stations = [],
  frameIndex = 0,
  visible = true,
  opacity = 0.65
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);

  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load India boundary for cloud cover layer:", err);
    }
  }, []);

  useEffect(() => {
    if (!map || !map._mapPane) return;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-clouds-field-canvas";
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

      const p0 = map.latLngToContainerPoint([22.0, 78.0]);
      const p1 = map.latLngToContainerPoint([19.5, 80.5]);
      const dx = Math.abs(p1.x - p0.x);
      const dy = Math.abs(p1.y - p0.y);
      const blendRadius = Math.max(45, Math.hypot(dx, dy) * 1.35);

      for (let i = 0; i < stations.length; i++) {
        const s = stations[i];
        const frame = s.forecastSeries?.[frameIndex] || s.current;
        const clouds = frame?.cloudCover ?? 20;

        if (clouds < 5) continue; // Clear skies

        const pt = map.latLngToContainerPoint([s.lat, s.lon]);

        if (
          pt.x < -blendRadius ||
          pt.x > width + blendRadius ||
          pt.y < -blendRadius ||
          pt.y > height + blendRadius
        ) {
          continue;
        }

        const [r, g, b] = getCloudCoverRgb(clouds);
        const cloudAlpha = Math.min(0.85, (clouds / 100) * 0.9);

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, blendRadius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${cloudAlpha})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${cloudAlpha * 0.5})`);
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
