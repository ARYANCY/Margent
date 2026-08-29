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
    <aside className="w-full h-full bg-white border-l border-slate-200 flex flex-col select-none shadow-sm">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-3.5 h-3.5 text-slate-800 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-slate-900 uppercase tracking-wider">
            Live Stream Feed
          </span>
        </div>
        <span className="text-[9px] font-mono font-medium text-slate-600 bg-white px-1.5 py-0.2 border border-slate-200">
          {events.length} EVENTS
        </span>
      </div>

      {/* Events List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2.5 space-y-2 font-mono">
        {events.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 font-mono">
            Awaiting simulation signals...
          </div>
        ) : (
          events.slice(0, 50).map((event) => {
            const meta = getEventMeta(event);
            return (
              <div
                key={event.eventId}
                className={`p-2 border shadow-xs transition ${meta.color}`}
              >
                <div className="flex items-center justify-between text-[9px] mb-0.5">
                  <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider">
                    {meta.icon}
                    <span>{event.type}</span>
                  </div>
                  <span className="text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between">
                  <span>#{event.source}</span>
                  {event.target && <span className="text-slate-500 font-normal">→ #{event.target}</span>}
                </div>

                {event.payload && (
                  <div className="text-[10px] text-slate-700 mt-1 font-sans line-clamp-2 leading-tight">
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
