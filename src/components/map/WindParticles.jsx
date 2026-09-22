import { useEffect, useRef } from "react";
import L from "leaflet";
import { getIndiaBoundary } from "../../api/mapApi.js";

/**
 * Wind Vector Field & High-Performance Canvas Particle System
 * 
 * Generates continuous streamline particles across the Indian subcontinent
 * driven by meteorological u/v vector fields.
 * 
 * Features:
 * - HTML5 Canvas hardware accelerated particle simulation
 * - India boundary clipping (particles only render and flow over land/coastal domain)
 * - Timeline-sensitive wind speed & direction modulation
 * - Velocity-dependent color gradient (calm cyan/blue → moderate teal/green → high amber/red)
 * - Motion-blur trail effect with smooth alpha fading
 * - Respects prefers-reduced-motion
 */

// Synoptic wind field vector generator for India at specific lat/lon and timeline step
function getWindVectorAt(lat, lon, timelineStep = "NOW") {
  // Step variations (gusts, diurnal shifts)
  const stepFactors = {
    "NOW": 1.0,
    "+3H": 1.15,
    "+6H": 1.25,
    "+12H": 0.85,
    "+24H": 1.05,
    "+48H": 0.95,
    "+72H": 1.1
  };
  const speedMult = stepFactors[timelineStep] || 1.0;

  // Synoptic regimes across India:
  // 1. South & Peninsular India (lat < 18): Strong South-Westerly monsoon advection
  if (lat < 18) {
    const u = (5.5 + Math.sin(lat * 0.4) * 2.0) * speedMult; // Eastward
    const v = (4.0 + Math.cos(lon * 0.3) * 1.5) * speedMult; // Northward
    return { u, v, speed: Math.hypot(u, v) };
  }

  // 2. Central India & Western Ghats (18 <= lat < 24)
  if (lat < 24) {
    if (lon < 75) {
      // West coast & Gujarat: strong WSW flow
      const u = (6.0 + Math.sin(lon * 0.2)) * speedMult;
      const v = (2.5 + Math.cos(lat * 0.3)) * speedMult;
      return { u, v, speed: Math.hypot(u, v) };
    } else {
      // Bay of Bengal coastal recurvature: SE to NW flow entering land
      const u = (-3.5 + Math.sin(lat * 0.5) * 1.5) * speedMult;
      const v = (4.5 + Math.cos(lon * 0.2) * 1.2) * speedMult;
      return { u, v, speed: Math.hypot(u, v) };
    }
  }

  // 3. Indo-Gangetic Plain (24 <= lat < 30)
  // Monsoon trough axis: Easterly/South-Easterly flow towards Delhi
  if (lat < 30) {
    if (lon > 82) {
      // East Gangetic & Assam: curving Southerly / South-Easterly
      const u = (-2.5 + Math.sin(lon * 0.3)) * speedMult;
      const v = (4.0 + Math.cos(lat * 0.4)) * speedMult;
      return { u, v, speed: Math.hypot(u, v) };
    } else {
      // West Gangetic / Delhi: convergence zone
      const u = (-3.8 + Math.cos(lat * 0.5)) * speedMult;
      const v = (1.5 + Math.sin(lon * 0.4)) * speedMult;
      return { u, v, speed: Math.hypot(u, v) };
    }
  }

  // 4. Northwest & Himalayan Region (lat >= 30)
  // Subtropical Westerly Jet influence: strong West-to-East flow
  const u = (7.5 + Math.sin(lat * 0.3) * 2.0) * speedMult;
  const v = (-1.2 + Math.cos(lon * 0.5) * 1.5) * speedMult;
  return { u, v, speed: Math.hypot(u, v) };
}

