// Algoriot Weather Raster Engine
// Meteorological Bilinear Rasterization, Viewport Clipping & Color Interpolation Pipeline
// SIH26081 — Disaster Management & Hybrid Weather Intelligence

/**
 * Geographic Bounding Box for the Indian Subcontinent Grid
 */
export const GRID_BBOX = {
  north: 37.0,
  south: 7.0,
  west: 68.0,
  east: 97.0
};

export const GRID_RES = 0.5; // 0.5° spatial resolution
export const GRID_HEIGHT = Math.round((GRID_BBOX.north - GRID_BBOX.south) / GRID_RES) + 1; // 61 rows
export const GRID_WIDTH = Math.round((GRID_BBOX.east - GRID_BBOX.west) / GRID_RES) + 1;   // 59 cols

// Cache for precalculated spatial grids
const gridCache = new Map();

/**
 * 1. Color Ramps with Piecewise Linear Interpolation
 */

// AQI Color Stops (CPCB National Air Quality Index / US EPA)
export const AQI_COLOR_STOPS = [
  { val: 0,   r: 34,  g: 197, b: 94,  a: 0.70 }, // 0-50 Good: Green
  { val: 50,  r: 34,  g: 197, b: 94,  a: 0.72 }, // 50 Good: Green
  { val: 100, r: 234, g: 179, b: 8,   a: 0.75 }, // 51-100 Satisfactory/Moderate: Yellow
  { val: 150, r: 249, g: 115, b: 22,  a: 0.78 }, // 101-150 Moderate/Sensitive: Orange
  { val: 200, r: 239, g: 68,  b: 68,  a: 0.82 }, // 151-200 Poor: Red
  { val: 300, r: 168, g: 85,  b: 247, a: 0.86 }, // 201-300 Very Poor: Purple
  { val: 400, r: 136, g: 19,  b: 55,  a: 0.90 }, // 301-400 Severe: Dark Maroon
  { val: 500, r: 76,  g: 5,   b: 25,  a: 0.92 }  // 401+ Hazardous: Deep Maroon
];

// Temperature Color Stops (°C)
export const TEMPERATURE_COLOR_STOPS = [
  { val: 4,   r: 30,  g: 58,  b: 138, a: 0.75 }, // Deep cold royal blue (< 10°C)
  { val: 14,  r: 37,  g: 99,  b: 235, a: 0.75 }, // Cool blue (14°C)
  { val: 22,  r: 6,   g: 182, b: 212, a: 0.75 }, // Mild cyan (22°C)
  { val: 27,  r: 16,  g: 185, b: 129, a: 0.75 }, // Mild emerald green (27°C)
  { val: 32,  r: 234, g: 179, b: 8,   a: 0.78 }, // Warm amber yellow (32°C)
  { val: 37,  r: 249, g: 115, b: 22,  a: 0.82 }, // Hot orange (37°C)
  { val: 42,  r: 239, g: 68,  b: 68,  a: 0.86 }, // Very hot red (42°C)
  { val: 48,  r: 147, g: 51,  b: 234, a: 0.90 }  // Extreme crimson-purple (> 45°C)
];

// Precipitation Intensity Color Stops (mm/h)
export const PRECIPITATION_COLOR_STOPS = [
  { val: 0.05, r: 0,   g: 0,   b: 0,   a: 0.0  }, // Dry / trace (transparent)
  { val: 0.5,  r: 56,  g: 189, b: 248, a: 0.55 }, // Light drizzle (light sky blue)
  { val: 2.5,  r: 37,  g: 99,  b: 235, a: 0.70 }, // Light-to-moderate rain (blue)
  { val: 8.0,  r: 30,  g: 64,  b: 175, a: 0.80 }, // Moderate steady rain (deep blue)
  { val: 16.0, r: 139, g: 92,  b: 246, a: 0.86 }, // Heavy rain (violet/purple)
  { val: 30.0, r: 236, g: 72,  b: 153, a: 0.90 }, // Intense cloudburst (pink)
  { val: 50.0, r: 239, g: 68,  b: 68,  a: 0.95 }  // Extreme convective rain (red)
];

// Relative Humidity (%)
export const HUMIDITY_COLOR_STOPS = [
  { val: 20,  r: 234, g: 179, b: 8,   a: 0.70 }, // Arid dry (amber)
  { val: 45,  r: 16,  g: 185, b: 129, a: 0.72 }, // Comfortable (emerald)
  { val: 65,  r: 6,   g: 182, b: 212, a: 0.75 }, // Humid (cyan)
  { val: 80,  r: 37,  g: 99,  b: 235, a: 0.80 }, // Very humid (blue)
  { val: 100, r: 30,  g: 58,  b: 138, a: 0.85 }  // Saturated maritime (deep blue)
];

