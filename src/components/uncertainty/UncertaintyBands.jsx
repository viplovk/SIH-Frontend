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
  CartesianGrid
} from "recharts";
import { Compass, ShieldCheck, Activity, Info, BarChart2 } from "lucide-react";
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
        <div className="bg-white border border-slate-300 rounded-md p-3 shadow-md text-xs text-slate-800 space-y-1">
          <div className="text-slate-900 font-bold border-b border-slate-200 pb-1">
            LEAD TIME: {label}
          </div>
          <div className="text-slate-600">P90 Upper Bound: <strong className="text-red-700">{data.p90}°C</strong></div>
          <div className="text-slate-600">P75 Quartile: <strong className="text-amber-700">{data.p75}°C</strong></div>
          <div className="text-slate-900 font-semibold">Median (P50): <strong className="text-[#0b3d91]">{data.median}°C</strong></div>
          <div className="text-slate-600">P25 Quartile: <strong className="text-emerald-700">{data.p25}°C</strong></div>
          <div className="text-slate-600">P10 Lower Bound: <strong>{data.p10}°C</strong></div>
          <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-mono-tech">
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
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-5 border-b border-slate-200 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d91] flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0b3d91]" />
              <span>Statistical Rigor & Conformal Bounds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              FORECAST UNCERTAINTY & CONFIDENCE ENVELOPES
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Conformal quantile regression and ensemble residual calibration for {selectedLocation.name}, India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Calibration Fidelity:</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              ECE 0.024 (CALIBRATED)
            </span>
          </div>
        </div>

        {/* 3 Core Numbers Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Deterministic Blend
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              {selectedLocation.baseWeather.temperature}°C
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Weighted Expected Value
            </div>
          </div>

          <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-200">
            <div className="text-xs font-bold text-[#0b3d91] uppercase tracking-wider">
              90% Expected Range
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0b3d91] mt-1">
              {UNCERTAINTY_METRICS.expectedRange.min}°C — {UNCERTAINTY_METRICS.expectedRange.max}°C
            </div>
            <div className="text-xs text-slate-600 mt-1">
              P10 to P90 Credible Interval
            </div>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-lg border border-emerald-200">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Confidence Score
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mt-1">
              {UNCERTAINTY_METRICS.overallConfidence}%
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Tight Model Convergence
            </div>
          </div>
        </div>

        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-semibold">Institutional Principle: </strong>
          “Uncertainty represents the estimated range of plausible forecast outcomes. Rather than forcing a single deterministic guess, Algoriot quantifies atmospheric chaos so disaster management agencies can make risk-weighted decisions.”
        </div>
      </div>

      {/* Uncertainty Bands Lead-Time Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              LEAD TIME UNCERTAINTY GROWTH (+0h to +72h)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Conformal quantile bands (P10 - P25 - Median - P75 - P90)
            </p>
          </div>
          <div className="text-xs font-mono-tech text-slate-500">
            Dispersion Model: Conformal Heteroscedastic
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={UNCERTAINTY_BANDS_DATA} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="leadTime" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={[22, 42]} />
              <Tooltip content={<CustomBandTooltip />} />

              {/* 90% Outer Band */}
              <Area
                type="monotone"
                dataKey="p90"
                stroke="transparent"
                fill="#0b3d91"
                fillOpacity={0.08}
                name="P90 Upper"
              />
              <Area
                type="monotone"
                dataKey="p10"
                stroke="transparent"
                fill="#ffffff"
                fillOpacity={1}
                name="P10 Lower"
              />

              {/* 50% Interquartile Band */}
              <Area
                type="monotone"
                dataKey="p75"
                stroke="transparent"
                fill="#0b3d91"
                fillOpacity={0.16}
                name="P75 Upper"
              />
              <Area
                type="monotone"
                dataKey="p25"
                stroke="transparent"
                fill="#ffffff"
                fillOpacity={1}
                name="P25 Lower"
              />

              {/* Median Line */}
              <Line
                type="monotone"
                dataKey="median"
                stroke="#0b3d91"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0b3d91", stroke: "#ffffff", strokeWidth: 1.5 }}
                name="Median (P50)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-4 border-t border-slate-200 mt-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[#0b3d91]/15 border border-[#0b3d91]/30 rounded-xs" /> 90% Plausible Envelope
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[#0b3d91]/30 border border-[#0b3d91]/50 rounded-xs" /> 50% Interquartile Core
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#0b3d91]" /> Median Trajectory
            </span>
          </div>
          <span className="text-slate-500 font-mono-tech text-[11px]">Uncertainty expands with forecast lead time</span>
        </div>
      </div>

      {/* Grid: Multi-Variable Uncertainty Table & Calibration Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Variable Dispersion Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            VARIABLE-SPECIFIC UNCERTAINTY MATRIX
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Breakdown of atmospheric physical drivers contributing to prediction spread
          </p>

          <div className="space-y-3">
            {VARIABLE_UNCERTAINTIES.map((v) => (
              <div key={v.variable} className="bg-slate-50 border border-slate-200 p-3.5 rounded-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">{v.variable}</span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {v.confidence}% Confidence
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-1.5 font-medium">
                  <div>Expected: <strong className="text-slate-900">{v.deterministic}</strong></div>
                  <div>90% Range: <strong className="text-[#0b3d91]">{v.interval90}</strong></div>
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Dispersion Driver:</span> {v.dispersionDriver}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reliability Diagram / Calibration Curve (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            CALIBRATION RELIABILITY DIAGRAM
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Predicted Probability vs Empirical Event Frequency
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CALIBRATION_CURVE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nominalProb" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="perfect" stroke="#94a3b8" strokeDasharray="4 4" name="Perfect Calibration (y=x)" dot={false} />
                <Line type="monotone" dataKey="algoriotHybrid" stroke="#0b3d91" strokeWidth={2} name="ALGORIOT Hybrid" dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="uncalibratedNwp" stroke="#dc2626" strokeWidth={1.5} name="Raw NWP" dot={false} />
                <Line type="monotone" dataKey="rawAi" stroke="#d97706" strokeWidth={1.5} name="Raw AI Model" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="font-semibold text-[#0b3d91]">■ ALGORIOT Hybrid:</span>
              <span>Brier Score 0.082 (Well calibrated)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-red-600">■ Raw NWP:</span>
              <span>Tends to over-forecast precipitation</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-amber-600">■ Raw AI:</span>
              <span>Under-estimates tail extreme variance</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
