import React from "react";

export function StatusBadge({ status = "OPERATIONAL", label = "SYSTEM", pulse = true, variant = "success" }) {
  const colors = {
    success: {
      dot: "bg-emerald-400/80",
      text: "text-emerald-300/90",
      border: "border-emerald-500/20",
      bg: "bg-emerald-950/20"
    },
    cyan: {
      dot: "bg-sky-400/80",
      text: "text-sky-300/90",
      border: "border-sky-500/20",
      bg: "bg-sky-950/20"
    },
    amber: {
      dot: "bg-amber-400/80",
      text: "text-amber-300/90",
      border: "border-amber-500/20",
      bg: "bg-amber-950/20"
    },
    rose: {
      dot: "bg-rose-400/80",
      text: "text-rose-300/90",
      border: "border-rose-500/20",
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
    <div className="w-full bg-[#0c1017] border-b border-white/[0.05] px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono-tech text-slate-400 gap-2">
      <div className="flex items-center gap-3">
        <span className="text-slate-200 font-semibold tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-status-pulse" />
          HYBRID WEATHER INTELLIGENCE
        </span>
        <span className="text-white/10 hidden md:inline">|</span>
        <span className="hidden md:inline text-slate-400">SIH 2026 REF: SIH26081</span>
        <span className="text-white/10 hidden md:inline">|</span>
        <span className="hidden lg:inline text-slate-400">DISASTER MANAGEMENT</span>
      </div>
      
      <div className="flex items-center gap-3.5 ml-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
          <span className="text-slate-400">SYSTEM:</span>
          <span className="text-slate-300 font-medium">OPERATIONAL</span>
        </div>
        <span className="text-white/10">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />
          <span className="text-slate-400">PIPELINE:</span>
          <span className="text-slate-300 font-medium">ACTIVE</span>
        </div>
        <span className="text-white/10 hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          <span className="text-slate-400">SOURCE:</span>
          <span className="text-slate-300 font-medium">DEMO MODE</span>
        </div>
      </div>
    </div>
  );
}