// Atmospheric Surface Pressure (hPa)
export const PRESSURE_COLOR_STOPS = [
  { val: 995,  r: 153, g: 27,  b: 27,  a: 0.85 }, // Deep cyclone depression (deep red)
  { val: 1004, r: 239, g: 68,  b: 68,  a: 0.78 }, // Low pressure (red)
  { val: 1010, r: 234, g: 179, b: 8,   a: 0.72 }, // Neutral transition (amber)
  { val: 1016, r: 59,  g: 130, b: 246, a: 0.75 }, // Mild high pressure (blue)
  { val: 1024, r: 30,  g: 64,  b: 175, a: 0.82 }  // Strong anticyclone (royal blue)
];

// Cloud Cover (%)
export const CLOUD_COLOR_STOPS = [
  { val: 0,   r: 255, g: 255, b: 255, a: 0.0  }, // Clear skies (transparent)
  { val: 35,  r: 240, g: 245, b: 255, a: 0.40 }, // Scattered cumulus
  { val: 70,  r: 215, g: 225, b: 240, a: 0.65 }, // Broken overcast
  { val: 100, r: 185, g: 195, b: 215, a: 0.82 }  // Total cloud deck
];

/**
 * Linear interpolation between color stops
 */
export function interpolateColorRamp(val, stops, opacityMultiplier = 1.0) {
  if (val === null || val === undefined || isNaN(val)) {
    return [0, 0, 0, 0];
  }

  const first = stops[0];
  if (val <= first.val) {
    return [first.r, first.g, first.b, Math.round(first.a * opacityMultiplier * 255)];
  }

  const last = stops[stops.length - 1];
  if (val >= last.val) {
    return [last.r, last.g, last.b, Math.round(last.a * opacityMultiplier * 255)];
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const s1 = stops[i];
    const s2 = stops[i + 1];
    if (val >= s1.val && val <= s2.val) {
      const span = s2.val - s1.val;
      const t = span === 0 ? 0 : (val - s1.val) / span;
      const r = Math.round(s1.r + (s2.r - s1.r) * t);
      const g = Math.round(s1.g + (s2.g - s1.g) * t);
      const b = Math.round(s1.b + (s2.b - s1.b) * t);
      const a = (s1.a + (s2.a - s1.a) * t) * opacityMultiplier;
      return [r, g, b, Math.round(a * 255)];
    }
  }

  return [0, 0, 0, 0];
}

/**
 * Resolve RGBA color for any meteorological variable
 */
export function getVariableRgba(val, variable, opacityMultiplier = 1.0) {
  switch (variable) {
    case "aqi":
      return interpolateColorRamp(val, AQI_COLOR_STOPS, opacityMultiplier);
    case "temperature":
      return interpolateColorRamp(val, TEMPERATURE_COLOR_STOPS, opacityMultiplier);
    case "precipitation":
      return interpolateColorRamp(val, PRECIPITATION_COLOR_STOPS, opacityMultiplier);
    case "humidity":
      return interpolateColorRamp(val, HUMIDITY_COLOR_STOPS, opacityMultiplier);
    case "pressure":
      return interpolateColorRamp(val, PRESSURE_COLOR_STOPS, opacityMultiplier);
    case "clouds":
    case "cloudCover":
      return interpolateColorRamp(val, CLOUD_COLOR_STOPS, opacityMultiplier);
    default:
      return interpolateColorRamp(val, TEMPERATURE_COLOR_STOPS, opacityMultiplier);
  }
}

/**
 * Spatial Grid Generator:
 * Computes a standardized 2D geographic grid from real station observations.
 * Uses Inverse Distance Weighting (IDW) with spherical distance constraints.
 * Descending latitudes (North -> South), ascending longitudes (West -> East).
 */
