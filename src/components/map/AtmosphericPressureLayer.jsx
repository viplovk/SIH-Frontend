import { useEffect, useRef } from "react";
import L from "leaflet";
import { getIndiaBoundary } from "../../api/mapApi.js";

/**
 * Atmospheric Pressure & Synoptic Isobar Contours
 * Renders mean sea level pressure (MSLP) contours (hPa) with synoptic High/Low centers
 */

export function AtmosphericPressureLayer({
  map,
  timelineStep = "NOW",
  visible = false,
  opacity = 0.85
}) {
  const canvasRef = useRef(null);
  const boundaryRef = useRef(null);

  useEffect(() => {
    try {
      const geo = getIndiaBoundary();
      const coords = geo.features[0].geometry.coordinates[0];
      boundaryRef.current = coords;
    } catch (err) {
      console.warn("Failed to load boundary for pressure layer:", err);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement("canvas");
    canvas.className = "algoriot-pressure-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "365";

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

      // Synoptic pressure contours (latitudes across India)
      // Low in north/central (~1002-1006 hPa), high in south (~1012-1016 hPa)
      const isobars = [
        { val: 1002, points: [[27.0, 74.0], [26.0, 78.0], [25.0, 83.0], [25.5, 89.0]] },
        { val: 1004, points: [[24.5, 71.0], [23.5, 76.0], [22.8, 82.0], [23.2, 88.0]] },
        { val: 1006, points: [[22.0, 70.0], [21.0, 75.0], [20.0, 80.0], [20.5, 87.0]] },
        { val: 1008, points: [[19.0, 71.5], [18.0, 76.5], [17.5, 81.5], [18.0, 85.5]] },
        { val: 1010, points: [[16.0, 73.0], [15.0, 77.0], [14.5, 81.0], [15.0, 84.0]] },
        { val: 1012, points: [[13.0, 74.0], [12.0, 77.5], [11.5, 80.5], [12.0, 83.0]] },
        { val: 1014, points: [[10.0, 75.5], [9.0, 77.5], [8.5, 79.5]] }
      ];

      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "rgba(71, 85, 105, 0.75)";
      ctx.setLineDash([6, 3]);

      isobars.forEach((iso) => {
        ctx.beginPath();
        iso.points.forEach((coord, idx) => {
          const pt = map.latLngToContainerPoint(coord);
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Label on middle point
        const midIdx = Math.floor(iso.points.length / 2);
        const midPt = map.latLngToContainerPoint(iso.points[midIdx]);
        ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
        ctx.font = "bold 10px monospace";
        ctx.fillText(`${iso.val} hPa`, midPt.x + 8, midPt.y - 4);
      });

      ctx.setLineDash([]);

      // Draw Low and High pressure centers
      const centers = [
        { type: "L", label: "MONSOON LOW (1000 hPa)", lat: 25.8, lon: 82.5, color: "#dc2626" },
        { type: "H", label: "RIDGE HIGH (1014 hPa)", lat: 9.5, lon: 77.8, color: "#2563eb" }
      ];

      centers.forEach((c) => {
        const pt = map.latLngToContainerPoint([c.lat, c.lon]);
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "black 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.type, pt.x, pt.y);

        // Label badge
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.font = "bold 9px monospace";
        ctx.fillText(c.label, pt.x, pt.y + 20);
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
  }, [map, timelineStep, visible, opacity]);

  return null;
}
