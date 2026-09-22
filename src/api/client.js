// Algoriot Weather Intelligence API Client
// Clean abstraction layer prepared for Python / FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Mock mode preference can be set via env var or dynamically toggled for SIH demonstrations
let dynamicMockMode = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
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
 * Standardized API fetch wrapper with fallback to mock data when backend is offline
 */
export async function apiFetch(endpoint, options = {}, mockFallbackFn) {
  if (dynamicMockMode && mockFallbackFn) {
    // Simulate brief realistic network latency (60-140ms) for polish
    await new Promise((r) => setTimeout(r, 80));
    return mockFallbackFn();
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[Algoriot API] Live endpoint ${endpoint} unavailable, falling back to mock provider:`, err.message);
    if (mockFallbackFn) {
      return mockFallbackFn();
    }
    throw err;
  }
}