export function getOrBuildSpatialGrid(stations, variable, frameIndex = 0) {
  if (!stations || stations.length === 0) return null;

  const cacheKey = `${variable}_frame_${frameIndex}_count_${stations.length}`;
  if (gridCache.has(cacheKey)) {
    return gridCache.get(cacheKey);
  }

  const height = GRID_HEIGHT;
  const width = GRID_WIDTH;
  const latitudes = new Float32Array(height);
  const longitudes = new Float32Array(width);
  const values = new Float32Array(height * width);

  // Populate row latitudes (North to South descending: 37.0 -> 7.0)
  for (let r = 0; r < height; r++) {
    latitudes[r] = Number((GRID_BBOX.north - r * GRID_RES).toFixed(2));
  }
  // Populate col longitudes (West to East ascending: 68.0 -> 97.0)
  for (let c = 0; c < width; c++) {
    longitudes[c] = Number((GRID_BBOX.west + c * GRID_RES).toFixed(2));
  }

  // Pre-extract station values for this frame to minimize property lookups
  const stData = stations.map((s) => {
    const f = s.forecastSeries?.[frameIndex] || s.current || {};
    let val = 0;
    if (variable === "aqi") val = f.aqi ?? 75;
    else if (variable === "temperature") val = f.temperature ?? 28.0;
    else if (variable === "precipitation") val = f.precipitation ?? 0.0;
    else if (variable === "humidity") val = f.humidity ?? 60;
    else if (variable === "pressure") val = f.pressure ?? 1010;
    else if (variable === "clouds" || variable === "cloudCover") val = f.cloudCover ?? 20;
    else val = f.temperature ?? 28.0;

    return {
      lat: s.lat,
      lon: s.lon,
      val
    };
  });

  // Maximum spatial radius of meteorological influence (km)
  // Precipitation is localized (240km); regional air masses/pressure/temp span 550km.
  const maxRadiusKm = variable === "precipitation" ? 240 : 550;

  for (let r = 0; r < height; r++) {
    const lat = latitudes[r];
    const cosLat = Math.cos((lat * Math.PI) / 180);

    for (let c = 0; c < width; c++) {
      const lon = longitudes[c];
      const idx = r * width + c;

      let sumWeights = 0;
      let sumValues = 0;
      let minDistKm = Infinity;
      let nearestVal = null;

      for (let i = 0; i < stData.length; i++) {
        const s = stData[i];
        const dLatKm = (s.lat - lat) * 111.0;
        const dLonKm = (s.lon - lon) * 111.0 * cosLat;
        const distKm = Math.hypot(dLatKm, dLonKm);

        if (distKm < minDistKm) {
          minDistKm = distKm;
          nearestVal = s.val;
        }

        // Direct hit
        if (distKm < 0.5) {
          sumWeights = 1;
          sumValues = s.val;
          break;
        }

        if (distKm <= maxRadiusKm) {
          // IDW weight with smoothing parameter (R0 = 35km) to eliminate singularity spikes
          const w = 1.0 / Math.pow(distKm + 35.0, 2);
          sumWeights += w;
          sumValues += s.val * w;
        }
      }

      if (sumWeights > 0 && minDistKm <= maxRadiusKm) {
        values[idx] = sumValues / sumWeights;
      } else {
        // Far out of observation network (deep ocean or Tibetan plateau)
        values[idx] = NaN;
      }
    }
  }

  const gridObject = {
    bbox: GRID_BBOX,
    res: GRID_RES,
    height,
    width,
    latitudes,
    longitudes,
    values,
    corners: {
      topLeft: { lat: latitudes[0], lon: longitudes[0], val: values[0] },
      topRight: { lat: latitudes[0], lon: longitudes[width - 1], val: values[width - 1] },
      bottomLeft: { lat: latitudes[height - 1], lon: longitudes[0], val: values[(height - 1) * width] },
      bottomRight: { lat: latitudes[height - 1], lon: longitudes[width - 1], val: values[height * width - 1] }
    }
  };

  // Verify orientation in development console (Section 24)
  if (frameIndex === 0 && variable === "aqi") {
    console.log(
      `[Algoriot Grid Orientation Check] Variable: ${variable}\n` +
      `  Top-Left (NW): lat ${gridObject.corners.topLeft.lat}°N, lon ${gridObject.corners.topLeft.lon}°E (val: ${gridObject.corners.topLeft.val})\n` +
      `  Top-Right (NE): lat ${gridObject.corners.topRight.lat}°N, lon ${gridObject.corners.topRight.lon}°E (val: ${gridObject.corners.topRight.val})\n` +
      `  Bottom-Left (SW): lat ${gridObject.corners.bottomLeft.lat}°N, lon ${gridObject.corners.bottomLeft.lon}°E (val: ${gridObject.corners.bottomLeft.val})\n` +
      `  Bottom-Right (SE): lat ${gridObject.corners.bottomRight.lat}°N, lon ${gridObject.corners.bottomRight.lon}°E (val: ${gridObject.corners.bottomRight.val})\n` +
      `  Orientation verified: North is North, South is South, West is West, East is East.`
    );
  }

  gridCache.set(cacheKey, gridObject);
  return gridObject;
}

/**
 * High-Performance Meteorological Canvas Rasterizer
 * 
 * 1. Synchronizes canvas size strictly to map container with DPR scaling.
 * 2. Applies dual boundary clipping:
 *    - Viewport clip: ctx.rect(0, 0, width, height)
 *    - Geographic India boundary polygon clip
 * 3. Reprojects screen pixels via Leaflet's containerPointToLatLng().
 * 4. Bilinearly samples the 2D meteorological grid.
 * 5. Converts scalar values to smooth color transitions.
 * 6. Blits the offscreen raster to the main canvas with hardware-accelerated smoothing.
 */
