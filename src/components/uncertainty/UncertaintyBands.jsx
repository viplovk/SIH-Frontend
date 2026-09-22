import React from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { Compass, ShieldCheck, HelpCircle, Activity, Info, BarChart2 } from "lucide-react";
import { 
  UNCERTAINTY_METRICS, 
  UNCERTAINTY_BANDS_DATA, 
  CALIBRATION_CURVE_DATA, 
  VARIABLE_UNCERTAINTIES 
} from "../../data/mockUncertainty.js";
import { useWeather } from "../../context/WeatherContext.jsx";

export function UncertaintyBands() {
  const { selectedLocation } = useWeather();

  const CustomBandTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#101520] border border-white/10 rounded p-2.5 shadow-xl text-xs font-mono-tech text-white space-y-1">
          <div className="text-slate-300 font-semibold border-b border-white/[0.06] pb-1">
            LEAD TIME: {label}
          </div>
          <div className="text-slate-400">P90 Upper Bound: <strong className="text-rose-300/80">{data.p90}°C</strong></div>
          <div className="text-slate-400">P75 Quartile: <strong className="text-amber-300/80">{data.p75}°C</strong></div>
          <div className="text-slate-200 font-medium">Median (P50): <strong>{data.median}°C</strong></div>
          <div className="text-slate-400">P25 Quartile: <strong className="text-emerald-300/80">{data.p25}°C</strong></div>
          <div className="text-slate-400">P10 Lower Bound: <strong className="text-slate-300">{data.p10}°C</strong></div>
          <div className="pt-1 border-t border-white/[0.05] text-[10px] text-slate-500">
            Spread Envelope: {data.spread}°C • Confidence: {data.confidence}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card: Expected Range & Confidence */}
      <div className="bg-[#101520] border border-white/[0.06] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-white/[0.06] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-slate-300" />
              <h2 className="text-lg sm:text-xl font-heading font-semibold text-white tracking-wide">
                FORECAST UNCERTAINTY & CONFIDENCE ENVELOPES
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono-tech mt-1">
              Conformal quantile regression and ensemble residual calibration for {selectedLocation.name}, India.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono-tech">
            <span className="text-xs text-slate-400">Calibration Fidelity:</span>
            <span className="text-xs text-emerald-300/90 font-medium px-2 py-1 rounded bg-emerald-950/30 border border-emerald-500/20">
              ECE 0.024 (CALIBRATED)
            </span>
          </div>
        </div>

        {/* 3 Core Numbers Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141a27] p-4 rounded border border-white/[0.05]">
            <div className="text-xs font-mono-tech text-slate-400 uppercase">
              DETERMINISTIC BLEND
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-semibold text-white mt-1">
              {selectedLocation.baseWeather.temperature}°C
            </div>
            <div className="text-[11px] font-mono-tech text-slate-400 mt-1">
              Weighted Expected Value
            </div>
          </div>

          <div className="bg-[#141a27] p-4 rounded border border-white/10">
            <div className="text-xs font-mono-tech text-slate-300 uppercase font-medium">
              90% EXPECTED RANGE
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-semibold text-slate-100 mt-1">
              {UNCERTAINTY_METRICS.expectedRange.min}°C — {UNCERTAINTY_METRICS.expectedRange.max}°C
            </div>
            <div className="text-[11px] font-mono-tech text-slate-400 mt-1">
              P10 to P90 Credible Interval
            </div>
          </div>

          <div className="bg-[#141a27] p-4 rounded border border-white/[0.05]">
            <div className="text-xs font-mono-tech text-slate-400 uppercase">
              CONFIDENCE SCORE
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-semibold text-emerald-300/90 mt-1">
              {UNCERTAINTY_METRICS.overallConfidence}%
            </div>
            <div className="text-[11px] font-mono-tech text-slate-400 mt-1">
              Tight Model Convergence
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.04] text-xs text-slate-300 leading-relaxed font-sans bg-black/20 p-3 rounded border border-white/[0.03]">
          <strong className="text-slate-200 font-mono-tech">Principle: </strong>
          “Uncertainty represents the estimated range of plausible forecast outcomes. Rather than forcing a single deterministic guess, Algoriot quantifies atmospheric chaos so disaster management agencies can make risk-weighted decisions.”
        </div>
      </div>

      {/* Uncertainty Bands Lead-Time Chart */}
      <div className="bg-[#101520] border border-white/[0.06] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-white/[0.06] gap-2">
          <div>
            <h3 className="font-heading font-semibold text-base text-white">
              LEAD TIME UNCERTAINTY GROWTH (+0h to +72h)
            </h3>
            <p className="text-[11px] font-mono-tech text-slate-400">
              Conformal quantile bands (P10 - P25 - Median - P75 - P90)
            </p>
          </div>
          <div className="text-xs font-mono-tech text-slate-400">
            Dispersion Model: Conformal Heteroscedastic
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={UNCERTAINTY_BANDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="leadTime" stroke="#64748b" fontSize={11} fontFamily="IBM Plex Mono" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="IBM Plex Mono" domain={[22, 42]} />
              <Tooltip content={<CustomBandTooltip />} />

              {/* 90% Outer Band */}
              <Area
                type="monotone"
                dataKey="p90"
                stroke="transparent"
                fill="#7dd3fc"
                fillOpacity={0.08}
                name="P90 Upper"
              />
              <Area
                type="monotone"
                dataKey="p10"
                stroke="transparent"
                fill="#0b0e14"
                fillOpacity={1}
                name="P10 Lower"
              />

              {/* 50% Interquartile Band */}
              <Area
                type="monotone"
                dataKey="p75"
                stroke="transparent"
                fill="#7dd3fc"
                fillOpacity={0.16}
                name="P75 Upper"
              />
              <Area
                type="monotone"
                dataKey="p25"
                stroke="transparent"
                fill="#0b0e14"
                fillOpacity={1}
                name="P25 Lower"
              />

              {/* Median Line */}
              <Line
                type="monotone"
                dataKey="median"
                stroke="#7dd3fc"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#7dd3fc" }}
                name="Median (P50)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono-tech text-slate-400 pt-2 border-t border-white/[0.05]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[#7dd3fc]/20 border border-[#7dd3fc]/30 rounded" /> 90% Plausible Envelope
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[#7dd3fc]/40 border border-[#7dd3fc]/50 rounded" /> 50% Interquartile Core
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#7dd3fc]" /> Median Trajectory
            </span>
          </div>
          <span>Uncertainty expands with forecast lead time</span>
        </div>
      </div>

      {/* Grid: Multi-Variable Uncertainty Table & Calibration Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Variable Dispersion Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#101520] border border-white/[0.06] rounded-lg p-5">
          <h3 className="font-heading font-semibold text-base text-white mb-1">
            VARIABLE-SPECIFIC UNCERTAINTY MATRIX
          </h3>
          <p className="text-[11px] font-mono-tech text-slate-400 mb-4">
            Breakdown of atmospheric physical drivers contributing to prediction spread
          </p>

          <div className="space-y-2.5">
            {VARIABLE_UNCERTAINTIES.map((v) => (
              <div key={v.variable} className="bg-[#141a27] border border-white/[0.04] p-3 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-xs">{v.variable}</span>
                  <span className="text-[11px] font-mono-tech text-emerald-300/90 font-medium">
                    {v.confidence}% Confidence
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech text-slate-300 mb-1.5">
                  <div>Expected: <strong className="text-slate-200">{v.deterministic}</strong></div>
                  <div>90% Range: <strong className="text-white">{v.interval90}</strong></div>
                </div>
                <div className="text-[10px] font-mono-tech text-slate-400">
                  <span className="text-slate-500">Dispersion Driver:</span> {v.dispersionDriver}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reliability Diagram / Calibration Curve (5 cols) */}
        <div className="lg:col-span-5 bg-[#101520] border border-white/[0.06] rounded-lg p-5">
          <h3 className="font-heading font-semibold text-base text-white mb-1">
            CALIBRATION RELIABILITY DIAGRAM
          </h3>
          <p className="text-[11px] font-mono-tech text-slate-400 mb-3">
            Predicted Probability vs Empirical Event Frequency
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CALIBRATION_CURVE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="nominalProb" stroke="#64748b" fontSize={10} fontFamily="IBM Plex Mono" />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="IBM Plex Mono" domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="perfect" stroke="#64748b" strokeDasharray="4 4" name="Perfect Calibration (y=x)" dot={false} />
                <Line type="monotone" dataKey="algoriotHybrid" stroke="#7dd3fc" strokeWidth={2} name="ALGORIOT Hybrid" dot={{ r: 2 }} />
                <Line type="monotone" dataKey="uncalibratedNwp" stroke="#fda4af" strokeWidth={1.5} name="Raw NWP" dot={false} />
                <Line type="monotone" dataKey="rawAi" stroke="#fcd34d" strokeWidth={1.5} name="Raw AI Model" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-[10px] font-mono-tech text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">■ ALGORIOT Hybrid:</span>
              <span>Brier Score 0.082 (Well calibrated)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-300/80">■ Raw NWP:</span>
              <span>Tends to over-forecast precipitation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-300/80">■ Raw AI:</span>
              <span>Under-estimates tail extreme variance</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
