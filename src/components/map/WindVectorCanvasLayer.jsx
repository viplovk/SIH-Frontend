// Algoriot Real Continuous Wind Vector Particle Engine
// Renders physical streamlines advected by Open-Meteo u/v velocity fields
// Uses HTML5 Canvas layered above base map and beneath UI controls
import React, { useEffect, useRef } from "react";
import { getIndiaBoundary } from "../../api/mapApi.js";

const PARTICLE_COUNT = 900;

export function WindVectorCanvasLayer({
  map,
  stations = [],
  frameIndex = 0,
  visible = true,
  opacity = 0.75
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const boundaryRef = useRef(null);
  const particlesRef = useRef([]);
  const roRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Load India Boundary Polygon for Frustum Masking
  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load India boundary for wind layer:", err);
    }
  }, []);

  // Wind speed color ramp for particle streamlines
  const getParticleColor = (speedKmh) => {
    if (speedKmh < 8) return "rgba(186, 230, 253, 0.65)"; // Light breeze (sky-200)
    if (speedKmh < 18) return "rgba(56, 189, 248, 0.85)";  // Moderate wind (sky-400)
    if (speedKmh < 32) return "rgba(14, 165, 233, 0.90)";  // Fresh gale (sky-500)
    if (speedKmh < 48) return "rgba(234, 179, 8, 0.95)";   // Strong wind (amber-500)
    return "rgba(239, 68, 68, 0.98)";                     // Severe storm / cyclone (red-500)
  };

  useEffect(() => {
    if (!map || !map._mapPane) return;

    const container = map.getContainer();
    if (!container) return;

    // Create Canvas overlay
    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-wind-particles-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "360";

    container.appendChild(canvas);
    canvasRef.current = canvas;

    // Initialize particle pool across India geographic bounds
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        lat: 8.5 + Math.random() * 26.5,
        lon: 69.0 + Math.random() * 26.0,
        age: Math.floor(Math.random() * 90),
        maxAge: 70 + Math.floor(Math.random() * 70)
      });
    }
    particlesRef.current = particles;

    // Spatial interpolation of u & v at particle position using IDW
    const interpolateWindVector = (lat, lon) => {
      let sumW = 0;
      let sumU = 0;
      let sumV = 0;
      let sumSpeed = 0;

      for (let i = 0; i < stations.length; i++) {
        const s = stations[i];
        const dLat = (s.lat - lat) * 111.0;
        const dLon = (s.lon - lon) * 111.0 * 0.9;
        const d2 = dLat * dLat + dLon * dLon;

        // Weight with smoothing factor to prevent singularity
        const w = 1.0 / (d2 + 16.0);
        sumW += w;

        const f = s.forecastSeries?.[frameIndex] || s.current;
        sumU += (f?.u || 0) * w;
        sumV += (f?.v || 0) * w;
        sumSpeed += (f?.windSpeed || 10) * w;
      }

      if (sumW === 0) return { u: 0, v: 0, speed: 0 };
      const u = sumU / sumW;
      const v = sumV / sumW;
      const speed = sumSpeed / sumW;
      return { u, v, speed };
    };

    let isLayerVisible = visible;

    const animate = (timestamp) => {
      if (!canvasRef.current || !map || !map._mapPane) return;

      try {
        const cvs = canvasRef.current;
        const rect = container.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        if (width <= 0 || height <= 0) {
          animFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        if (cvs.width !== Math.round(width * dpr) || cvs.height !== Math.round(height * dpr)) {
          cvs.width = Math.round(width * dpr);
          cvs.height = Math.round(height * dpr);
          cvs.style.width = `${width}px`;
          cvs.style.height = `${height}px`;
        }

        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Motion blur trail effect
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = "rgba(0, 0, 0, 0.91)";
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = "source-over";

        if (!isLayerVisible || opacity <= 0) {
          ctx.clearRect(0, 0, width, height);
          animFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        ctx.save();

        // 1. Strict Map Viewport Clip: particles NEVER draw outside the map container!
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.clip();

        // 2. Strict India geographic boundary clip
        const boundary = boundaryRef.current;
        if (boundary && boundary.length > 2) {
          ctx.beginPath();
          for (let i = 0; i < boundary.length; i++) {
            const [lon, lat] = boundary[i];
            const pt = map.latLngToContainerPoint([lat, lon]);
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();
          ctx.clip();
        }

        ctx.globalAlpha = opacity;

        const zoom = map.getZoom();
        // Pixel scaling factor based on zoom level
        const velocityScale = 0.00035 * Math.pow(1.35, zoom - 4.5);

        const parts = particlesRef.current;
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          p.age++;

          // Respawn aged or out-of-bounds particles
          if (p.age >= p.maxAge || p.lat < 7.0 || p.lat > 37.0 || p.lon < 67.5 || p.lon > 97.5) {
            p.lat = 8.5 + Math.random() * 26.5;
            p.lon = 69.0 + Math.random() * 26.0;
            p.age = 0;
            p.maxAge = 60 + Math.floor(Math.random() * 60);
            continue;
          }

          const wind = interpolateWindVector(p.lat, p.lon);

          // Previous screen point
          const pt1 = map.latLngToContainerPoint([p.lat, p.lon]);

          // Advect particle along real meteorological vector components
          const dLon = wind.u * velocityScale;
          const dLat = wind.v * velocityScale;

          p.lon += dLon;
          p.lat += dLat;

          // Current screen point
          const pt2 = map.latLngToContainerPoint([p.lat, p.lon]);

          // Frustum culling
          if (
            pt1.x < 0 || pt1.x > width ||
            pt1.y < 0 || pt1.y > height
          ) {
            continue;
          }

          // Draw streamline segment
          ctx.strokeStyle = getParticleColor(wind.speed);
          ctx.lineWidth = Math.max(1.2, Math.min(2.8, (wind.speed / 15) * 1.5));
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        }

        ctx.restore();
        animFrameRef.current = requestAnimationFrame(animate);
      } catch (err) {
        // Map destroyed or detached during active animation tick
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // ResizeObserver on map container
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        // Will resize automatically in next animation tick
      });
      ro.observe(container);
      roRef.current = ro;
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
    };
  }, [map, stations, frameIndex, visible, opacity]);

  return null;
}
