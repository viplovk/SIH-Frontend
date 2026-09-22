import React from "react";

export function StatusBadge({ status = "OPERATIONAL", label = "SYSTEM", pulse = true, variant = "success" }) {
  const colors = {
    success: {
      dot: "bg-emerald-600",
      text: "text-emerald-800",
      border: "border-emerald-200",
      bg: "bg-emerald-50"
    },
    cyan: {
      dot: "bg-[#0b3d91]",
      text: "text-[#0b3d91]",
      border: "border-blue-200",
      bg: "bg-blue-50"
    },
    amber: {
      dot: "bg-amber-600",
      text: "text-amber-800",
      border: "border-amber-200",
      bg: "bg-amber-50"
    },
    rose: {
      dot: "bg-rose-600",
      text: "text-rose-800",
      border: "border-rose-200",
      bg: "bg-rose-50"
    }
  };

  const c = colors[variant] || colors.success;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${c.border} ${c.bg} text-xs font-semibold uppercase tracking-wider`}>
      <span className="text-slate-500 font-medium">{label}:</span>
      <span className={`flex items-center gap-1.5 font-bold ${c.text}`}>
        <span className={`w-2 h-2 rounded-full ${c.dot} ${pulse ? "animate-pulse" : ""}`} />
        {status}
      </span>
    </div>
  );
}

export function TechnicalHeaderLine() {
  return (
    <div className="w-full bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 font-medium">
      <div className="flex items-center gap-3">
        <span className="text-slate-900 font-bold tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0b3d91]" />
          ALGORIOT HYBRID WEATHER INTELLIGENCE
        </span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span className="hidden md:inline text-slate-600">SIH 2026: SIH26081</span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span className="hidden lg:inline text-slate-600">Disaster Management</span>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-slate-500">System:</span>
          <span className="text-slate-900 font-semibold">Operational</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0b3d91]" />
          <span className="text-slate-500">Pipeline:</span>
          <span className="text-slate-900 font-semibold">Active</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-slate-500">Mode:</span>
          <span className="text-slate-900 font-semibold">Demonstration</span>
        </div>
      </div>
    </div>
  );
}
