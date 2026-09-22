// Algoriot Weather Intelligence API Client
// Connected to Python / FastAPI backend and Open-Meteo operational ingest

// Cleanly handle trailing slashes and ensure /api/v1 base path
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const API_BASE_URL = cleanBaseUrl.endsWith("/api/v1") ? cleanBaseUrl : `${cleanBaseUrl}/api/v1`;

// Production default: Real data ONLY. Mock mode is strictly opt-in or disabled
let dynamicMockMode = import.meta.env.VITE_USE_MOCK_DATA === "true";

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  rawBaseUrl: cleanBaseUrl,
  isMockMode: dynamicMockMode
});

export const setMockMode = (enabled) => {
  dynamicMockMode = Boolean(enabled);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("algoriot-mock-mode-change", { detail: { isMockMode: dynamicMockMode } }));
  }
};

export const isMockModeActive = () => dynamicMockMode;

/**
 * Standardized API fetch wrapper with strict real-data guarantees
 */
export async function apiFetch(endpoint, options = {}, mockFallbackFn) {
  if (dynamicMockMode && mockFallbackFn) {
    await new Promise((r) => setTimeout(r, 60));
    return mockFallbackFn();
  }

  // Ensure endpoint starts with a single slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[Algoriot API] Live endpoint ${cleanEndpoint} returned error:`, err.message);
    if (dynamicMockMode && mockFallbackFn) {
      return mockFallbackFn();
    }
    // In real mode, propagate real error state
    throw err;
  }
}

