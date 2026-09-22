// Algoriot Hybrid AI-NWP Multi-Model Blending Layer
// Shows verified backend weights if available; otherwise displays accurate unavailability status
import React, { useEffect, useState } from "react";
import { fetchHybridModelInfo } from "../../api/mapApi.js";
import { AlertCircle, Cpu, Network } from "lucide-react";

export function HybridModelCanvasLayer({
  visible = true
}) {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    let isMounted = true;
    setLoading(true);

    fetchHybridModelInfo()
      .then((data) => {
        if (isMounted) {
          setModelData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setModelData({ available: false });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="absolute top-20 right-4 z-400 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-3.5 shadow-lg max-w-xs text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">
        <Cpu className="w-3.5 h-3.5 text-[#0b3d91]" />
        <span>Hybrid Multi-Model Layer</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 py-2">
          <div className="w-3.5 h-3.5 border-2 border-[#0b3d91] border-t-transparent rounded-full animate-spin" />
          <span>Querying backend ensemble blend...</span>
        </div>
      ) : modelData?.available && modelData?.weights ? (
        <div className="space-y-2">
          <div className="text-[11px] text-slate-600">
            Active meta-learner weighting calibrated across synoptic regimes:
          </div>
          <div className="space-y-1">
            {Object.entries(modelData.weights).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center text-slate-700">
                <span className="font-semibold uppercase">{k}:</span>
                <span className="font-mono bg-blue-50 px-1.5 py-0.5 rounded text-[#0b3d91] font-bold">
                  {v}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded p-2 text-amber-900 space-y-1">
          <div className="flex items-center gap-1 font-bold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Hybrid model data unavailable</span>
          </div>
          <p className="text-[10px] text-amber-800 leading-relaxed">
            The external multi-model weighting service is currently initializing or unreachable. No synthetic or invented model percentages will be displayed.
          </p>
        </div>
      )}
    </div>
  );
}
