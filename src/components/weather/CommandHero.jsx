import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Compass, Sparkles, ChevronRight, Zap, Info } from "lucide-react";
import { useWeather } from "../../context/WeatherContext.jsx";
import gsap from "gsap";

export function CommandHero() {
  const { openExplainModal, selectedLocation } = useWeather();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative py-4 border-b border-white/[0.08] bg-[#0c1017]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Technical Status Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.05] text-[11px] font-mono-tech text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-status-pulse shadow-[0_0_8px_#38bdf8]" />
            <span className="text-white font-semibold tracking-wider">HYBRID WEATHER INTELLIGENCE</span>
            <span className="text-white/20">•</span>
            <span className="text-slate-400">ATMOSPHERIC REGIME DETECTOR: ACTIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">CURRENT FOCUS: <span className="text-cyan-300 font-semibold">{selectedLocation.name.toUpperCase()}, INDIA</span></span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-emerald-400 font-semibold hidden sm:inline">99.8% INFERENCE FIDELITY</span>
          </div>
        </div>

        {/* Command Headline and Intent */}
        <div ref={headlineRef} className="pt-4 pb-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white tracking-tight leading-tight">
              See the atmosphere <span className="text-cyan-400 font-normal">differently.</span>
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Combining physics-based numerical weather prediction with AI-driven atmospheric modeling through regime-aware dynamic blending.
            </p>
          </div>

          {/* Quick Action Badges / Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openExplainModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono-tech transition-all shadow-[0_0_15px_rgba(56,189,248,0.1)] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explain Model Weights</span>
            </button>

            <Link
              to="/research"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-xs font-mono-tech transition-colors"
            >
              <span>Methodology</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