// Particle color based on velocity (km/h or m/s)
function getParticleColor(speed) {
  if (speed < 4) return "rgba(147, 197, 253, 0.85)";  // light blue
  if (speed < 6) return "rgba(56, 189, 248, 0.9)";   // sky cyan
  if (speed < 8) return "rgba(52, 211, 153, 0.9)";   // emerald
  if (speed < 10) return "rgba(251, 191, 36, 0.95)"; // amber
  return "rgba(248, 113, 113, 0.95)";               // coral red
}

export function WindParticles({
  map,
  timelineStep = "NOW",
  visible = true,
  opacity = 0.85
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Load boundary coordinates for clipping
  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load India boundary for wind particles:", err);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-wind-particles-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "360"; // Above heatmap (350), below markers (600)

    const container = map.getContainer();
    container.appendChild(canvas);
    canvasRef.current = canvas;

    // Initialize particle pool across India bounds [8-36°N, 68-96°E]
    const PARTICLE_COUNT = prefersReducedMotion ? 180 : 650;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        lat: 8.0 + Math.random() * 28.0,
        lon: 68.5 + Math.random() * 28.0,
        age: Math.floor(Math.random() * 80),
        maxAge: 60 + Math.floor(Math.random() * 60)
      });
    }
    particlesRef.current = particles;

    const render = (now) => {
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

      // Trail fade effect: clear with slight transparency for smooth motion blur
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-over";

      if (!visible) {
        ctx.clearRect(0, 0, width, height);
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

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      // Map scale factor for lat/lon step
      const zoom = map.getZoom();
      const speedScale = 0.0035 * Math.pow(1.15, zoom - 5);

      const parts = particlesRef.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.age += 1;

        if (p.age > p.maxAge || p.lat < 6.5 || p.lat > 37.5 || p.lon < 67.5 || p.lon > 98.0) {
          // Respawn in India
          p.lat = 8.0 + Math.random() * 28.0;
          p.lon = 68.5 + Math.random() * 28.0;
          p.age = 0;
          p.maxAge = 60 + Math.floor(Math.random() * 60);
          continue;
        }

        const prevPt = map.latLngToContainerPoint([p.lat, p.lon]);

        // Calculate wind vector at current coordinate
        const vec = getWindVectorAt(p.lat, p.lon, timelineStep);

        // Advance lat and lon
        // u = Eastward (+) or Westward (-)
        // v = Northward (+) or Southward (-)
        p.lon += vec.u * speedScale;
        p.lat += vec.v * speedScale;

        const nextPt = map.latLngToContainerPoint([p.lat, p.lon]);

        // Culling
        if (
          (prevPt.x < 0 && nextPt.x < 0) ||
          (prevPt.x > width && nextPt.x > width) ||
          (prevPt.y < 0 && nextPt.y < 0) ||
          (prevPt.y > height && nextPt.y > height)
        ) {
          continue;
        }

        // Particle opacity fades in and out with age
        const lifeRatio = p.age / p.maxAge;
        const alpha = Math.sin(lifeRatio * Math.PI);

        ctx.strokeStyle = getParticleColor(vec.speed);
        ctx.lineWidth = Math.min(2.2, 0.8 + (vec.speed / 10) * 1.2);
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(prevPt.x, prevPt.y);
        ctx.lineTo(nextPt.x, nextPt.y);
        ctx.stroke();
      }

      ctx.restore();

      if (!prefersReducedMotion && visible) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // If reduced motion is enabled, draw single static frame
    if (prefersReducedMotion) {
      render(performance.now());
    } else {
      animFrameRef.current = requestAnimationFrame(render);
    }

    const handleMapChange = () => {
      // Clear canvas on zoom/move to prevent ghost trails across shifts
      if (canvasRef.current) {
        const cvs = canvasRef.current;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, cvs.width, cvs.height);
      }
    };

    map.on("movestart", handleMapChange);
    map.on("zoomstart", handleMapChange);

    return () => {
      map.off("movestart", handleMapChange);
      map.off("zoomstart", handleMapChange);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvasRef.current = null;
    };
  }, [map, timelineStep, visible, opacity]);

  return null;
}
