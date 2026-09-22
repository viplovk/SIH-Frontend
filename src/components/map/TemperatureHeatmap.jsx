import { useEffect, useRef } from "react";
import L from "leaflet";
import { getTemperatureRgb, getIndiaBoundary, getIndiaTemperatureGrid } from "../../api/mapApi.js";

/**
 * TemperatureHeatmap Component for Leaflet
 * 
 * Renders an optimized, high-performance HTML5 Canvas temperature heat-grid
 * strictly clipped to the geographical boundary of India.
 * 
 * Key Features:
 * - 0.5° actual meteorological data grid cells across India
 * - Continuous temperature gradient (<20°C cool → 40°C+ extreme)
 * - India polygon boundary clipping via Canvas ctx.clip()
 * - Responsive to zoom, pan, and timeline changes
 * - Hardware accelerated, 60fps smooth rendering
 * - Non-blocking pointer events for city markers
 */
export function TemperatureHeatmap({
  map,
  timelineStep = "NOW",
  opacity = 0.75,
  visible = true
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize India boundary coordinates once
  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load India boundary coordinates:", err);
    }
  }, []);

  // Setup Canvas Layer inside Leaflet Map
  useEffect(() => {
    if (!map) return;

    // Create Canvas in the overlay pane (below markers at zIndex 600)
    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-heatmap-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "350"; // Above tiles (200), below city markers (600)

    const container = map.getContainer();
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const render = () => {
      if (!canvasRef.current || !map) return;
      const cvs = canvasRef.current;
      const size = map.getSize();

      if (size.x === 0 || size.y === 0) return;

      // Handle Retina / HiDPI screens
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

      // 1. Clip to India Boundary Polygon so heat never spills outside India
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

      // 2. Fetch grid evaluated for current timelineStep
      const grid = getIndiaTemperatureGrid(timelineStep);

      // Compute grid cell radius based on map zoom
      const p0 = map.latLngToContainerPoint([22.0, 78.0]);
      const p1 = map.latLngToContainerPoint([21.5, 78.5]);
      const cellDx = Math.abs(p1.x - p0.x);
      const cellDy = Math.abs(p1.y - p0.y);
      const radius = Math.max(12, Math.max(cellDx, cellDy) * 1.4);

      // 3. Render grid points with smooth continuous radial blending
      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        const pt = map.latLngToContainerPoint([cell.lat, cell.lon]);

        // Viewport frustum culling
        if (
          pt.x < -radius ||
          pt.x > width + radius ||
          pt.y < -radius ||
          pt.y > height + radius
        ) {
          continue;
        }

        const [r, g, b] = getTemperatureRgb(cell.temperature);

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.85)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.55)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. On deeper zoom (>= 6), draw subtle grid centroid indicators
      if (map.getZoom() >= 6) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < grid.length; i++) {
          const pt = map.latLngToContainerPoint([grid[i].lat, grid[i].lon]);
          if (pt.x >= 0 && pt.x <= width && pt.y >= 0 && pt.y <= height) {
            ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2);
          }
        }
      }

      ctx.restore();
    };

    const requestRender = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Attach Leaflet map listeners
    map.on("move", requestRender);
    map.on("zoom", requestRender);
    map.on("resize", requestRender);
    map.on("viewreset", requestRender);

    // Initial render
    requestRender();

    return () => {
      map.off("move", requestRender);
      map.off("zoom", requestRender);
      map.off("resize", requestRender);
      map.off("viewreset", requestRender);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvasRef.current = null;
    };
  }, [map]);

  // Trigger re-render when timelineStep, opacity, or visibility changes
  useEffect(() => {
    if (!canvasRef.current || !map) return;
    const cvs = canvasRef.current;
    const size = map.getSize();
    if (size.x === 0 || size.y === 0) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const dpr = window.devicePixelRatio || 1;
      const width = size.x;
      const height = size.y;
      const ctx = cvs.getContext("2d");
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      if (!visible) {
        ctx.restore();
        return;
      }

      ctx.globalAlpha = opacity;

      // Clip to India Boundary Polygon
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

      const grid = getIndiaTemperatureGrid(timelineStep);
      const p0 = map.latLngToContainerPoint([22.0, 78.0]);
      const p1 = map.latLngToContainerPoint([21.5, 78.5]);
      const cellDx = Math.abs(p1.x - p0.x);
      const cellDy = Math.abs(p1.y - p0.y);
      const radius = Math.max(12, Math.max(cellDx, cellDy) * 1.4);

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        const pt = map.latLngToContainerPoint([cell.lat, cell.lon]);

        if (
          pt.x < -radius ||
          pt.x > width + radius ||
          pt.y < -radius ||
          pt.y > height + radius
        ) {
          continue;
        }

        const [r, g, b] = getTemperatureRgb(cell.temperature);

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.85)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.55)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (map.getZoom() >= 6) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < grid.length; i++) {
          const pt = map.latLngToContainerPoint([grid[i].lat, grid[i].lon]);
          if (pt.x >= 0 && pt.x <= width && pt.y >= 0 && pt.y <= height) {
            ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2);
          }
        }
      }

      ctx.restore();
    });
  }, [map, timelineStep, opacity, visible]);

  return null;
}
