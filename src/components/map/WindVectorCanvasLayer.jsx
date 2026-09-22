// Algoriot Real Wind Vector Field & Streamline Particle Engine
// Real-time advection driven by physical u/v vector fields from Open-Meteo
import React, { useEffect, useRef } from "react";
import { getIndiaBoundary } from "../../api/mapApi.js";

/**
 * Velocity-dependent particle coloring (km/h)
 */
function getParticleColor(speedKmh) {
  if (speedKmh < 6) return "rgba(147, 197, 253, 0.85)";  // Ice Blue (<6 km/h)
  if (speedKmh < 14) return "rgba(56, 189, 248, 0.9)";   // Sky Cyan (6-14 km/h)
  if (speedKmh < 24) return "rgba(52, 211, 153, 0.95)";  // Emerald (14-24 km/h)
  if (speedKmh < 36) return "rgba(251, 191, 36, 0.95)";  // Amber (24-36 km/h)
  if (speedKmh < 50) return "rgba(248, 113, 113, 0.98)"; // Coral Red (36-50 km/h)
  return "rgba(192, 132, 252, 1.0)";                    // Gale Violet (>50 km/h)
}

export function WindVectorCanvasLayer({
  map,
  stations = [],
  frameIndex = 0,
  visible = true,
  opacity = 0.9
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Load India GeoJSON polygon for strict boundary clipping
  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load India boundary for wind layer:", err);
    }
  }, []);

  // Initialize and run Canvas particle simulation
  useEffect(() => {
    if (!map || !map._mapPane || !stations || stations.length === 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = prefersReducedMotion ? 120 : isMobile ? 350 : 800;

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

    const container = map.getContainer();
    if (!container) return;
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
        const size = map.getSize();

        if (size.x === 0 || size.y === 0) {
          animFrameRef.current = requestAnimationFrame(animate);
          return;
        }

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

        // Motion blur trail effect
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = "rgba(0, 0, 0, 0.91)";
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = "source-over";

        if (!isLayerVisible) {
          ctx.clearRect(0, 0, width, height);
          ctx.restore();
          animFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        ctx.globalAlpha = opacity;

        // Clip strictly to India geographic boundary
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

        const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
        lastTimeRef.current = timestamp;

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
          // u = Eastward velocity (positive lon)
          // v = Northward velocity (positive lat)
          const dLon = wind.u * velocityScale;
          const dLat = wind.v * velocityScale;

          p.lon += dLon;
          p.lat += dLat;

          // Current screen point
          const pt2 = map.latLngToContainerPoint([p.lat, p.lon]);

          // Frustum culling
          if (
            pt1.x < -20 || pt1.x > width + 20 ||
            pt1.y < -20 || pt1.y > height + 20
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

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [map, stations, frameIndex, visible, opacity]);

  return null;
}
