import React from "react";
import { DataFlowDiagram } from "../components/research/DataFlowDiagram.jsx";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Research() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
            <BookOpen className="w-4 h-4 text-[#0b3d91]" />
            <span>Scientific Architecture & Theory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            METHODOLOGY & SCIENTIFIC ARCHITECTURE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Technical foundation for Problem Statement SIH26081: Hybrid AI-NWP Multi-Model Forecast Blending System.
          </p>
        </div>

        <Link
          to="/about"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors self-start md:self-auto"
        >
          <span>Team & Problem Info</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main End-to-End Visual Dataflow and Stage Inspection */}
      <DataFlowDiagram />

      {/* Novelty & SIH Innovation Statement */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <h2 className="font-bold text-lg text-slate-900 mb-2 tracking-tight">
          INNOVATION HIGHLIGHTS FOR SMART INDIA HACKATHON 2026 JURORS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
          
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] mb-3 font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5 tracking-tight">
              Overcoming Pure-AI Physical Drift
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              Pure AI weather models minimize mean squared error, which causes artificial blurring and violations of mass/energy conservation. Algoriot constrains AI rollouts with NWP dynamical boundaries.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] mb-3 font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5 tracking-tight">
              Regime-Adaptive Meta-Learning
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              Static ensemble averages fail during rapid monsoon onset or cyclonic storm tracks. Algoriot dynamically adjusts model weighting based on real-time atmospheric regime classifications.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3d91] mb-3 font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5 tracking-tight">
              Calibrated Tail-Risk Prediction
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              By combining Conformal Prediction with Generalized Extreme Value (GEV) theory, disaster managers obtain robust 90% uncertainty intervals rather than deceptive single-number forecasts.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
