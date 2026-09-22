import React from "react";

export function StatusBadge({ status = "OPERATIONAL", label = "SYSTEM", pulse = true, variant = "success" }) {
  const colors = {
    success: {
      dot: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20"
    },
    cyan: {
      dot: "bg-cyan-400 shadow-[0_0_8px_#38bdf8]",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20"
    },
    amber: {
      dot: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
      text: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-950/20"
    },
    rose: {
      dot: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
      text: "text-rose-400",
      border: "border-rose-500/30",
      bg: "bg-rose-950/20"
    }
  };

  const c = colors[variant] || colors.success;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${c.border} ${c.bg} font-mono-tech text-[11px] uppercase tracking-wider`}>
      <span className="text-slate-400 font-medium">{label}:</span>
      <span className={`flex items-center gap-1 font-semibold ${c.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${pulse ? "animate-status-pulse" : ""}`} />
        {status}
      </span>
    </div>
  );
}

export function TechnicalHeaderLine() {
  return (
    <div className="w-full bg-[#0e131d] border-b border-white/[0.06] px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono-tech text-slate-400 gap-2">
      <div className="flex items-center gap-3">
        <span className="text-cyan-400/90 font-semibold tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-status-pulse" />
          HYBRID WEATHER INTELLIGENCE
        </span>
        <span className="text-white/20 hidden md:inline">|</span>
        <span className="hidden md:inline text-slate-400">SIH 2026 REF: SIH26081</span>
        <span className="text-white/20 hidden md:inline">|</span>
        <span className="hidden lg:inline text-slate-400">DISASTER MANAGEMENT</span>
      </div>
      
      <div className="flex items-center gap-3.5 ml-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300">SYSTEM:</span>
          <span className="text-emerald-400 font-semibold">OPERATIONAL</span>
        </div>
        <span className="text-white/20">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-slate-300">PIPELINE:</span>
          <span className="text-cyan-400 font-semibold">ACTIVE</span>
        </div>
        <span className="text-white/20 hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-slate-300">SOURCE:</span>
          <span className="text-amber-400 font-semibold">DEMO MODE</span>
        </div>
      </div>
    </div>
  );
}
