import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, Terminal, Sparkles, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#090c12] text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Project Identity */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-white text-base tracking-wider">ALGORIOT</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono-tech">
                SIH26081
              </span>
            </div>
            <p className="text-slate-300 font-medium text-xs">
              Hybrid Weather Intelligence — Physics-informed AI forecasting for a changing atmosphere.
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-lg">
              Designed for Smart India Hackathon 2026 under the Disaster Management theme. Resolves regime blindness, static ensemble failures, and uncalibrated forecast uncertainty through condition-adaptive meta-learning.
            </p>
            <div className="pt-1 flex items-center gap-3 text-[11px] font-mono-tech text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> JURY READY
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Cpu className="w-3.5 h-3.5" /> MULTI-MODEL BLENDING
              </span>
            </div>
          </div>

          {/* Column 2: Architecture Navigation */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-mono-tech text-slate-300 font-semibold">
              Command Suite
            </h4>
            <ul className="space-y-1.5 text-[12px]">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Operational Dashboard</Link></li>
              <li><Link to="/map" className="hover:text-cyan-400 transition-colors">Interactive Weather Map</Link></li>
              <li><Link to="/models" className="hover:text-cyan-400 transition-colors">Model Benchmarks & Weights</Link></li>
              <li><Link to="/extremes" className="hover:text-cyan-400 transition-colors">Disaster Early Warnings</Link></li>
              <li><Link to="/uncertainty" className="hover:text-cyan-400 transition-colors">Quantified Uncertainty</Link></li>
            </ul>
          </div>

          {/* Column 3: SIH Attribution & Tech Spec */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-mono-tech text-slate-300 font-semibold">
              SIH 2026 Specifications
            </h4>
            <div className="text-[11px] space-y-1 font-mono-tech text-slate-400">
              <p><span className="text-slate-500">Problem ID:</span> SIH26081</p>
              <p><span className="text-slate-500">Theme:</span> Disaster Management</p>
              <p><span className="text-slate-500">Team:</span> Algoriot</p>
              <p><span className="text-slate-500">Frontend:</span> React + Vite + GSAP + Leaflet</p>
              <p><span className="text-slate-500">Backend API:</span> Python / FastAPI / ERA5 / IMD GFS</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono-tech text-slate-500">
          <div>
            © 2026 Team Algoriot. Developed for Smart India Hackathon. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400/90">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              FRONTEND DEMONSTRATION MODE ACTIVE
            </span>
            <Link to="/research" className="text-cyan-400 hover:underline">
              Technical Methodology →
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