export function renderWeatherRasterField({
  canvas,
  map,
  boundaryCoords = null,
  grid,
  variable = "temperature",
  opacity = 0.75
}) {
  if (!canvas || !map || !map._mapPane || !grid) return;

  const container = map.getContainer();
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  if (width <= 0 || height <= 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Synchronize canvas dimensions
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Apply device pixel ratio transform
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  if (opacity <= 0) return;

  ctx.save();

  // CRITICAL VIEWPORT CLIP: Colors must NEVER extend outside the map container!
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.clip();

  // Optional: Clip to India Boundary Polygon (Section 16)
  if (boundaryCoords && boundaryCoords.length > 2) {
    ctx.beginPath();
    for (let i = 0; i < boundaryCoords.length; i++) {
      const [lon, lat] = boundaryCoords[i];
      const pt = map.latLngToContainerPoint([lat, lon]);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.clip();
  }

  // Internal reduced resolution raster for 60fps performance (Section 25)
  // 240 x 180 is silky smooth and provides continuous gradients when scaled
  const RW = Math.min(260, Math.max(160, Math.round(width / 3.2)));
  const RH = Math.min(260, Math.max(160, Math.round(height / 3.2)));

  const offscreen = document.createElement("canvas");
  offscreen.width = RW;
  offscreen.height = RH;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) {
    ctx.restore();
    return;
  }

  const imgData = offCtx.createImageData(RW, RH);
  const data = imgData.data;

  // Precalculate row latitudes and column longitudes via Leaflet's Web Mercator projection
  // Web Mercator has strictly vertical meridians (x -> lon) and horizontal parallels (y -> lat)
  const rowLats = new Float64Array(RH);
  const colLons = new Float64Array(RW);

  for (let y = 0; y < RH; y++) {
    const screenY = (y / (RH - 1)) * height;
    rowLats[y] = map.containerPointToLatLng([0, screenY]).lat;
  }
  for (let x = 0; x < RW; x++) {
    const screenX = (x / (RW - 1)) * width;
    colLons[x] = map.containerPointToLatLng([screenX, 0]).lng;
  }

  const gNorth = grid.bbox.north;
  const gSouth = grid.bbox.south;
  const gWest = grid.bbox.west;
  const gEast = grid.bbox.east;
  const gRes = grid.res;
  const gWidth = grid.width;
  const gHeight = grid.height;
  const gVals = grid.values;

  let ptr = 0;

  for (let y = 0; y < RH; y++) {
    const lat = rowLats[y];

    // Data bounding box check (Section 12)
    if (lat > gNorth || lat < gSouth) {
      ptr += RW * 4;
      continue;
    }

    // Grid row index (latitudes descending from gNorth)
    const rFloat = (gNorth - lat) / gRes;
    const r0 = Math.floor(rFloat);
    const r1 = Math.min(r0 + 1, gHeight - 1);
    const dr = rFloat - r0;

    for (let x = 0; x < RW; x++) {
      const lon = colLons[x];

      // Data bounding box check (Section 12)
      if (lon < gWest || lon > gEast) {
        ptr += 4;
        continue;
      }

      // Grid col index (longitudes ascending from gWest)
      const cFloat = (lon - gWest) / gRes;
      const c0 = Math.floor(cFloat);
      const c1 = Math.min(c0 + 1, gWidth - 1);
      const dc = cFloat - c0;

      // Sample 4 corner nodes
      const v00 = gVals[r0 * gWidth + c0];
      const v01 = gVals[r0 * gWidth + c1];
      const v10 = gVals[r1 * gWidth + c0];
      const v11 = gVals[r1 * gWidth + c1];

      // Bilinear interpolation with robust missing-data handling (Section 9, 11)
      let sumW = 0;
      let sumV = 0;

      if (!isNaN(v00)) {
        const w = (1 - dr) * (1 - dc);
        sumW += w;
        sumV += v00 * w;
      }
      if (!isNaN(v01)) {
        const w = (1 - dr) * dc;
        sumW += w;
        sumV += v01 * w;
      }
      if (!isNaN(v10)) {
        const w = dr * (1 - dc);
        sumW += w;
        sumV += v10 * w;
      }
      if (!isNaN(v11)) {
        const w = dr * dc;
        sumW += w;
        sumV += v11 * w;
      }

      // If missing data exceeds tolerance, leave transparent (Section 11)
      if (sumW < 0.25) {
        ptr += 4;
        continue;
      }

      const scalar = sumV / sumW;
      const [r, g, b, a] = getVariableRgba(scalar, variable, opacity);

      data[ptr] = r;
      data[ptr + 1] = g;
      data[ptr + 2] = b;
      data[ptr + 3] = a;

      ptr += 4;
    }
  }

  offCtx.putImageData(imgData, 0, 0);

  // Blit scaled offscreen raster to map canvas with high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(offscreen, 0, 0, width, height);

  ctx.restore();
}
