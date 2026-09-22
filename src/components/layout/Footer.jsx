import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 text-slate-600 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Project Identity */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">ALGORIOT</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0b3d91] border border-blue-200 text-[10px] font-bold">
                SIH26081
              </span>
            </div>
            <p className="text-slate-800 font-semibold text-xs">
              Hybrid Weather Intelligence — Physics-informed AI forecasting for a changing atmosphere.
            </p>
            <p className="text-slate-600 text-xs leading-relaxed max-w-lg">
              Developed for Smart India Hackathon under the Disaster Management theme. Resolves regime blindness, static ensemble failures, and uncalibrated forecast uncertainty through condition-adaptive meta-learning.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> SIH Evaluation Ready
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-semibold text-[#0b3d91]">
                <Cpu className="w-4 h-4 text-[#0b3d91]" /> Dynamic Multi-Model Fusion
              </span>
            </div>
          </div>

          {/* Column 2: Architecture Navigation */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="text-slate-600 hover:text-[#0b3d91] transition-colors">Operational Dashboard</Link></li>
              <li><Link to="/map" className="text-slate-600 hover:text-[#0b3d91] transition-colors">Synoptic Weather Map</Link></li>
              <li><Link to="/models" className="text-slate-600 hover:text-[#0b3d91] transition-colors">Model Contributions & Weights</Link></li>
              <li><Link to="/extremes" className="text-slate-600 hover:text-[#0b3d91] transition-colors">Disaster Early Warnings</Link></li>
              <li><Link to="/uncertainty" className="text-slate-600 hover:text-[#0b3d91] transition-colors">Quantified Uncertainty</Link></li>
              <li><Link to="/research" className="text-slate-600 hover:text-[#0b3d91] transition-colors">Scientific Methodology</Link></li>
            </ul>
          </div>

          {/* Column 3: Data Sources & Attribution */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              Data & Specifications
            </h3>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p><strong className="text-slate-900">Problem ID:</strong> SIH26081</p>
              <p><strong className="text-slate-900">Theme:</strong> Disaster Management</p>
              <p><strong className="text-slate-900">Atmospheric Data:</strong> IMD In-Situ AWS, Doppler Radar, ECMWF IFS, NOAA GFS, INSAT-3DR</p>
              <p><strong className="text-slate-900">Surrogates:</strong> Spherical Graph Transformers, FuXi, WeatherNext</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 Team Algoriot. Developed for Smart India Hackathon. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Operational Frontend Active
            </span>
            <Link to="/research" className="text-[#0b3d91] font-semibold hover:underline">
              Technical Specification →
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
