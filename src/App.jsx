import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext.jsx";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { ExplainForecastModal } from "./components/common/ExplainForecastModal.jsx";

// Page Views
import { Dashboard } from "./pages/Dashboard.jsx";
import { Forecast } from "./pages/Forecast.jsx";
import { WeatherMap } from "./pages/WeatherMap.jsx";
import { Models } from "./pages/Models.jsx";
import { Extremes } from "./pages/Extremes.jsx";
import { Uncertainty } from "./pages/Uncertainty.jsx";
import { Research } from "./pages/Research.jsx";
import { About } from "./pages/About.jsx";

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
          {/* Main Top Navigation */}
          <Navbar />

          {/* Core Content Area */}
          <main className="flex-1 w-full pb-12">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/map" element={<WeatherMap />} />
              <Route path="/models" element={<Models />} />
              <Route path="/extremes" element={<Extremes />} />
              <Route path="/uncertainty" element={<Uncertainty />} />
              <Route path="/research" element={<Research />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Persistent Explainability Modal */}
          <ExplainForecastModal />

          {/* Unified Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </WeatherProvider>
  );
}
