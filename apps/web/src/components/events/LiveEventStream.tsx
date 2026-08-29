import React, { useEffect, useRef } from "react";
import { Radio, AlertTriangle, ShieldCheck, Atom, TrendingUp, Cpu, Brain } from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";
import { AgentEvent } from "@shared/types";

export const LiveEventStream: React.FC = () => {
  const events = useSimulationStore((s) => s.events);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getEventMeta = (event: AgentEvent) => {
    switch (event.type) {
      case "QML_ENTANGLEMENT":
        return {
          icon: <Atom className="w-3 h-3 text-pink-600" />,
          color: "border-pink-200 bg-pink-50/70 text-pink-950"
        };
      case "TREND_UPDATED":
      case "PYTREND_SPIKE":
        return {
          icon: <TrendingUp className="w-3 h-3 text-amber-600" />,
          color: "border-amber-200 bg-amber-50/70 text-amber-950"
        };
      case "COMMENT":
      case "GROQ_CRITIQUE":
        return {
          icon: <Brain className="w-3 h-3 text-emerald-600" />,
          color: "border-emerald-200 bg-emerald-50/70 text-emerald-950"
        };
      case "ANOMALY_DETECTED":
        return {
          icon: <AlertTriangle className="w-3 h-3 text-rose-600" />,
          color: "border-rose-200 bg-rose-50/70 text-rose-950"
        };
      case "ADMIN_ANALYSIS":
        return {
          icon: <ShieldCheck className="w-3 h-3 text-indigo-600" />,
          color: "border-indigo-200 bg-indigo-50/70 text-indigo-950"
        };
      default:
        return {
          icon: <Cpu className="w-3 h-3 text-sky-600" />,
          color: "border-sky-200 bg-sky-50/70 text-sky-950"
        };
    }
  };

  return (
    <aside className="w-full h-full bg-white border-l border-slate-200/60 flex flex-col select-none shadow-xs">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-slate-800 animate-pulse" />
          <span className="text-xs font-bold text-slate-850 uppercase tracking-wider">
            Live Stream Feed
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/50">
          {events.length} Events
        </span>
      </div>

      {/* Events List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
        {events.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 font-medium italic">
            Awaiting simulation signals...
          </div>
        ) : (
          events.slice(0, 50).map((event) => {
            const meta = getEventMeta(event);
            return (
              <div
                key={event.eventId}
                className={`p-3 border rounded-xl shadow-xs transition-all duration-200 ${meta.color}`}
              >
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider">
                    {meta.icon}
                    <span>{event.type}</span>
                  </div>
                  <span className="text-slate-400 font-medium">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="text-[11px] font-extrabold text-slate-800 flex items-center justify-between">
                  <span>Node #{event.source}</span>
                  {event.target && <span className="text-slate-400 font-medium">→ #{event.target}</span>}
                </div>

                {event.payload && (
                  <div className="text-[10px] text-slate-650 mt-1.5 font-sans line-clamp-2 leading-relaxed font-medium">
                    {event.payload.comment ||
                      event.payload.summary ||
                      event.payload.critique ||
                      `ROAS: ${event.payload.roas || event.payload.quantumRoas || "Active"} | Velocity: ${event.payload.velocity || "Synced"}`}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
