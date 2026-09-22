import React from "react";
import { DataFlowDiagram } from "../components/research/DataFlowDiagram.jsx";
import { BookOpen, Cpu, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Research() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
              METHODOLOGY & SCIENTIFIC ARCHITECTURE
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Technical foundation for Problem Statement SIH26081: Hybrid AI-NWP Multi-Model Forecast Blending System.
          </p>
        </div>

        <Link
          to="/about"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] text-xs font-mono-tech transition-colors self-start md:self-auto"
        >
          <span>Team & Problem Info</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main End-to-End Visual Dataflow and Stage Inspection */}
      <DataFlowDiagram />

      {/* Novelty & SIH Innovation Statement */}
      <div className="bg-[#111622] border border-cyan-500/30 rounded-lg p-5">
        <h3 className="font-heading font-bold text-base text-white mb-2">
          INNOVATION HIGHLIGHTS FOR SMART INDIA HACKATHON 2026 JURORS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs font-sans">
          
          <div className="bg-[#161d2d] border border-white/[0.04] p-4 rounded-lg">
            <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2 font-bold font-mono-tech">
              01
            </div>
            <h4 className="font-bold text-white mb-1">Overcoming Pure-AI Physical Drift</h4>
            <p className="text-slate-400 leading-relaxed">
              Pure AI weather models minimize mean squared error, which causes artificial blurring and violations of mass/energy conservation. Algoriot constrains AI rollouts with NWP dynamical boundaries.
            </p>
          </div>

          <div className="bg-[#161d2d] border border-white/[0.04] p-4 rounded-lg">
            <div className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 font-bold font-mono-tech">
              02
            </div>
            <h4 className="font-bold text-white mb-1">Regime-Adaptive Meta-Learning</h4>
            <p className="text-slate-400 leading-relaxed">
              Static ensemble averages fail during rapid monsoon onset or cyclonic storm tracks. Algoriot dynamically adjusts model weighting based on real-time atmospheric regime classifications.
            </p>
          </div>

          <div className="bg-[#161d2d] border border-white/[0.04] p-4 rounded-lg">
            <div className="w-8 h-8 rounded bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 font-bold font-mono-tech">
              03
            </div>
            <h4 className="font-bold text-white mb-1">Calibrated Tail-Risk Prediction</h4>
            <p className="text-slate-400 leading-relaxed">
              By combining Conformal Prediction with Generalized Extreme Value (GEV) theory, disaster managers obtain robust 90% uncertainty intervals rather than deceptive single-number forecasts.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
